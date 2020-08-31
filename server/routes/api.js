const router = require("express").Router();
const defaultApi = require("../controllers/pages");
const steamApi = require("../controllers/api/steam");

router.use("/", defaultApi);
router.use("/steam", steamApi);

module.exports = router;
