# rendered by repo-manager
.DEFAULT_GOAL := help

.PHONY: help
help: ## list the targets
	@awk 'BEGIN {FS = ":.*## "} /^[A-Za-z0-9_.-]+:.*## / {printf "  %-12s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: install
install: ## install the pinned tools
	mise install

.PHONY: fix
fix: ## fix the files in FILES
	mise run fix $(FILES)

.PHONY: fast
fast: ## static analysis, then the affected tests
	mise run fast

.PHONY: check
check: ## the full gate: build, then every test
	mise run check

.PHONY: build
build: ## build the app
	mise run build

.PHONY: dev
dev: ## start the app in dev mode
	mise run dev

.PHONY: start
start: ## start the production build locally
	mise run start
