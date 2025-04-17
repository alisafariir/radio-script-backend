Radio Script API Workspace

This repository contains the Radio Script API Workspace, a monorepo managed with Nx. It includes multiple features, libraries, and an application for managing radio scripts.

## Table of Contents

- Getting Started
- Project Structure
- Development
- Deployment
- Scripts
- Environment Variables
- Contributing

---

## Getting Started

To get started with this project, ensure you have the following installed:

- Node.js (latest LTS version recommended)
- npm (comes with Node.js)
- Nx CLI (optional, for better developer experience)

Clone the repository and install dependencies:

git clone <repository-url>
cd radio-script-backend
npm install

---

## Project Structure

The workspace is organized as follows:

- apps/radio-script: The main application.
- features/: Contains feature-specific libraries (e.g., auth, user, media, etc.).
- libs/: Shared libraries (e.g., constants, decorators, dtos, etc.).
- .nx/: Nx workspace metadata and cache.
- .github/workflows/deploy.yml: CI/CD pipeline configuration.

---

## Development

### Starting the Application

To start the application in development mode:

npm run start

This will run the radio-script app with live reload enabled.

### Debugging

To start the application in debug mode:

npm run start:debug

This enables debugging with the --inspect flag.

### Building the Application

To build the application for production:

npx nx build radio-script

The build artifacts will be located in dist/apps/radio-script.

---

## Deployment

The deployment process is automated using GitHub Actions. The workflow is defined in .github/workflows/deploy.yml.

### deploy.yml Structure

name: Deploy

on:
push:
branches: - main

jobs:
build:
runs-on: ubuntu-latest
steps: - name: Checkout code
uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci

      - name: Build the application
        run: npx nx build radio-script

      - name: Deploy to server
        run: |
          scp -r dist/apps/radio-script user@server:/path/to/deploy
          ssh user@server "pm2 restart radio-script"

### Manual Deployment

If you need to deploy manually:

1. Build the application:
   npx nx build radio-script

2. Copy the build output to the server:
   scp -r dist/apps/radio-script user@server:/path/to/deploy

3. Restart the application on the server:
   ssh user@server "pm2 restart radio-script"

---

## Scripts

The following scripts are available in the package.json:

- start: Starts the application in development mode.
- start:debug: Starts the application in debug mode.
- build: Builds the application for production.

---

## Environment Variables

The application requires certain environment variables to be set. Use the .env file in apps/radio-script as a reference.

Example .env file:

DATABASE_URL=postgres://user:password@localhost:5432/database
JWT_SECRET=your-secret-key
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch.
4. Open a pull request.

---

## Notes for Developers

- Nx CLI: Use the Nx CLI for running tasks efficiently. For example:
  npx nx run <project>:<target>
- Code Formatting: Use Prettier for consistent code formatting. Run npm run format to format the codebase.
- Linting: Run npm run lint to check for linting issues.
- Testing: Use Jest for unit testing. Run npm test to execute tests.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Create library

```
npx nx generate @nx/nest:library --directory=libs/<lib-name> --publishable=true --controller=true --global=true --importPath=@/<lib-name> --name=<lib-name> --service=true --strict=false --no-interactive
```

## Create feature

```
npx nx generate @nx/nest:library --directory=features/<feature-name> --publishable=true --controller=true --global=true --importPath=@/<feature-name> --name=<feature-name> --service=true --strict=false --no-interactive
```
