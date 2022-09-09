import pg from "pg";
const dbName = "db_name";
const username = "postgres";
const password = "postgres";
const host = "localhost";
const port = 5432;

const client = new pg.Client({
  host: host,
  port: port,
  user: username,
  password: password,
});
// connect to postgres db
client.connect(function (err) {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
    client.query("CREATE DATABASE " + dbName, function (err) {
      if (err) {
        console.error("create db error", err.stack);
      } else {
        console.log("created db");
      }
      client.end(); // close the connection
    });
  }
  // create the db and ignore any errors, for example if it already exists.
});
