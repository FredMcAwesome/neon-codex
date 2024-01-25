# Backend

The backend uses express with jwt via bcrypt login for authentication. It uses an ORM to query a PostGreSQL DB.

We use tsc-watch with node because ts-node-dev (doesn't support monorepo references)[https://github.com/wclr/ts-node-dev/issues/239]
