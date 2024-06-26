const connectToMongo = require("./db");
const express = require("express");
const auth = require("./routes/auth.js");
const notes = require("./routes/notes.js");

connectToMongo();
const app = express();
const port = 5000;

app.use(express.json())

app.use("/api/auth", auth);
app.use("/api/notes", notes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
 