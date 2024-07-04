import express from "express";
import { sendRecommand } from "controller/recommand";

const router = express.Router();
router.route("/send_recommand").get(sendRecommand);

export default router;
