const express = require("express");
const api = express.Router();
const _u = require("../../util/utility");
const config = require("../../config/config.json");
const bcadd = require("locutus/php/bc/bcadd");
const getSTEAM = require("../../util/getSteam");
const getXMLby = require("../../util/getXml");
const saveDataToDb = require("../../middleware/saveDataToDb");
const latestRequests = require("../../middleware/latestRequests");

api.post("/", async (req, res) => {
  let { data } = req.body;
  data = encodeURIComponent(_u.sanitize(data, [], {}));
  if (data === "") return res.redirect("/");
  return res.redirect(`/steam/${data}`);
});

api.get("/:steamid", latestRequests, async (req, res) => {
  let { steamid } = req.params;
  let data = steamid;

  const $steam_api =
    "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" +
    config["STEAM_SECRET"] +
    "&steamids=";

  let $steamid1 = /^STEAM_0:([0|1]):([\d]+)$/; //STEAM_0:0:20820115
  let $steamid2 = /^([\d]+)$/; //76561198001905958
  let $steamid3 = /^[^-_\d]{1}[-a-zA-Z_\d]+$/; //ElviS6
  let $steamid4 =
    "(http[s]?://)?(www.)?steamcommunity.com/profiles/([^-_]{1}[0-9(/)?]+)"; //steamcommunity.com/profiles/76561198001905958
  let $steamid5 =
    "(http[s]?://)?(www.)?steamcommunity.com/id/([^-_]{1}[-a-zA-Z_d0-9(/)?]+)"; //steamcommunity.com/id/ElviS6

  let $valid1, $valid2, $realokay, $realokay1, fetchData;

  //STEAM_0:0:20820115
  if (data.match($steamid1)) {
    let $matches = data.match($steamid1);
    $valid1 = $matches[1];
    $valid2 = $matches[2];

    $real1 = "" + $valid2 * 2;
    $realokay1 = bcadd($real1, "76561197960265728");
    $realokay = bcadd($realokay1, $valid1);
  }

  //76561198001905958
  if (data.match($steamid2)) {
    let $matches = data.match($steamid2);
    $realokay = $matches[0];
  }

  //ElviS6
  if (data.match($steamid3)) {
    let $matches = data.match($steamid3)[0];
    $realokay = await getXMLby("id", $matches);
  }

  //steamcommunity.com/profiles/76561198001905958
  if (data.match($steamid4)) {
    let $matches = data.match($steamid4)[3];
    if ($matches.includes("/")) {
      $matches = $matches.substring(0, $matches.length - 1);
    }
    $realokay = await getXMLby("profiles", $matches);
  }

  //steamcommunity.com/id/ElviS6
  if (data.match($steamid5)) {
    let $matches = data.match($steamid5)[3];
    if ($matches.includes("/")) {
      $matches = $matches.substring(0, $matches.length - 1);
    }
    $realokay = await getXMLby("id", $matches);
  }

  try {
    fetchData = await getSTEAM($steam_api, $realokay);

    if (fetchData.error) {
      return res.render("steam/error", {
        title: "Steam ID Finder - Error",
        data: fetchData,
        val: data,
        error: true,
        errorMessage: "User not found!",
        requests: req.latestRequests,
      });
    } else {
      let saveToDb = await saveDataToDb(data);
      if (!saveToDb) console.log("dupe data");
      return res.render("steam/success", {
        title: `Steam ID Finder - ${fetchData.personaname}`,
        data: fetchData,
        val: data,
        requests: req.latestRequests,
      });
    }
  } catch (error) {
    console.log(error);
    return _u.error(error, res, 400);
  }
});

module.exports = api;
