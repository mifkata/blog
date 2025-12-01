output "pages_project_name" {
  description = "The name of the Cloudflare Pages project"
  value       = cloudflare_pages_project.blog.name
}

output "pages_project_subdomain" {
  description = "The subdomain for the Cloudflare Pages project"
  value       = cloudflare_pages_project.blog.subdomain
}

output "pages_project_domains" {
  description = "The domains associated with the Cloudflare Pages project"
  value       = cloudflare_pages_project.blog.domains
}
