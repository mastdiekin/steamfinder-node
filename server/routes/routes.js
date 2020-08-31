const router = require("express").Router();
const defaultApi = require("../controllers/pages");
const steamApi = require("../controllers/api/steam");
const error = require("../controllers/pages/error");

router.use("/", defaultApi);
router.use("/steam", steamApi);
router.use(error);

module.exports = router;
