const convert = require("xml-js");
const axios = require("axios");

module.exports = async (type, match) => {
  let xml = await axios
    .get(`http://steamcommunity.com/${type}/${match}/?xml=1`)
    .then((xml) => {
      return xml.data ? xml.data : null;
    })
    .catch((err) => {
      return {
        error: true,
        message: err,
      };
    });
  if (xml) {
    let result = convert.xml2json(xml, { compact: true, spaces: 4 });
    result = JSON.parse(result);
    return result.profile ? result.profile.steamID64._text : null;
  } else {
    return {
      error: true,
      message: "Пользователь не найден",
    };
  }
};
