const express = require("express");
const api = express.Router();
const latestRequests = require("../../middleware/latestRequests");

api.get("/", latestRequests, async (req, res) => {
  return res.render("index", {
    title: "Steam ID Finder",
    val: null,
    requests: req.latestRequests,
  });
});

module.exports = api;
