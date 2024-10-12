import mysql from "mysql";

const db = mysql.createConnection({
  host: process.env.HOST || "localhost",
  user: process.env.USER || "root",
  password: process.env.PASSWORD || "password",
  database: process.env.DATABASE || "test",
  port:3306,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as ID " + db.threadId);
});
export { db };
