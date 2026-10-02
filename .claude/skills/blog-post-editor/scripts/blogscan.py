#!/usr/bin/env python3
"""blogscan — deterministic evidence for blog-post-editor. stdlib only (PyYAML used if installed).

survey <blog_dir> [--components-dir DIR]... [--json]
    component/highlight usage across posts, open/close conventions, props, available-but-unused components
post <post_file> [--blog-dir DIR] [--n 6] [--json]
    outline, publication status (draft/scheduled/published, date line formats), synopsis sources,
    synopsis<->body verbatim runs, paraphrase suspects, intra-post repeats, cross-post overlap,
    clarity evidence (unexpanded acronyms, long sentences)
show <post_file> (--para LINE | --section LINE | --lines A-B) [--context N] [--mark A-B]...
    verbatim numbered lines of the unit to be edited, from the current file state; ▸ marks lines
    that change, ┆ marks context lines. Use for every question's context block.

Output is evidence, not verdicts.
"""
from __future__ import annotations

import argparse
import bisect
import datetime as dt
import json
import os
import re
import sys
from collections import Counter, defaultdict
from statistics import median

POST_EXT = (".mdx", ".md")
COMP_EXT = (".astro", ".tsx", ".jsx", ".svelte", ".vue")
SYN_FIELDS = ("synopsis", "sypnosis", "summary", "excerpt", "tldr", "lede", "abstract", "description", "intro")
SYN_COMP = re.compile(r"^(synopsis|sypnosis|summary|tldr|lede|intro|abstract)$", re.I)
DATE_FIELDS = ("pubDate", "date", "publishDate", "published", "pubdate")
UPDATED_FIELDS = ("updatedDate", "updated", "lastModified", "modified", "updatedAt")
DATE_FMTS = ("%Y-%m-%d", "%Y/%m/%d", "%b %d %Y", "%B %d %Y", "%b %d, %Y", "%B %d, %Y", "%d %b %Y", "%d %B %Y")
ACR = re.compile(r"\b([A-Z][A-Z0-9]+)(s?)\b")
ACR_SKIP = frozenset("NOT NEVER ALL NO OK YES AND OR THE IS IT DO STOP NOW EVERY ANY ONE BUT WHY YOU TODO FIXME NOTE".split())
ACR_COMMON = frozenset(("API URL HTTP HTTPS CPU GPU RAM AI UI UX CSS HTML JSON SQL PDF USB OS IT CEO CTO TV US UK EU "
                        "FAQ ID PC").split())
LIST_ITEM = re.compile(r"^\s*(?:[-*+]|\d+[.)])\s")
LONG_SENT = 30
STOP = frozenset((
    "a an the and or but if then so of to in on at by for with from as is are was were be been being it its it's "
    "this that these those i i'm me my we our you your he she they them their his her not no do does did have has "
    "had will would can could should may might must just very really also than too into out up down over about "
    "there here what which who when where why how all any some each more most other such only same"
).split())

FENCE = re.compile(r"^\s*(```+|~~~+)")
TAG_START = re.compile(r"<(/?)([A-Za-z][\w.:-]*)")
IMPORT_RE = re.compile(r"""^import\s+(.+?)\s+from\s+['"]([^'"]+)['"]""", re.S | re.M)
WORD = re.compile(r"[^\W_]+(?:['’][^\W_]+)*")


# ---------- parsing ----------

def split_fm(lines):
    if lines and lines[0].strip() == "---":
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                return lines[1:i], i + 1
    return [], 0


def parse_fm(fm_lines):
    src = "\n".join(fm_lines)
    try:
        import yaml  # type: ignore
        d = yaml.safe_load(src) or {}
        if isinstance(d, dict):
            return {str(k): v for k, v in d.items()}
    except Exception:
        pass
    d, i = {}, 0
    key_re = re.compile(r"^([A-Za-z_][\w-]*):\s*(.*)$")
    while i < len(fm_lines):
        m = key_re.match(fm_lines[i])
        if not m:
            i += 1
            continue
        key, val = m.group(1), m.group(2).strip()
        i += 1
        block = []
        while i < len(fm_lines) and (fm_lines[i][:1] in (" ", "\t", "-") or not fm_lines[i].strip()):
            block.append(fm_lines[i].strip())
            i += 1
        if val[:1] in ("|", ">"):
            d[key] = ("\n" if val[0] == "|" else " ").join(b for b in block).strip()
        elif val == "":
            d[key] = [b.lstrip("- ").strip("'\"") for b in block if b]
        else:
            if len(val) >= 2 and val[0] == val[-1] and val[0] in "'\"":
                val = val[1:-1]
            if block:
                val = " ".join([val] + [b for b in block if b])
            d[key] = val
    return d


def classify(lines, start):
    kinds = ["fm"] * len(lines)
    fence, in_import = None, False
    for i in range(start, len(lines)):
        ln, s = lines[i], lines[i].strip()
        if fence:
            kinds[i] = "code"
            if s.startswith(fence) and s.strip("`~") == "":
                fence = None
            continue
        m = FENCE.match(ln)
        if m:
            fence, kinds[i] = m.group(1), "fence"
            continue
        if in_import:
            kinds[i] = "import"
            if re.search(r"""from\s+['"]""", s):
                in_import = False
            continue
        if re.match(r"^(import|export)\s", ln):
            kinds[i] = "import"
            if ln.startswith("import") and not re.search(r"""from\s+['"]|^import\s+['"]""", s):
                in_import = True
            continue
        kinds[i] = "blank" if not s else "heading" if re.match(r"^#{1,6}\s", s) else "text"
    return kinds


def scan_tags(s, components_only=False):
    """Yield (start, end, name, attrs, closing, selfclose). Brace- and quote-aware, handles nested {}."""
    pos = 0
    while True:
        m = TAG_START.search(s, pos)
        if not m:
            return
        closing, name = m.group(1) == "/", m.group(2)
        pos = m.end()
        if components_only and (closing or not name[0].isupper()):
            continue
        i, depth, q, ok, limit = m.end(), 0, None, False, min(len(s), m.end() + 4000)
        while i < limit:
            c = s[i]
            if q:
                if c == q and s[i - 1] != "\\":
                    q = None
            elif c in "\"'`":
                if depth == 0 and not re.search(r"=\s*$", s[m.end():i]):
                    break  # prose apostrophe, not an attribute value
                q = c
            elif c == "{":
                depth += 1
            elif c == "}":
                depth = max(0, depth - 1)
            elif c == ">" and depth == 0:
                ok = True
                break
            elif c == "<" and depth == 0:
                break
            i += 1
        attrs = s[m.end():i]
        if not ok or (attrs and not (attrs[0].isspace() or attrs[0] == "/")):
            continue
        pos = i + 1
        yield m.start(), i + 1, name, attrs, closing, attrs.rstrip().endswith("/")


def blank_tags(s):
    out, last = [], 0
    for a, b, *_ in scan_tags(s):
        out.append(s[last:a])
        out.append(blank_str(s[a:b]))
        last = b
    out.append(s[last:])
    return "".join(out)


def blank_match(m):
    return re.sub(r"[^\n]", " ", m.group(0))


def blank_str(s):
    return re.sub(r"[^\n]", " ", s)


def strip_inline_code(s):
    return re.sub(r"`[^`\n]*`", blank_match, s)


def clean(s, drop=()):
    """Same-length cleanup: keeps offsets, removes non-prose."""
    for a, b in drop:
        s = s[:a] + blank_str(s[a:b]) + s[b:]
    s = strip_inline_code(s)
    s = blank_tags(s)
    s = re.sub(r"\{[^{}]*\}", blank_match, s)
    s = re.sub(r"!\[[^\]]*\]\([^)]*\)", blank_match, s)
    s = re.sub(r"\]\([^)]*\)", lambda m: "]" + " " * (len(m.group(0)) - 1), s)
    s = re.sub(r"\[\^[^\]]+\]:?", blank_match, s)
    s = re.sub(r"^\s*>\s*\[![A-Za-z]+\]", blank_match, s, flags=re.M)
    s = re.sub(r"^\s*:::[\w-]*.*$", blank_match, s, flags=re.M)
    s = re.sub(r"https?://\S+", blank_match, s)
    return s


def squash(s, limit=None):
    s = re.sub(r"\s+", " ", s).strip()
    return s if limit is None or len(s) <= limit else s[: limit - 1] + "…"


def words_of(s):
    return [m.group(0).lower().replace("’", "'") for m in WORD.finditer(clean(s))]


def stem(w):
    w = w.replace("'", "")
    return w[:5] if len(w) > 5 else w


def content_stems(ws):
    return {stem(w) for w in ws if w not in STOP and len(w) >= 3}


class Doc:
    def __init__(self, path):
        self.path = path
        with open(path, encoding="utf-8") as f:
            self.text = f.read().replace("\r\n", "\n")
        self.lines = self.text.split("\n")
        fm_lines, self.body_start = split_fm(self.lines)
        self.fm = parse_fm(fm_lines)
        self.kinds = classify(self.lines, self.body_start)
        prose = ("text", "heading", "blank")
        nc_lines = [ln if k in prose else "" for ln, k in zip(self.lines, self.kinds)]
        self.nc = "\n".join(nc_lines)
        self.starts, off = [], 0
        for ln in nc_lines:
            self.starts.append(off)
            off += len(ln) + 1
        self.body_off = self.starts[self.body_start] if self.body_start < len(self.starts) else 0
        self._tags = None

    def lineno(self, off):
        return bisect.bisect_right(self.starts, off)

    def tokens(self, drop=()):
        s = clean(self.nc, drop)
        return [(m.group(0).lower().replace("’", "'"), self.lineno(m.start())) for m in WORD.finditer(s)]

    def headings(self):
        out = []
        for i, k in enumerate(self.kinds):
            if k == "heading":
                s = self.lines[i].strip()
                lvl = len(s) - len(s.lstrip("#"))
                out.append((i + 1, lvl, squash(clean(s.lstrip("#")))))
        return out

    def imports(self):
        src = "\n".join(ln for ln, k in zip(self.lines, self.kinds) if k == "import")
        out = {}
        for m in IMPORT_RE.finditer(src):
            spec, path = m.group(1).strip(), m.group(2)
            d = re.match(r"^([A-Za-z_$][\w$]*)", spec)
            if d:
                out[d.group(1)] = path
            br = re.search(r"\{([^}]*)\}", spec)
            if br:
                for part in br.group(1).split(","):
                    part = part.strip()
                    if part:
                        out[re.split(r"\s+as\s+", part)[-1].strip()] = path
            ns = re.search(r"\*\s+as\s+(\w+)", spec)
            if ns:
                out[ns.group(1)] = path
        return out

    def tags(self):
        if self._tags is not None:
            return self._tags
        s = strip_inline_code(self.nc)
        out = []
        for start, stop, name, attrs, _, selfclose in scan_tags(s, components_only=True):
            attrs = attrs or ""
            inner, end = "", stop
            if not selfclose:
                c = re.search(r"</%s\s*>" % re.escape(name), s[stop:])
                if c:
                    end = stop + c.end()
                    inner = self.nc[stop: stop + c.start()]
            out.append(dict(
                name=name, start=start, end=end, line=self.lineno(start),
                props=re.findall(r"([A-Za-z_][\w-]*)\s*=", attrs),
                attrs=squash(attrs.rstrip("/ "), 80), inner_full=squash(clean(inner)),
                inner=squash(clean(inner), 90), selfclose=selfclose,
            ))
        self._tags = out
        return out

    def prose(self, headings=True):
        s = clean(self.nc)
        if not headings:
            for i, k in enumerate(self.kinds):
                if k == "heading":
                    a = self.starts[i]
                    s = s[:a] + " " * len(self.lines[i]) + s[a + len(self.lines[i]):]
        return s

    def status(self):
        today = dt.date.today()
        fm = self.fm
        raw = [ln.rstrip() for ln in self.lines[1:max(1, self.body_start - 1)]
               if re.match(r"^(%s|draft|published):" % "|".join(DATE_FIELDS + UPDATED_FIELDS), ln)]
        draft = fm.get("draft") is True or str(fm.get("draft")).lower() == "true"
        if isinstance(fm.get("published"), bool) and fm.get("published") is False:
            draft = True
        pub_key = next((k for k in DATE_FIELDS if k in fm and not isinstance(fm[k], bool)), None)
        pub = parse_date(fm[pub_key]) if pub_key else None
        upd_key = next((k for k in UPDATED_FIELDS if k in fm), None)
        st = "draft" if draft else "unknown" if pub is None else "scheduled" if pub > today else "published"
        return {"status": st, "today": today.isoformat(), "pub_field": pub_key,
                "pub": pub.isoformat() if pub else None, "updated_field": upd_key,
                "updated": str(fm[upd_key]) if upd_key else None, "raw_lines": raw}

    def acronyms(self):
        s, seen = self.prose(), {}
        for m in ACR.finditer(s):
            a = m.group(1)
            if a in ACR_SKIP or a.isdigit() or len(a) > 6 or a in seen:
                continue
            expanded = s[m.end():m.end() + 3].lstrip().startswith("(") or s[max(0, m.start() - 1):m.start()] == "("
            seen[a] = {"acronym": m.group(0), "line": self.lineno(m.start()), "expanded": expanded, "common": a in ACR_COMMON}
        return list(seen.values())

    def sentences(self):
        s, out = self.prose(headings=False), []
        chunk_start, chunk = None, []

        def flush():
            if chunk:
                text = "".join(chunk)
                for m in re.finditer(r"[^.!?]+[.!?]*", text):
                    ws = WORD.findall(m.group(0))
                    if ws:
                        out.append({"line": self.lineno(chunk_start + m.start() + len(m.group(0)) - len(m.group(0).lstrip())),
                                    "words": len(ws), "text": squash(m.group(0), 100)})
        for i, k in enumerate(self.kinds):
            line = s[self.starts[i]: self.starts[i] + len(self.lines[i])]
            new_chunk = not line.strip() or LIST_ITEM.match(self.lines[i]) or self.lines[i].lstrip().startswith("|")
            if new_chunk:
                flush()
                chunk, chunk_start = [], None
            if line.strip():
                if chunk_start is None:
                    chunk_start = self.starts[i]
                    chunk = []
                chunk.append(line + "\n")
        flush()
        return out

    def frac(self, off):
        span = max(1, len(self.nc) - self.body_off)
        return max(0.0, (off - self.body_off) / span)

    def date(self):
        for f in DATE_FIELDS:
            if self.fm.get(f):
                return str(self.fm[f])[:10]
        return ""

    def fences(self):
        return [i + 1 for i, k in enumerate(self.kinds) if k == "fence"]

    def features(self):
        nc = strip_inline_code(self.nc)
        return {
            "footnotes": len(re.findall(r"\[\^[^\]]+\](?!:)", nc)),
            "gfm_alerts": len(re.findall(r"^\s*>\s*\[![A-Za-z]+\]", nc, re.M)),
            "directives": len(re.findall(r"^\s*:::[\w-]+", nc, re.M)),
            "blockquotes": len(re.findall(r"^\s*>(?!\s*\[!)", nc, re.M)),
            "tables": len(re.findall(r"^\s*\|.*\|\s*$\n^\s*\|[\s:|-]+\|\s*$", nc, re.M)),
            "images": len(re.findall(r"!\[[^\]]*\]\(", nc)),
            "code_blocks": len(self.fences()),
            "h2": sum(1 for _, l, _ in self.headings() if l == 2),
        }


def parse_date(v):
    if isinstance(v, dt.datetime):
        return v.date()
    if isinstance(v, dt.date):
        return v
    t = str(v).strip().strip("'\"")
    try:
        return dt.date.fromisoformat(t[:10])
    except ValueError:
        pass
    for f in DATE_FMTS:
        try:
            return dt.datetime.strptime(t, f).date()
        except ValueError:
            pass
    return None


def heading_before(heads, line):
    h = None
    for ln, _, txt in heads:
        if ln <= line:
            h = txt
        else:
            break
    return h


def slug_of(path, blog_dir):
    rel = os.path.splitext(os.path.relpath(path, blog_dir))[0]
    if os.path.basename(rel) == "index":
        rel = os.path.dirname(rel)
    return rel.replace(os.sep, "/")


def find_posts(blog_dir):
    for r, _, fs in os.walk(blog_dir):
        for f in fs:
            if f.endswith(POST_EXT):
                yield os.path.join(r, f)


def project_root(start):
    d = os.path.abspath(start)
    while True:
        if os.path.isfile(os.path.join(d, "package.json")) or any(
                f.startswith("astro.config.") for f in os.listdir(d)):
            return d
        p = os.path.dirname(d)
        if p == d:
            return os.getcwd()
        d = p


def load_aliases(root):
    try:
        raw = open(os.path.join(root, "tsconfig.json"), encoding="utf-8").read()
        raw = re.sub(r'("(?:\\.|[^"\\])*")|//[^\n]*|/\*.*?\*/', lambda m: m.group(1) or "", raw, flags=re.S)
        raw = re.sub(r",(\s*[}\]])", r"\1", raw)
        co = json.loads(raw).get("compilerOptions", {})
    except Exception:
        return []
    base = os.path.join(root, co.get("baseUrl", "."))
    out = []
    for k, v in (co.get("paths") or {}).items():
        if v:
            out.append((k.rstrip("*"), os.path.join(base, v[0])))
    return sorted(out, key=lambda x: -len(x[0]))


def resolve_import(post, spec, aliases):
    if spec.startswith("."):
        base = os.path.normpath(os.path.join(os.path.dirname(post), spec))
    else:
        base = None
        for pre, tgt in aliases:
            if pre and spec.startswith(pre):
                base = os.path.normpath(tgt.replace("*", spec[len(pre):]))
                break
        if base is None:
            return None
    for c in [base] + [base + e for e in COMP_EXT] + [os.path.join(base, "index" + e) for e in COMP_EXT]:
        if os.path.isfile(c):
            return c
    return None


def component_api(path):
    try:
        s = open(path, encoding="utf-8").read()
    except Exception:
        return None, []
    props = None
    m = re.search(r"(?:interface\s+\w*Props\b[^{]*|type\s+\w*Props\s*=\s*)\{", s)
    if m:
        i = j = m.end()
        depth = 1
        while j < len(s) and depth:
            depth += {"{": 1, "}": -1}.get(s[j], 0)
            j += 1
        props = squash(s[i:j - 1], 240)
    else:
        m = re.search(r"const\s*\{([^}]*)\}\s*=\s*Astro\.props", s) or re.search(r"let\s*\{([^}]*)\}\s*=\s*\$props\(\)", s)
        if m:
            props = squash(m.group(1), 240)
        else:
            ex = re.findall(r"export\s+let\s+(\w+)", s)
            props = ", ".join(ex) or None
    slots = sorted({x or "default" for x in re.findall(r"<slot(?:\s+name=[\"']([^\"']+)[\"'])?", s)})
    return props, slots


def rel(path, root):
    try:
        return os.path.relpath(path, root)
    except ValueError:
        return path


# ---------- overlap ----------

def shingles(toks, n):
    out = defaultdict(list)
    need = max(3, n // 2)
    for i in range(len(toks) - n + 1):
        g = tuple(t[0] for t in toks[i:i + n])
        if sum(1 for w in g if w not in STOP) >= need:
            out[g].append(i)
    return out


def runs(idx):
    idx = sorted(idx)
    res = []
    for i in idx:
        if res and i == res[-1][1] + 1:
            res[-1][1] = i
        else:
            res.append([i, i])
    return res


def span_info(toks, a, b):
    return {"lines": [toks[a][1], toks[b][1]], "words": b - a + 1,
            "text": squash(" ".join(t[0] for t in toks[a:b + 1]), 160)}


def verbatim(src_toks, body_toks, n):
    src, body = shingles(src_toks, n), shingles(body_toks, n)
    cov, scov = set(), set()
    for g, idxs in body.items():
        if g in src:
            for i in idxs:
                cov.update(range(i, i + n))
            for j in src[g]:
                scov.update(range(j, j + n))
    spans = [span_info(body_toks, a, b) for a, b in runs(cov)]
    return spans, round(len(scov) / max(1, len(src_toks)), 2), cov


def repeats(toks, n):
    sh = shingles(toks, n)
    pairs = set()
    for idxs in sh.values():
        for x in range(len(idxs)):
            for y in range(x + 1, len(idxs)):
                if idxs[y] - idxs[x] >= n:
                    pairs.add((idxs[x], idxs[y]))
    seen, res = set(), []
    for i, j in sorted(pairs):
        if (i, j) in seen:
            continue
        k = 0
        while (i + k, j + k) in pairs:
            seen.add((i + k, j + k))
            k += 1
        ln = k + n - 1
        res.append({"words": ln, "text": squash(" ".join(t[0] for t in toks[i:i + ln]), 160),
                    "at": [toks[i][1], toks[j][1]]})
    return sorted(res, key=lambda r: -r["words"])[:15]


def paragraphs(doc, toks):
    pid, cur, para_of = -1, None, {}
    for i, k in enumerate(doc.kinds):
        if k == "text":
            if cur is None:
                pid += 1
                cur = pid
            para_of[i + 1] = cur
        else:
            cur = None
    paras = defaultdict(list)
    for i, (w, ln) in enumerate(toks):
        if ln in para_of:
            paras[para_of[ln]].append((w, ln, i))
    return paras


# ---------- commands ----------

def cmd_post(a):
    doc = Doc(a.post)
    blog_dir = a.blog_dir or os.path.dirname(a.post)
    n = a.n
    tags = doc.tags()
    heads = doc.headings()

    sources, drop = [], []
    for f in SYN_FIELDS:
        v = doc.fm.get(f)
        if isinstance(v, str) and v.strip():
            sources.append(("frontmatter." + f, v.strip()))
    for t in tags:
        if SYN_COMP.match(t["name"].split(".")[-1]) and t["inner_full"]:
            sources.append(("<%s> L%d" % (t["name"], t["line"]), t["inner_full"]))
            drop.append((t["start"], t["end"]))
    body = doc.tokens(drop)
    title = str(doc.fm.get("title") or "")

    # outline
    bounds = [(0, 0, "(intro)")] + heads
    sec_words = Counter()
    for _, ln in body:
        sec_words[heading_before(heads, ln) or "(intro)"] += 1
    sents = doc.sentences()
    sec_sent = defaultdict(list)
    for x in sents:
        sec_sent[heading_before(heads, x["line"]) or "(intro)"].append(x["words"])
    outline = []
    for ln, lvl, txt in bounds:
        key = txt if ln else "(intro)"
        comps = Counter(t["name"] for t in tags if (heading_before(heads, t["line"]) or "(intro)") == key)
        code = sum(1 for f in doc.fences() if (heading_before(heads, f) or "(intro)") == key)
        if ln == 0 and not sec_words[key] and not comps:
            continue
        sl = sec_sent.get(key) or []
        outline.append({"line": ln or doc.body_start + 1, "level": lvl, "heading": key,
                        "words": sec_words[key], "components": dict(comps), "code_blocks": code,
                        "avg_sentence": round(sum(sl) / len(sl), 1) if sl else 0})

    # synopsis checks
    syn = []
    paras = paragraphs(doc, body)
    for name, text in sources:
        st = [(w, None) for w in words_of(text)]
        spans, cov, covered = verbatim(st, body, n)
        sset = content_stems(w for w, _ in st)
        sus = []
        for pid, pt in paras.items():
            if sum(1 for *_, i in pt if i in covered) >= 0.6 * len(pt):
                continue  # already reported as verbatim
            shared = sset & content_stems(w for w, *_ in pt)
            ratio = len(shared) / max(1, len(sset))
            if ratio >= 0.4 and len(shared) >= (3 if len(sset) < 6 else 4):
                sus.append({"lines": [pt[0][1], pt[-1][1]], "ratio": round(ratio, 2), "shared": len(shared),
                            "text": squash(" ".join(w for w, *_ in pt), 90)})
        sus.sort(key=lambda x: -x["ratio"])
        tset = content_stems(words_of(title))
        syn.append({"source": name, "words": len(st), "text": squash(text, 200), "verbatim_coverage": cov,
                    "verbatim_runs": spans, "paraphrase_suspects": sus[:3],
                    "title_overlap": round(len(sset & tset) / max(1, len(tset)), 2) if tset else None})
    pair = []
    for i in range(len(sources)):
        for j in range(i + 1, len(sources)):
            x, y = content_stems(words_of(sources[i][1])), content_stems(words_of(sources[j][1]))
            pair.append({"pair": [sources[i][0], sources[j][0]],
                         "overlap": round(len(x & y) / max(1, min(len(x), len(y))), 2)})

    # cross-post
    tsh = shingles(body, n + 2)
    cross = []
    target_abs = os.path.abspath(a.post)
    for p in sorted(find_posts(blog_dir)):
        if os.path.abspath(p) == target_abs:
            continue
        try:
            od = Doc(p)
        except Exception:
            continue
        osh = shingles(od.tokens(), n + 2)
        cov = set()
        for g, idxs in tsh.items():
            if g in osh:
                for i in idxs:
                    cov.update(range(i, i + n + 2))
        if cov:
            sp = sorted((span_info(body, x, y) for x, y in runs(cov)), key=lambda s: -s["words"])
            cross.append({"post": slug_of(p, blog_dir), "runs": len(sp), "words": sum(s["words"] for s in sp),
                          "top": sp[:3]})
    cross.sort(key=lambda c: -c["words"])

    acr = doc.acronyms()
    longs = sorted((x for x in sents if x["words"] > LONG_SENT), key=lambda x: -x["words"])
    res = {"post": a.post, "status": doc.status(), "words": len(body), "sections": len(heads), "components": len(tags),
           "features": doc.features(), "imports": doc.imports(), "outline": outline,
           "clarity": {"unexpanded_acronyms": [x for x in acr if not x["expanded"]],
                       "long_sentences": longs[:10], "long_sentence_count": len(longs),
                       "avg_sentence": round(sum(x["words"] for x in sents) / len(sents), 1) if sents else 0},
           "synopsis_sources": syn, "synopsis_pairwise": pair,
           "intra_repeats": repeats(body, n + 1), "cross_post": cross}
    if a.json:
        print(json.dumps(res, indent=1, ensure_ascii=False))
        return
    st = res["status"]
    out = ["# post %s" % a.post,
           "%dw · %d headings · %d components · %s" % (
               res["words"], res["sections"], res["components"],
               " · ".join("%s %d" % kv for kv in res["features"].items() if kv[1])),
           "status: %s (%s %s · today %s) · updated: %s" % (
               st["status"], st["pub_field"] or "no date field", st["pub"] or "-", st["today"],
               "%s %s" % (st["updated_field"], st["updated"]) if st["updated_field"] else "none"),
           "date lines: " + (" | ".join(st["raw_lines"]) or "none")]
    imps = res["imports"]
    used = {t["name"].split(".")[0] for t in tags}
    unused = sorted(set(imps) - used)
    missing = sorted(used - set(imps))
    if unused:
        out.append("unused imports: " + ", ".join(unused))
    if missing:
        out.append("used, not imported (global?): " + ", ".join(missing))
    out.append("\n## outline")
    for o in outline:
        c = ", ".join("%s×%d" % kv for kv in o["components"].items())
        out.append("L%-4d %s %s — %dw%s%s%s" % (o["line"], "h%d" % o["level"] if o["level"] else "  ", o["heading"],
                                               o["words"], " · avg %sw/sentence" % o["avg_sentence"] if o["avg_sentence"] else "",
                                               " · " + c if c else "",
                                               " · code %d" % o["code_blocks"] if o["code_blocks"] else ""))
    out.append("\n## synopsis sources")
    if not syn:
        out.append("none found (fields: %s; components: %s)" % (", ".join(SYN_FIELDS), SYN_COMP.pattern))
    for s in syn:
        out.append("- %s (%dw)%s: \"%s\"" % (s["source"], s["words"],
                                             " · title overlap %.2f" % s["title_overlap"] if s["title_overlap"] is not None else "",
                                             s["text"]))
    for p in pair:
        out.append("- pairwise %s ~ %s: %.2f" % (p["pair"][0], p["pair"][1], p["overlap"]))
    for s in syn:
        out.append("\n## verbatim runs %s ↔ body (n=%d) · synopsis coverage %d%%" % (s["source"], n, s["verbatim_coverage"] * 100))
        out += ["- L%d–%d (%dw): \"%s\"" % (r["lines"][0], r["lines"][1], r["words"], r["text"]) for r in s["verbatim_runs"]] or ["none"]
        out.append("## paraphrase suspects %s (content-stem overlap)" % s["source"])
        out += ["- L%d–%d ratio %.2f (%d shared): \"%s\"" % (x["lines"][0], x["lines"][1], x["ratio"], x["shared"], x["text"])
                for x in s["paraphrase_suspects"]] or ["none"]
    cl = res["clarity"]
    out.append("\n## clarity evidence · avg %sw/sentence" % cl["avg_sentence"])
    un = cl["unexpanded_acronyms"]
    rare = ["%s L%d" % (x["acronym"], x["line"]) for x in un if not x["common"]]
    com = ["%s L%d" % (x["acronym"], x["line"]) for x in un if x["common"]]
    out.append("acronyms unexpanded at first use: %s" % (", ".join(rare) or "none"))
    if com:
        out.append("common acronyms unexpanded (mixed audience — judge): " + ", ".join(com))
    out.append("sentences >%dw: %d" % (LONG_SENT, cl["long_sentence_count"]))
    out += ["- L%d (%dw): \"%s\"" % (x["line"], x["words"], x["text"]) for x in cl["long_sentences"]]
    out.append("\n## intra-post repeats (n=%d)" % (n + 1))
    out += ["- %dw at L%d & L%d: \"%s\"" % (r["words"], r["at"][0], r["at"][1], r["text"]) for r in res["intra_repeats"]] or ["none"]
    out.append("\n## cross-post overlap (n=%d)" % (n + 2))
    for c in cross[:8]:
        out.append("- %s: %d runs, %dw" % (c["post"], c["runs"], c["words"]))
        out += ["  - L%d–%d (%dw): \"%s\"" % (s["lines"][0], s["lines"][1], s["words"], s["text"]) for s in c["top"]]
    if not cross:
        out.append("none")
    print("\n".join(out))


def cmd_survey(a):
    blog_dir = a.blog_dir
    root = project_root(blog_dir)
    aliases = load_aliases(root)
    docs = []
    for p in sorted(find_posts(blog_dir)):
        try:
            docs.append(Doc(p))
        except Exception as e:
            print("skip %s: %s" % (p, e), file=sys.stderr)
    docs.sort(key=lambda d: d.date(), reverse=True)
    mdx = [d for d in docs if d.path.endswith(".mdx")]

    comps = defaultdict(lambda: {"posts": set(), "uses": 0, "pos": Counter(), "props": Counter(),
                                 "heads": Counter(), "samples": [], "specs": Counter(), "file": None,
                                 "not_imported": 0})
    opens, closes = Counter(), Counter()
    feat_posts, feat_counts = Counter(), defaultdict(list)
    per_post, dens, wcounts = [], [], []
    used_files = set()

    for d in docs:
        slug = slug_of(d.path, blog_dir)
        words = len(d.tokens())
        wcounts.append(words)
        for k, v in d.features().items():
            if v:
                feat_posts[k] += 1
                feat_counts[k].append(v)
        if not d.path.endswith(".mdx"):
            per_post.append({"slug": slug, "date": d.date(), "words": words, "components": 0, "md": True})
            continue
        imps, tags, heads = d.imports(), d.tags(), d.headings()
        for t in tags:
            c = comps[t["name"]]
            c["posts"].add(slug)
            c["uses"] += 1
            fr = d.frac(t["start"])
            c["pos"]["open" if fr < 0.15 else "close" if fr > 0.85 else "mid"] += 1
            c["props"].update(t["props"])
            c["heads"][heading_before(heads, t["line"]) or "(intro)"] += 1
            if len(c["samples"]) < 3 and (t["inner"] or t["attrs"]):
                c["samples"].append("[%s L%d] %s" % (slug, t["line"], t["inner"] or "<%s %s/>" % (t["name"], t["attrs"])))
            base = t["name"].split(".")[0]
            if base in imps:
                c["specs"][imps[base]] += 1
                if not c["file"]:
                    c["file"] = resolve_import(d.path, imps[base], aliases)
            else:
                c["not_imported"] += 1
        if tags:
            if d.frac(tags[0]["start"]) < 0.15:
                opens[tags[0]["name"]] += 1
            if d.frac(tags[-1]["start"]) > 0.85:
                closes[tags[-1]["name"]] += 1
        used = {t["name"].split(".")[0] for t in tags}
        for spec in imps.values():
            f = resolve_import(d.path, spec, aliases)
            if f:
                used_files.add(os.path.abspath(f))
        den = round(len(tags) * 1000 / max(1, words), 1)
        dens.append(den)
        per_post.append({"slug": slug, "date": d.date(), "words": words, "components": len(tags), "per_1k": den,
                         "first": tags[0]["name"] if tags else "", "last": tags[-1]["name"] if tags else "",
                         "unused_imports": sorted(set(imps) - used - {"*"}),
                         "not_imported": sorted(used - set(imps))})

    dirs = {os.path.abspath(x) for x in (a.components_dir or [])}
    for c in comps.values():
        if c["file"] and "node_modules" not in c["file"]:
            dirs.add(os.path.dirname(os.path.abspath(c["file"])))
    for name, c in comps.items():
        if not c["file"]:
            for dd in dirs:
                for e in COMP_EXT:
                    f = os.path.join(dd, name.split(".")[0] + e)
                    if os.path.isfile(f):
                        c["file"] = f
    comp_files = {os.path.abspath(c["file"]) for c in comps.values() if c["file"]}
    available = []
    for dd in sorted(dirs):
        if not os.path.isdir(dd):
            continue
        for f in sorted(os.listdir(dd)):
            fp = os.path.abspath(os.path.join(dd, f))
            if f.endswith(COMP_EXT) and fp not in comp_files and fp not in used_files:
                pr, sl = component_api(fp)
                available.append({"file": rel(fp, root), "props": pr, "slots": sl})

    comp_list = []
    for name, c in sorted(comps.items(), key=lambda kv: (-len(kv[1]["posts"]), -kv[1]["uses"])):
        pr, sl = component_api(c["file"]) if c["file"] else (None, [])
        comp_list.append({"name": name, "posts": len(c["posts"]), "uses": c["uses"], "pos": dict(c["pos"]),
                          "file": rel(c["file"], root) if c["file"] else None,
                          "import_specs": dict(c["specs"]), "not_imported_uses": c["not_imported"],
                          "props_src": pr, "slots": sl, "props_used": dict(c["props"].most_common(8)),
                          "under": dict(c["heads"].most_common(5)), "samples": c["samples"]})

    res = {"blog_dir": blog_dir, "root": root, "posts": len(docs), "mdx": len(mdx),
           "median_words": median(wcounts) if wcounts else 0,
           "median_per_1k": median(dens) if dens else 0,
           "components": comp_list, "opens_with": dict(opens), "closes_with": dict(closes),
           "features": {k: {"posts": feat_posts[k], "median": median(feat_counts[k])} for k in feat_posts},
           "available_unused": available, "per_post": per_post}
    if a.json:
        print(json.dumps(res, indent=1, ensure_ascii=False))
        return
    m = max(1, len(mdx))
    out = ["# survey %s" % blog_dir,
           "posts %d (mdx %d) · median %sw · median %s components/1k words" % (
               len(docs), len(mdx), res["median_words"], res["median_per_1k"])]
    out.append("\n## components (by posts using)")
    for c in comp_list:
        out.append("### %s — %d/%d mdx posts · %d uses · open/mid/close %d/%d/%d" % (
            c["name"], c["posts"], m, c["uses"], c["pos"].get("open", 0), c["pos"].get("mid", 0), c["pos"].get("close", 0)))
        src = c["file"] or (", ".join(c["import_specs"]) or "never imported → global or unresolved")
        out.append("src: %s%s" % (src, " · %d uses without import" % c["not_imported_uses"] if c["not_imported_uses"] and c["import_specs"] else ""))
        if c["props_src"] or c["slots"]:
            out.append("api: props {%s} · slots %s" % (c["props_src"] or "?", ", ".join(c["slots"]) or "none"))
        if c["props_used"]:
            out.append("props used: " + ", ".join("%s×%d" % kv for kv in c["props_used"].items()))
        out.append("under: " + ", ".join("%s×%d" % kv for kv in c["under"].items()))
        out += ["e.g. " + s for s in c["samples"]]
    out.append("\n## conventions")
    conv = [("opens with <%s>" % k, v) for k, v in opens.items()] + [("closes with <%s>" % k, v) for k, v in closes.items()]
    out += ["- %s: %d/%d" % (k, v, m) for k, v in sorted(conv, key=lambda x: -x[1]) if v >= 2] or ["- no open/close component pattern (≥2 posts)"]
    out.append("- features (posts / median count): " + " · ".join(
        "%s %d/%d (%s)" % (k, v["posts"], len(docs), v["median"]) for k, v in sorted(res["features"].items())))
    out.append("\n## available, never used in posts")
    out += ["- %s · props {%s} · slots %s" % (x["file"], x["props"] or "?", ", ".join(x["slots"]) or "none") for x in available] or ["none (dirs scanned: %s)" % (", ".join(rel(d, root) for d in sorted(dirs)) or "none — pass --components-dir")]
    out.append("\n## per post (newest first)")
    out.append("slug | date | words | comps | /1k | first→last | unused imports | not imported")
    for p in per_post:
        if p.get("md"):
            out.append("%s | %s | %d | md | - | - | - | -" % (p["slug"], p["date"], p["words"]))
        else:
            out.append("%s | %s | %d | %d | %s | %s→%s | %s | %s" % (
                p["slug"], p["date"], p["words"], p["components"], p["per_1k"], p["first"] or "-", p["last"] or "-",
                ", ".join(p["unused_imports"]) or "-", ", ".join(p["not_imported"]) or "-"))
    print("\n".join(out))


def parse_range(r, n):
    a, _, b = r.partition("-")
    a = int(a)
    b = int(b) if b else a
    return max(1, min(a, b)), min(n, max(a, b))


def unit_para(doc, line):
    """Paragraph (blank-line delimited) containing LINE; whole fenced block if LINE is code."""
    k, i = doc.kinds, line - 1
    if not 0 <= i < len(k):
        raise SystemExit("L%d out of range" % line)
    if k[i] in ("code", "fence"):
        a = i
        while a > 0 and k[a] != "fence":
            a -= 1
        b = a + 1
        while b < len(k) and k[b] == "code":
            b += 1
        return a + 1, b
    if not doc.lines[i].strip():
        raise SystemExit("L%d is blank — pass a line inside the paragraph" % line)
    stop = ("fence", "code", "fm", "heading")
    a = b = i
    if k[i] != "heading":
        while a > 0 and doc.lines[a - 1].strip() and k[a - 1] not in stop:
            a -= 1
        while b < len(k) - 1 and doc.lines[b + 1].strip() and k[b + 1] not in stop:
            b += 1
    return a + 1, b + 1


def unit_section(doc, line):
    heads = doc.headings()
    start, level = doc.body_start + 1, 0
    for ln, lvl, _ in heads:
        if ln <= line:
            start, level = ln, lvl
    end = len(doc.lines)
    for ln, lvl, _ in heads:
        if ln > start and (level == 0 or lvl <= level):
            end = ln - 1
            break
    if level == 0:  # intro: skip imports/blank lines before the first prose line
        while start < end and doc.kinds[start - 1] in ("import", "blank", "fm"):
            start += 1
    while end > start and not doc.lines[end - 1].strip():
        end -= 1
    return start, end


def cmd_show(a):
    doc = Doc(a.post)
    n = len(doc.lines)
    if doc.lines and doc.lines[-1] == "":
        n -= 1
    if a.lines:
        lo, hi = parse_range(a.lines, n)
    elif a.para:
        lo, hi = unit_para(doc, a.para)
    else:
        lo, hi = unit_section(doc, a.section)
    marks = set()
    for r in a.mark or []:
        x, y = parse_range(r, n)
        marks.update(range(x, y + 1))
    clo, chi = max(1, lo - a.context), min(n, hi + a.context)
    w = len(str(chi))
    heading = heading_before(doc.headings(), lo) or "(intro)"
    out = ["L%d–%d · § %s" % (lo, hi, heading)]
    for i in range(clo, chi + 1):
        ctx = i < lo or i > hi
        out.append(("%s %*d %s %s" % ("▸" if i in marks else " ", w, i, "┆" if ctx else "│", doc.lines[i - 1])).rstrip()
                   if not doc.lines[i - 1].strip() else
                   "%s %*d %s %s" % ("▸" if i in marks else " ", w, i, "┆" if ctx else "│", doc.lines[i - 1]))
    print("\n".join(out).rstrip())


def main():
    try:
        import signal
        signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    except (ImportError, AttributeError, ValueError):
        pass
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("survey")
    s.add_argument("blog_dir")
    s.add_argument("--components-dir", action="append")
    s.add_argument("--json", action="store_true")
    p = sub.add_parser("post")
    p.add_argument("post")
    p.add_argument("--blog-dir")
    p.add_argument("--n", type=int, default=6, help="shingle size for synopsis runs (intra n+1, cross n+2)")
    p.add_argument("--json", action="store_true")
    sh = sub.add_parser("show")
    sh.add_argument("post")
    g = sh.add_mutually_exclusive_group(required=True)
    g.add_argument("--para", type=int, help="paragraph (or fenced block) containing LINE")
    g.add_argument("--section", type=int, help="section containing LINE, heading to next same-or-higher heading")
    g.add_argument("--lines", help="explicit range A-B")
    sh.add_argument("--context", type=int, default=1, help="context lines before/after (default 1)")
    sh.add_argument("--mark", action="append", help="range A-B of lines that change (repeatable)")
    a = ap.parse_args()
    {"survey": cmd_survey, "post": cmd_post, "show": cmd_show}[a.cmd](a)


if __name__ == "__main__":
    main()
