# Deploying a NestJS Monorepo with Microservices, Databases, and RabbitMQ to Railway via GitHub Actions

This guide provides step-by-step instructions for deploying your NestJS microservices monorepo to Railway. It specifically addresses a setup with:

*   Multiple microservices (e.g., `api-gateway`, `members`, `church`, `auth`).
*   A dedicated PostgreSQL database per microservice (except the API Gateway).
*   A shared RabbitMQ instance for inter-service communication.
*   Deployment automation using GitHub Actions for CI/CD.

## 1. Prerequisites

*   **GitHub Repository:** Your monorepo code hosted on GitHub.
*   **Railway Account:** Sign up at [railway.app](https://railway.app/).
*   **Railway CLI:** Install the Railway CLI. Follow the instructions [here](https://docs.railway.app/develop/cli#installation).
*   **Node.js & npm/yarn:** Ensure you have Node.js and your preferred package manager installed locally.
*   **Microservice Identification:** Know the names of your microservices within the `apps/` directory (e.g., `api-gateway`, `members`, `church`, `auth`).

## 2. Railway Project Setup

1.  **Create a New Project:** Log in to your Railway dashboard and create a new empty project. Give it a descriptive name (e.g., `my-app-production`).
2.  **Provision Databases:**
    *   In your Railway project, click "+ New" -> "Database" -> "PostgreSQL".
    *   **Repeat this step for each microservice that requires its own database.**
    *   **Rename each database service** clearly to match the microservice it serves (e.g., `members-db`, `church-db`, `auth-db`). This is crucial for clarity and referencing later.
3.  **Provision RabbitMQ:**
    *   Click "+ New" -> Search for "RabbitMQ" in the template marketplace -> Click "Deploy".
    *   Rename the resulting service to something clear, like `rabbitmq`.
4.  **Link GitHub Repository:**
    *   In your Railway project, click "+ New" -> "GitHub Repo".
    *   Authorize Railway and select your monorepo repository.
    *   Choose "Deploy source code". Railway might try to deploy the root initially. You can ignore or delete this initial service, as we'll manage deployments via GitHub Actions.

## 3. Environment Variables on Railway

Proper environment variable configuration is key. Railway injects connection strings automatically, but we need to ensure each service gets the *correct* ones.

1.  **Railway Tokens:**
    *   Go to your Railway project settings -> "Tokens".
    *   Create a new "Project Token". Copy this token.
    *   Go to your GitHub repository -> Settings -> Secrets and variables -> Actions.
    *   Create a new repository secret named `RAILWAY_TOKEN` and paste the copied token value.
2.  **Service Variables (Manual Setup Recommended for Clarity):**
    *   While `railway up` can create services, it's often clearer to **pre-create placeholders** for your application services on Railway *before* the first deployment, especially for managing variables.
    *   Click "+ New" -> "Empty Service". Create one for each microservice (`api-gateway`, `members`, `church`, `auth`). Name them exactly as they appear in your `apps/` directory.
    *   **For each application service (`members`, `church`, `auth`, etc., *excluding* `api-gateway`):**
        *   Go to the service's "Variables" tab.
        *   Railway *should* automatically inject the `DATABASE_URL` from the corresponding database service (e.g., `members-db` linked to `members` service) and the `RABBITMQ_URL` from the `rabbitmq` service *if they are linked*.
        *   **Verify:** Check if `DATABASE_URL` and `RABBITMQ_URL` (or similar, check the RabbitMQ service variables for the exact name) are present.
        *   **Explicit Linking (if needed):** If variables aren't auto-injected, you might need to explicitly reference them. Add new variables:
            *   `DATABASE_URL`: Set its value to `${{Postgres.DATABASE_URL}}` (replace `Postgres` with the *exact name* of the corresponding database service, e.g., `${{members-db.DATABASE_URL}}`).
            *   `RABBITMQ_URL`: Set its value to `${{rabbitmq.RABBITMQ_URL}}` (replace `rabbitmq` with the exact name of your RabbitMQ service and `RABBITMQ_URL` with the variable name it provides).
        *   Add any other required environment variables (API keys, JWT secrets, `PORT`, etc.).
    *   **For the `api-gateway` service:**
        *   Go to its "Variables" tab.
        *   Verify/Add `RABBITMQ_URL` (e.g., `${{rabbitmq.RABBITMQ_URL}}`).
        *   Add any other required variables (`PORT`, JWT secrets, etc.). It does *not* need a `DATABASE_URL`.
3.  **Application Code:** Ensure each microservice reads its database connection string from `process.env.DATABASE_URL` and the RabbitMQ connection string from `process.env.RABBITMQ_URL` (or the actual variable names provided by Railway).

## 4. GitHub Actions Workflow

1.  **Create Workflow File:** In your local repository, create `.github/workflows/deploy.yml`.
2.  **Define the Workflow:** Paste the following content. Note the separate jobs for each service.

```yaml
# .github/workflows/deploy.yml

name: Deploy Microservices to Railway

on:
  push:
    branches:
      - main # Or your primary deployment branch

jobs:
  # --- Deploy API Gateway (No DB) ---
  deploy-api-gateway:
    name: Deploy API Gateway
    runs-on: ubuntu-latest
    environment: production # Optional: Link to GitHub Environment
    env:
      APP_NAME: api-gateway

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18' # Use your project's Node.js version
          cache: 'npm' # Or 'yarn'

      - name: Install Dependencies (Monorepo)
        run: npm ci # Or yarn install --frozen-lockfile

      - name: Build Application (${{ env.APP_NAME }})
        # Ensure your build script correctly builds the specific app
        run: npm run build ${{ env.APP_NAME }}

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy to Railway (${{ env.APP_NAME }})
        # This command deploys the built code to the corresponding Railway service
        # It relies on environment variables being set correctly on Railway
        run: railway up --service ${{ env.APP_NAME }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  # --- Deploy Members Service (Requires members-db and rabbitmq) ---
  deploy-members:
    name: Deploy Members Service
    runs-on: ubuntu-latest
    needs: deploy-api-gateway # Optional: Define dependencies if needed
    environment: production
    env:
      APP_NAME: members

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install Dependencies (Monorepo)
        run: npm ci
      - name: Build Application (${{ env.APP_NAME }})
        run: npm run build ${{ env.APP_NAME }}
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      - name: Deploy to Railway (${{ env.APP_NAME }})
        run: railway up --service ${{ env.APP_NAME }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  # --- Deploy Church Service (Requires church-db and rabbitmq) ---
  deploy-church:
    name: Deploy Church Service
    runs-on: ubuntu-latest
    needs: deploy-api-gateway # Optional
    environment: production
    env:
      APP_NAME: church

    steps:
      # ... (Checkout, Setup Node, Install Deps, Build - same as above) ...
      - name: Checkout Repository
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install Dependencies (Monorepo)
        run: npm ci
      - name: Build Application (${{ env.APP_NAME }})
        run: npm run build ${{ env.APP_NAME }}
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      - name: Deploy to Railway (${{ env.APP_NAME }})
        run: railway up --service ${{ env.APP_NAME }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  # --- Deploy Auth Service (Requires auth-db and rabbitmq) ---
  deploy-auth:
    name: Deploy Auth Service
    runs-on: ubuntu-latest
    needs: deploy-api-gateway # Optional
    environment: production
    env:
      APP_NAME: auth

    steps:
      # ... (Checkout, Setup Node, Install Deps, Build - same as above) ...
      - name: Checkout Repository
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install Dependencies (Monorepo)
        run: npm ci
      - name: Build Application (${{ env.APP_NAME }})
        run: npm run build ${{ env.APP_NAME }}
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      - name: Deploy to Railway (${{ env.APP_NAME }})
        run: railway up --service ${{ env.APP_NAME }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  # --- Add jobs for other microservices similarly ---

```

## 5. Workflow Explanation & Customization

*   **Multiple Jobs:** Each microservice gets its own deployment job (`deploy-api-gateway`, `deploy-members`, etc.). This allows for parallel execution and easier debugging.
*   **`needs`:** (Optional) You can use `needs: [job-name]` to create dependencies between jobs if one service must be deployed before another (less common with microservices but possible).
*   **`APP_NAME` Env Var:** Each job defines the specific `APP_NAME` it's responsible for. This is used in the build and deploy steps.
*   **Build Step:** `npm run build ${{ env.APP_NAME }}` assumes you have scripts like `build:members`, `build:church` in your root `package.json`, or a generic script that accepts the app name. Verify this matches your setup.
*   **`railway up --service ${{ env.APP_NAME }}`:** This command is the core. It tells Railway to build and deploy the code to the service matching the `APP_NAME`. Railway's build system (Nixpacks) will detect Node.js, install dependencies, and run the start command. Crucially, it uses the environment variables configured *on that specific Railway service*, ensuring `members` connects to `members-db`, `church` connects to `church-db`, and all connect to `rabbitmq`.
*   **Start Commands:** Ensure Railway knows how to start each service. This is usually defined by a `start` script in the root `package.json` (e.g., `"start:members": "node dist/apps/members/main"`) or configured explicitly in the Railway service's "Deploy" settings (e.g., Start Command: `npm run start:members`). `railway up` respects these settings.

## 6. Triggering Deployment

1.  Commit the `.github/workflows/deploy.yml` file.
2.  Push the commit to the branch specified in the `on:` trigger (e.g., `main`).
3.  Monitor the deployment progress in the "Actions" tab of your GitHub repository and on your Railway project dashboard.

Check the build and deployment logs on both platforms if issues arise. Pay close attention to environment variable injection and connection errors during service startup.