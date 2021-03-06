const express = require("express");
const api = require("./routes/routes");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const _u = require("./util/utility");
const db = require("./db/db");

//create app
const app = express();

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());

app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("server/assets"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//routes
app.use(api);

const port = process.env.PORT || 5000;

db.sync()
  .then(async () => {
    console.log("Connected to DB");
    app.listen(port, () => {
      _u.colenv("server");
      console.log(`Server listen on ${port} port`);
    });
  })
  .catch((e) => console.log(e));
