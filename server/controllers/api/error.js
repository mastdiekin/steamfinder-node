const express = require("express");
const api = express.Router();
const _u = require("../../util/utility");

api.get("*", (req, res) => {
  return _u.error(req, res);
});

module.exports = api;
