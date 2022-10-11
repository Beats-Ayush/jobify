import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  showStats,
  updateJob,
} from "../controllers/jobController.js";
const router = express.Router();

// ! private routes
router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").delete(deleteJob).patch(updateJob);
router.route("/stats").get(showStats);

export default router;
