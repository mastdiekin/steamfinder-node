const Request = require("../models").Request;

const saveDataToDb = async (data) => {
  try {
    let findRequestDupe = await Request.findOne({
      where: {
        data: data,
      },
    });
    if (findRequestDupe) return false;
    let request = await Request.create({ data });
    return request ? true : false;
  } catch (e) {
    return false;
  }
};

module.exports = saveDataToDb;
