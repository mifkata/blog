terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_pages_project" "blog" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = "main"

  build_config {
    build_command   = "pnpm build"
    destination_dir = "dist"
  }

  source {
    type = "github"
    config {
      owner                         = var.github_owner
      repo_name                     = var.github_repo
      production_branch             = "main"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "custom"
      preview_branch_includes       = ["dev", "preview/*"]
    }
  }

  deployment_configs {
    production {
      environment_variables = {
        NODE_VERSION              = "20"
        SITE_URL                  = "https://${var.custom_domain}"
        PUBLIC_GISCUS_REPO        = var.giscus_repo
        PUBLIC_GISCUS_REPO_ID     = var.giscus_repo_id
        PUBLIC_GISCUS_CATEGORY    = var.giscus_category
        PUBLIC_GISCUS_CATEGORY_ID = var.giscus_category_id
      }
    }
    preview {
      environment_variables = {
        NODE_VERSION              = "20"
        SITE_URL                  = "https://${var.custom_domain}"
        PUBLIC_GISCUS_REPO        = var.giscus_repo
        PUBLIC_GISCUS_REPO_ID     = var.giscus_repo_id
        PUBLIC_GISCUS_CATEGORY    = var.giscus_category
        PUBLIC_GISCUS_CATEGORY_ID = var.giscus_category_id
      }
    }
  }
}

resource "cloudflare_pages_domain" "blog" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.blog.name
  domain       = var.custom_domain
}

resource "cloudflare_record" "root" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  content = cloudflare_pages_project.blog.subdomain
  type    = "CNAME"
  proxied = true
}

resource "cloudflare_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  content = "@"
  type    = "CNAME"
  proxied = true
}