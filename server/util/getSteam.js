const axios = require("axios");

module.exports = async (steamApi, steamId) => {
  let fetchData = await axios
    .get(steamApi + steamId)
    .then((response) =>
      response.data ? response.data.response.players[0] : null
    )
    .catch((err) => {
      return {
        error: true,
        message: err,
      };
    });
  if (!fetchData) {
    return {
      error: true,
      message: "User not found!",
    };
  }
  return fetchData;
};
