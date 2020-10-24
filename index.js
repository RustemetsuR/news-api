const express = require("express");
const appFile = require("./app/app");
const cors = require("cors");
const dbNews = require("./dbFiles/newsFileDB");
const dbComments = require("./dbFiles/commentsFileDB");
const app = express();
const port = 8000;

dbNews.init();
dbComments.init();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/", appFile);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});