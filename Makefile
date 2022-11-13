dist := dist
main := $(dist)/main.js

# Build and run the project from scratch
all::
	@$(MAKE) install
	@$(MAKE) certiciate
	@$(MAKE) build
	@$(MAKE) run

# Install node modules
install::
	yarn install

# Compile ts to js to dist folder
build::
	npx tsc

# Start the compiled app
start:: $(main)
	node $(main)

# Start development server
dev:: source/main.ts
	npx ts-node-dev --respawn source/main.ts

# Start test server to froward to
test-server::
	node test/server.js

# Generate a self-signed certificate
certificate::
	./scripts/cert-gen.sh

# Remove generated files
clean::
	rm -rf $(dist) node_modules *.crt *.key
