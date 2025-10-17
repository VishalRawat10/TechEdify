const express = require("express");
const router = express.Router();

const { authenticateAdmin } = require("../middlewares/middlewares");
const queryMessageController = require("../controllers/queryMessage.controller.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.route("/").get(authenticateAdmin, wrapAsync(queryMessageController.getQueryMessages)).post(wrapAsync(queryMessageController.postQueryMessage));
router.route("/:id").patch(authenticateAdmin, wrapAsync(queryMessageController.updateResolvedStatus));

module.exports = router;