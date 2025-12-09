# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

```sh
cp .env.example .env
```

All commands are run from the root of the project, from a terminal:

| Command           | Action                                           |
| :---------------- | :----------------------------------------------- |
| `pnpm install`    | Installs dependencies                            |
| `pnpm dev`        | Starts local dev server at `localhost:4321`      |
| `pnpm build`      | Build your production site to `./dist/`          |
| `pnpm preview`    | Preview your build locally, before deploying     |
| `pnpm lint`       | Check for linting errors                         |
| `pnpm lint:fix`   | Fix linting errors                               |
| `pnpm format`     | Check formatting                                 |
| `pnpm format:fix` | Fix formatting                                   |
| `pnpm astro ...`  | Run CLI commands like `astro add`, `astro check` |

## 🐳 Dev Container

This project includes a dev container configuration for a consistent development environment.

### Prerequisites

- Docker installed and running
- `socat` and `terminal-notifier` for host notifications (macOS): `brew install socat terminal-notifier`

### What's Included

- Node.js 22
- pnpm 9.15.0
- Claude Code CLI (pre-installed with plugins)
- Git
- Zsh with Oh My Zsh

### Commands

| Command                           | Action                                        |
| :-------------------------------- | :-------------------------------------------- |
| `pnpm devcontainer:build`         | Build the dev container                       |
| `pnpm devcontainer:rebuild`       | Rebuild the dev container (no cache)          |
| `pnpm devcontainer:up`            | Start the dev container                       |
| `pnpm devcontainer:stop`          | Stop the dev container and notifier           |
| `pnpm devcontainer:shell`         | Open a zsh shell in the container             |
| `pnpm devcontainer:claude`        | Start container with Claude Code and notifier |
| `pnpm devcontainer:notifier:up`   | Start the macOS notification listener         |
| `pnpm devcontainer:notifier:stop` | Stop the macOS notification listener          |

The `devcontainer:claude` command automatically starts the notification listener so you receive macOS notifications when Claude Code needs attention or completes a task.

## 🚀 Deployment to Cloudflare Pages

```sh
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
terraform init && terraform apply
```

### Required API Token Permissions

| Scope   | Resource         | Permission |
| :------ | :--------------- | :--------- |
| Account | Cloudflare Pages | Edit       |
| Zone    | DNS              | Edit       |

After applying, authorize GitHub in Cloudflare: **Workers & Pages** → project → **Settings** → **Builds & deployments** → **Connect to GitHub**.

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
