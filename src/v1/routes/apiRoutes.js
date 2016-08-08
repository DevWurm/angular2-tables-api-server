import express from "express";
import getCounts from "../handlers/getCounts";

const router = express.Router();

router.get("/counts", getCounts)

export default router;
