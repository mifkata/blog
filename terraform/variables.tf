variable "cloudflare_api_token" {
  description = "Cloudflare API token with Pages permissions"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "project_name" {
  description = "Name of the Cloudflare Pages project"
  type        = string
  default     = "blog"
}

variable "github_owner" {
  description = "GitHub username or organization that owns the repository"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "custom_domain" {
  description = "Custom domain to bind to the Pages project (must already exist in Cloudflare)"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "The Cloudflare zone ID (found in dashboard under Overview)"
  type        = string
}

variable "giscus_repo" {
  description = "GitHub repo for Giscus comments (e.g., mifkata/blog)"
  type        = string
}

variable "giscus_repo_id" {
  description = "Giscus repo ID (from giscus.app)"
  type        = string
}

variable "giscus_category" {
  description = "Giscus discussion category name"
  type        = string
}

variable "giscus_category_id" {
  description = "Giscus category ID (from giscus.app)"
  type        = string
}
