# Create a new blog post

Format: /post:new [title]

1. If no [title] is provided ask user for title
2. Create new `bead`
3. Suggest a slug to the user. Confirm slug with user.
4. Create a `mdx` file like `src/content/blog/[year]/[month]/[slug].mdx`
5. Populate blog template

---
title: "[title]"
description: <Generated-description-placeholder /> 
synopsis: <Generated-sypnosis-placeholder />
    
    Multi-line markdown entry


    Needs an extra break to create paragraph correctly


    Populate paragraphs correctly

pubDate: <UTC-Date-now like="Feb 22 2026 21:30:00 GMT+0000 (UTC)" />
updatedDate: <Same as=pubDate>
heroImage: <String like='"@/assets/blog/2026/[MM][DD]-[slug].png"' />
tags: <Array like='["sample-tag", "sample-tag2"]' />s
---

Content placeholder.


6. Generate report:
    * Path to new file
    * Path to where image should be