const express = require("express");
const api = express.Router();

api.get("/", async (req, res) => {
  return res.render("index", { title: "Steam ID Finder", val: null });
});

module.exports = api;
