import express from "express";
import getCounts from "../handlers/counts/getCounts";
import getArticles from "../handlers/articles/getArticles";
import getDates from "../handlers/dates/getDates";


const router = express.Router();

router.get("/articles", getArticles);
router.get("/counts", getCounts)
router.get("/dates", getDates);

export default router;
