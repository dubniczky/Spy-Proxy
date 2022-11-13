# Spy Proxy

An HTTP proxy service in TypeScript for logging and altering packets in real-time

## Usage

### 1. Configure Settings

There are two main types of rules for the proxy:

- **Intercept** - Show the URLs and the content of files matching intercept rules
- **Tamper** - Modify headers and body based on rewrite rules

> It's recommended to test your settings using the test server `make test-server`

### 2. Start Server

Automatic

```bash
make
```

Manual

```bash
make install
make certiciate
make build
make run
```

Container

```bash
docker build -t spy-proxy .
docker run -d -p80:80 -p433:433 spy-proxy
```