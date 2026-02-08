# Mifkata.com

## Generated with Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

## ⚙️ Setup & Run

Configure `.env` from example:

```sh
cp .env.example .env
```

Install dependencies and start `dev` server:

```sh
pnpm install
pnpm dev
```

This starts both Astro (`localhost:4321`) and Storybook (`localhost:6006`) in parallel via nx.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts Astro + Storybook in parallel (nx)        |
| `pnpm dev:astro`       | Starts Astro only at `localhost:4321`            |
| `pnpm storybook`       | Starts Storybook only at `localhost:6006`        |
| `pnpm storybook:build` | Build Storybook static site                      |
| `pnpm build`           | Build production site to `./dist/`               |
| `pnpm preview`         | Preview build locally before deploying           |
| `pnpm test`            | Run tests in watch mode                          |
| `pnpm test:run`        | Run tests once                                   |
| `pnpm lint`            | Check for linting errors                         |
| `pnpm lint:fix`        | Fix linting errors                               |
| `pnpm format`          | Check formatting                                 |
| `pnpm format:fix`      | Fix formatting                                   |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |

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

| Command                           | Action                                 |
| :-------------------------------- | :------------------------------------- |
| `pnpm devcontainer:build`         | Build the dev container                |
| `pnpm devcontainer:rebuild`       | Rebuild the dev container (no cache)   |
| `pnpm devcontainer:up`            | Start the dev container and notifier   |
| `pnpm devcontainer:down`          | Stop the dev container and notifier    |
| `pnpm devcontainer:exec <cmd>`    | Execute a command inside the container |
| `pnpm devcontainer:shell`         | Open a zsh shell in the container      |
| `pnpm devcontainer:claude`        | Start Claude Code in the container     |
| `pnpm devcontainer:notifier:up`   | Start the macOS notification listener  |
| `pnpm devcontainer:notifier:stop` | Stop the macOS notification listener   |

The `devcontainer:up` command automatically starts the notification listener so you receive macOS notifications when Claude Code needs attention or completes a task.

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

## 🤖 Claude Commands

Claude Code commands for this project. Run with `/command-name` in Claude Code.

### Specs

| Command                 | Description                            |
| :---------------------- | :------------------------------------- |
| `/spec-create [path]`   | Create new spec at `specs/[path].md`   |
| `/spec-update [path]`   | Update existing spec with user changes |
| `/spec-refine [path]`   | Analyze and improve spec quality       |
| `/spec-apply [path]`    | Implement spec requirements            |
| `/spec-verify [path]`   | Verify implementation matches spec     |
| `/spec-compact [path]`  | Minimize spec token size               |
| `/spec-refactor [path]` | Refactor codebase to use spec          |

### Blog

| Command               | Description                                 |
| :-------------------- | :------------------------------------------ |
| `/post-create [slug]` | Create new blog post at `src/content/blog/` |
| `/tags-update`        | Sync `src/data/tags.json` with blog posts   |

### Testing

| Command               | Description           |
| :-------------------- | :-------------------- |
| `/test-create [path]` | Create tests for spec |

### Git

| Command          | Description                                  |
| :--------------- | :------------------------------------------- |
| `/commit-staged` | Commit staged changes with generated message |

> **Note:** `/commit-staged` requires git config in the container:
>
> ```sh
> git config user.email "you@example.com"
> git config user.name "Your Name"
> ```
