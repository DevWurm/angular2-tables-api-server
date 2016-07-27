import express from "express";
import getArticles from "../handlers/getArticles";

const router = express.Router();

router.get("/articles", getArticles)

export default router;
