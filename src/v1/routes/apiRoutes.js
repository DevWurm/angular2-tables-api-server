import express from "express";
import getCounts from "../handlers/getCounts";
import getArticles from "../handlers/getArticles";
import getDates from "../handlers/getDates";


const router = express.Router();

router.get("/articles", getArticles);
router.get("/counts", getCounts)
router.get("/dates", getDates);

export default router;
