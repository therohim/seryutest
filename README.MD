# Node.js Project with TypeScript

This guide outlines the steps to run a Node.js project using TypeScript, including database migration, seeders, running the server, and example API usage.

## Prerequisites

1. Node.js (latest version)
2. Express.js
3. TypeScript
4. NPM or Yarn
5. PostgreSQL

## Project Installation

1. Clone the project repository:

    ```bash
    git clone https://github.com/therohim/seryutest.git
    cd seryutest
    ```

2. Install dependencies:

    ```bash
    npm install
    # or if using Yarn
    yarn install
    ```

3. Create a `.env` file and adjust the configuration according to your environment:

    ```env
    NODE_ENV=dev
    CORS=*
    SERVER_DISABLE=false
    APP_PROTOCOL=http
    SERVER_PORT=3001

    POSTGRES_HOST=localhost
    POSTGRES_DB=your_database_name
    POSTGRES_USERNAME=your_username_postgre
    POSTGRES_PASSWORD=your_password_postgre
    POSTGRES_PORT=5432
    ```

## Database Migration

1. Compile the migration file:

    ```bash
    npx tsc ./migrations/migrate.ts
    ```

2. Run the migration file:

    ```bash
    npx ts-node ./migrations/migrate.js
    ```

## Database Seeder

Seeders are used to populate the database with initial data.

1. Compile the seeders:

    ```bash
    npx tsc ./seeders/seeder.ts
    ```

2. Run the seeder:

    ```bash
    npx ts-node ./seeders/seeder.ts
    ```

## Running the Server

1. Run the server in development mode:

    ```bash
    npm run dev
    ```

## Example API Usage

Below are examples of using the API with `curl`:

**GET Driver**

    ```bash
    curl -X GET localhost:3001/v1/salary/driver/list
    ```

#### custom params
    ```bash
    curl -X GET localhost:3001/v1/salary/driver/list?month=4&year=2024&driver_code=&name=&status=CONFIRMED
    ```