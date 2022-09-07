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

## Development Setup
Assuming vscode for editor:
Install [prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
Install [eslint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
Run `npm install` at root of repo.
Run `npm run start-prod` to start locally - note will still need a local db.

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