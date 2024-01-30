## Database

By default we connect to the database with an ORM (we use Mikro-ORM)
Models of each table are defined in models/, all imported into models.ts to setup relationships. We then export for use in other files.

Because we use mikro-orm we need to use decorators which are an experimental feature in typescript so something to keep an eye on.

You have to be careful with table names check the (reserved keywords)[https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS].
This is why we are using the table "users" instead of user.