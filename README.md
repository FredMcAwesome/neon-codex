# Neon Codex: A Shadowrun 5E Toolkit
This is the repository for the Neon Codex website. It is an unofficial toolkit for the 5th edition of Shadowrun with a variety of features:
- Digital Character Sheet: Create and manage your Shadowrun characters digitally
- Campaign Management: Create and manage your Campaigns, invite players to join and add their characters, communicate on a campaign forum
- Combat Tools: Manage initiative, hitpoints, and conditions

## Character Sheet
The capability to create a character and view it as a character sheet. The character sheet should be usable to track physical and stun damage, temporary boosts to abilities e.g. adept powers, as well as ammunition and any other standard character sheet things like armour and weapons.
Export to pdf and Chummer format to be considered.
## Shadowlands BBS
There is a forum the displays threads about various topics, with players being able to add comments to threads or create their own. The GM is able to add comments and threads under arbitrary usernames.
The forum will be used for finding extra missions, buying rarer/limited gear, post mission recap/effect on world at large, anything else players decide.

# Developer information
There is a backend and a frontend section of this repo. The frontend is a react application, the backend is an express application with both applications being written in typescript with a REST api between client and server. The database is PostGreSql.

All code is written in typescript and compiled (via webpack for frontend, tsc for backend) to javascript. We aren't using ts-node because it currently doesn't support references properly which we need for the monorepo. We use a monorepo to share code between the front and the backend, especially the data types sent between the two on the REST interface.

We don't use CommonJS because [webpack tree shaking doesn't work well with it](https://webpack.js.org/guides/tree-shaking/#conclusion) and now that node supports ECMAScript we can have everything output to that module type.

## Development Setup
Assuming vscode for editor:
Install [prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
Install [eslint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
Run `npm install` at root of repo. (This will install all child dependencies)
Run `npm start` to start locally - note will still need a local db.
### DB Setup
Install postgresSQL and setup a default user with some credentials (postgres for username and password is the default used.)

```shell
sudo -u postgres psql
CREATE DATABASE development;
CREATE DATABASE shadowrun;
CREATE DATABASE test;
\q
```

Setup default access
```shell
sudo -u postgres psql
show hba_file;
\q
```
Open the hba file printed and change the method to access the database to md5

Run the following commands to create a database and fill it with some dummy data for development
`npm run build` at least once
Create .env_development, .env_production, and .env_test in database/ and set the DB_NAME to whatever you want each name to be. Can also set all other credentials used in database/src/utils/config.ts.
Create Tables:
```shell
cd database &&
npx tsc --b
NODE_ENV=test node --loader ts-node/esm ./src/create-schema.ts &&
NODE_ENV=development node --loader ts-node/esm ./src/create-schema.ts
```
Fill tables with initial data:
```shell
export MIKRO_ORM_CLI_CONFIG='./src/mikro-orm_seeder.config.ts' && 
export MIKRO_ORM_SEEDER_PATH='./src/seeders/' &&
export NODE_ENV=test &&
npx mikro-orm-esm seeder:run &&
npx mikro-orm-esm seeder:run --class=DatabaseSeeder &&
export NODE_ENV=development &&
npx mikro-orm-esm seeder:run &&
npx mikro-orm-esm seeder:run --class=DatabaseSeeder &&
unset NODE_ENV &&
unset MIKRO_ORM_CLI_CONFIG
```

### Hot reload
To run server with hot reload `npm start` from root. (Builds client then enters watch mode for server.)
To run client with hot reload `npm run watch-frontend` from root (Needs server running) or with `npm run serve-frontend` (no connection to server).

## Frontend
This is a standard SPA (Single Page Application) React app, created with create-react-app using a BrowserRouter to swap between pages.
All API calls are transmitted through **trpc** for end to end typesafety with typing/validation via **zod**.
For testing we use **MSW** (Mock Service Worker) which allows simple mocking of network responses to server requests.
We use **Jest** for testing as that is good enough for anything we need.
We use **React Query** for automatic loading and error states, as well as caching data (show the data again immediately and in the background refetch to check if new data available)

## Backend
The backend is a Node Express application with the frontend being served by the backend as a static webpage for all urls not starting with **/api/**. Access to any page will require login, this authentication will be handled via **bcrypt** and **jwt** (json web tokens). All incoming api requests will be validated with express-validator, and an ORM (Object-relational mapping - essentially a non-DB specific way to access the DB), **mikro-orm** will connect to the database.

## Hosting
PM2 for managing Node on the server.
PostgreSQL for DB.
The server and DB will be hosted together.

### CI/CD
Github actions to deploy website updates automatically after automated testing.

## Bugs
Currently typescript-eslint has a [problem](https://github.com/typescript-eslint/typescript-eslint/issues/2094) where project references aren't properly acknowledged when changed. If you see a linting error but it compiles fine you need to restart the eslint server to fix it...