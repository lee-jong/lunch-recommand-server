import express from "express";
import { multiRecommand } from "controller/recommand";

const router = express.Router();
router.route("/send_recommand").get(multiRecommand);

export default router;
