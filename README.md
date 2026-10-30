# Mifkata.com

Source for mifkata.com, a personal blog of long-form posts and short notes, built as a static Astro site.

## 📑 Contents

- [📦 Requirements](#-requirements)
- [🔧 Installation](#-installation)
- [🔩 Configuration](#-configuration)
- [📁 Project structure](#-project-structure)
- [🧪 Development](#-development)
- [🚀 Deployment](#-deployment)

## 📦 Requirements

- [mise](https://mise.jdx.dev/getting-started.html), which installs the Node.js version pinned in [`mise.toml`](mise.toml)
- [pnpm](https://pnpm.io/installation) 10.34.5+

## 🔧 Installation

1. Get the code.

   ```sh
   git clone git@github.com:mifkata/blog.git
   cd blog
   ```

2. Install dependencies.

   ```sh
   mise install
   pnpm install
   ```

3. Create your local configuration. Every value in [`.env.example`](.env.example) is optional for local development.

   ```sh
   cp .env.example .env
   ```

4. Start the development server.

   ```sh
   pnpm dev
   ```

5. Open <http://localhost:4321> and check that the home page loads.

## 🔩 Configuration

Set these in `.env`. [`terraform/main.tf`](terraform/main.tf) sets `SITE_URL` and the Giscus values for deployed builds.

| Variable                    | Required | Default                 | Description                                                                                                                                        |
| :-------------------------- | :------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL`                  | No       | `http://localhost:4321` | Site address passed to Astro in [`astro.config.mjs`](astro.config.mjs).                                                                            |
| `PUBLIC_GISCUS_REPO`        | No       | Empty                   | GitHub repository that stores post comments. Used in [`Comments.astro`](src/components/post/Comments/Comments.astro).                              |
| `PUBLIC_GISCUS_REPO_ID`     | No       | Empty                   | Repository ID from [giscus.app](https://giscus.app).                                                                                               |
| `PUBLIC_GISCUS_CATEGORY`    | No       | Empty                   | GitHub Discussions category for comments.                                                                                                          |
| `PUBLIC_GISCUS_CATEGORY_ID` | No       | Empty                   | Category ID from [giscus.app](https://giscus.app).                                                                                                 |
| `GITHUB_TOKEN`              | No       | Empty                   | Raises the GitHub API limit when the build reads star counts in [`linkActivity.ts`](src/helpers/linkActivity.ts). Any token works, with no scopes. |

## 📁 Project structure

| Path                                       | Purpose                                 |
| :----------------------------------------- | :-------------------------------------- |
| [`src/content/blog/`](src/content/blog/)   | Long-form posts in MDX                  |
| [`src/content/notes/`](src/content/notes/) | Short notes in MDX                      |
| [`src/data/`](src/data/)                   | Books, quotes, series and tags as JSON  |
| [`src/components/`](src/components/)       | Components with their stories and tests |
| [`src/pages/`](src/pages/)                 | Site routes                             |
| [`public/`](public/)                       | Static files served as they are         |
| [`.storybook/`](.storybook/)               | Storybook configuration                 |
| [`terraform/`](terraform/)                 | Cloudflare Pages infrastructure         |

## 🧪 Development

Run every command from the project root.

| Command                | Action                                  |
| :--------------------- | :-------------------------------------- |
| `pnpm storybook`       | Starts Storybook at `localhost:9009`    |
| `pnpm storybook:build` | Builds Storybook to `./dist/storybook/` |
| `pnpm build`           | Builds the production site to `./dist/` |
| `pnpm preview`         | Previews the build locally              |
| `pnpm test`            | Runs tests in watch mode                |
| `pnpm test:run`        | Runs tests once                         |
| `pnpm typecheck`       | Checks types with `astro check`         |
| `pnpm lint`            | Checks for linting errors               |
| `pnpm lint:fix`        | Fixes linting errors                    |
| `pnpm format`          | Checks formatting                       |
| `pnpm format:fix`      | Fixes formatting                        |
| `pnpm astro ...`       | Runs Astro CLI commands                 |

Git hooks run `mise run fix` on staged files before each commit, reject messages that do not follow Conventional Commits, and run `mise run check` and the toolchain check before each push. Enable them in a fresh clone with `bd hooks install --beads`.

## 🚀 Deployment

The site runs on Cloudflare Pages, provisioned with [Terraform](https://developer.hashicorp.com/terraform/install) from [`terraform/`](terraform/). Cloudflare deploys `main` on each push once GitHub is connected.

1. Create the variables file, then fill in your values.

   ```sh
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Export a Cloudflare API token with the permissions in the table below. `<api-token>` is your token.

   ```sh
   export TF_VAR_cloudflare_api_token="<api-token>"
   ```

3. Create the infrastructure.

   ```sh
   terraform init && terraform apply
   ```

4. Authorize GitHub in Cloudflare: Workers & Pages → project → Settings → Builds & deployments → Connect to GitHub.

| Scope   | Resource         | Permission |
| :------ | :--------------- | :--------- |
| Account | Cloudflare Pages | Edit       |
| Zone    | DNS              | Edit       |
