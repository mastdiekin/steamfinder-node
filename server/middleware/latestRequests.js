const Request = require("../models").Request;
const _u = require("../util/utility");

const latestRequests = async (req, res, next) => {
  const latestRequestsLimit = 5;
  try {
    let latestRequests = await Request.findAll({
      limit: latestRequestsLimit,
      order: [["id", "DESC"]],
    })
      .then((res) => res)
      .catch((err) => {
        return _u.error(req, res, err);
      });

    req.latestRequests = latestRequests || [];

    return next();
  } catch (e) {
    return res.render("steam/error", {
      title: "Steam ID Finder - Error",
      data: null,
      val: null,
      error: true,
      errorMessage: e,
    });
  }
};

module.exports = latestRequests;
