import express from "express";
import getCounts from "../handlers/getCounts";
import getArticles from "../handlers/getArticles";


const router = express.Router();

router.get("/articles", getArticles);
router.get("/counts", getCounts)

export default router;
