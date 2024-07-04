import express from "express";
import {
  fileUpload,
  addAddrException,
  addNameException,
} from "controller/upload";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, _file, cb) => {
    cb(null, "Restaurant.csv");
  },
});

const upload = multer({ storage });

const router = express.Router();
router.route("/upload").post(upload.single("file"), fileUpload);
router.route("/name-exception").post(addNameException);
router.route("/addr-exception").post(addAddrException);

export default router;
