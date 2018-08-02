.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: package.json ## install dependencies
	@yarn

run: run-simple

run-simple: ## run the simple example
	@yarn -s run-simple

build-ra-tree-core:
	@echo "Transpiling ra-tree-core files...";
	@rm -rf ./packages/ra-tree-core/lib
	@NODE_ENV=production ./node_modules/.bin/babel --quiet ./packages/ra-tree-core/src -d ./packages/ra-tree-core/lib --ignore spec.js,test.js

build-ra-tree-ui-materialui:
	@echo "Transpiling ra-tree-ui-materialui files...";
	@rm -rf ./packages/ra-tree-ui-materialui/lib
	@NODE_ENV=production ./node_modules/.bin/babel --quiet ./packages/ra-tree-ui-materialui/src -d ./packages/ra-tree-ui-materialui/lib --ignore spec.js,test.js

build: build-ra-tree-core build-ra-tree-ui-materialui ## compile ES6 files to JS

lint: ## lint the code and check coding conventions
	@echo "Running linter..."
	@yarn -s lint

prettier: ## prettify the source code using prettier
	@echo "Running prettier..."
	@yarn -s prettier

test: build test-unit lint ## launch all tests

test-unit: ## launch unit tests
	@if [ "$(CI)" != "true" ]; then \
		echo "Running unit tests..."; \
		yarn -s test-unit; \
	fi
	@if [ "$(CI)" = "true" ]; then \
		echo "Running unit tests in CI..."; \
		yarn -s test-unit-ci; \
	fi

test-unit-watch: ## launch unit tests and watch for changes
	yarn -s test-unit --watch
