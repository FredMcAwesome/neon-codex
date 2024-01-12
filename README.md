# Shadowrun Website
This is a website for Thomas' Shadowrun 5e campaign.

The functionality of this website was based off the DndBeyond website. It has the capability to create a character, access 5e shadowrun rules, and access an in campaign forum (known as the Shadowlands BBS).

## Character Sheet
The capability to create a character and view it as a character sheet. The character sheet should be usable to track physical and stun damage, temporary boosts to abilities e.g. adept powers, as well as ammunition and any other standard character sheet things like armour and weapons.
Export to pdf to be considered.
## Shadowrun rules
The core rulebook along with a few other rulebooks are displayed with chapter headings.
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
Run `npm install` at root of repo.
Run `npm start` to start locally - note will still need a local db.
### DB Setup
Install postgresSQL and setup a default user with some credentials (postgres for username and password is the default used.)
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
export NODE_OPTIONS="--loader ts-node/esm" &&
export NODE_ENV=test &&
npx mikro-orm seeder:run &&
npx mikro-orm seeder:run --class=GearSeeder &&
npx mikro-orm seeder:run --class=AbilitiesSeeder &&
export NODE_ENV=development &&
npx mikro-orm seeder:run &&
npx mikro-orm seeder:run --class=GearSeeder &&
npx mikro-orm seeder:run --class=AbilitiesSeeder &&
unset NODE_ENV &&
unset NODE_OPTIONS &&
unset MIKRO_ORM_CLI_CONFIG
```

### Hot reload
To run server with hot reload `npm start` from root. (Builds client then enters watch mode for server.)
To run client with hot reload `npm run watch-frontend` from root (Needs server running) or with `npm run serve-frontend` (no connection to server).

## Frontend
This is a standard SPA (Single Page Application) React app, created with create-react-app using a BrowserRouter to swap between pages.
The response to all API calls is validated via the **zod**, which performs all typechecking on the response.
For testing we use **MSW** (Mock Service Worker) which allows simple mocking of network responses to server requests.
We use **Jest** for testing as that is good enough for anything we need.
We use **React Query** for automatic loading and error states, as well as caching data (show the data again immediately and in the background refetch to check if new data available)

## Backend
The backend is a Node Express application with the frontend being served by the backend as a static webpage for all urls not starting with **/api/**. Access to any page will require login, this authentication will be handled via **bcrypt** and **jwt** (json web tokens). All incoming api requests will be validated with express-validator, and an ORM (Object-relational mapping - essentially a non-DB specific way to access the DB) will connect to the database.

## Hosting
PM2 for managing Node on the server.
PostgreSQL for DB.
The server and DB will be hosted together.

### CI/CD
Github actions to deploy website updates automatically after automated testing.

## Bugs
Currently typescript-eslint has a [problem](https://github.com/typescript-eslint/typescript-eslint/issues/2094) where project references aren't properly acknowledged when changed. If you see a linting error but it compiles fine you need to restart the eslint server to fix it...