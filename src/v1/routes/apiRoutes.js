import express from "express";
import getArticles from "../handlers/articles/getArticles";
import getArticleNames from "../handlers/names/getArticleNames";
import getDates from "../handlers/dates/getDates";


const router = express.Router();

router.get("/articles/names", getArticleNames);
router.get("/articles/dates", getDates);
router.get("/articles", getArticles);

export default router;
