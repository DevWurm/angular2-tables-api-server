import express from "express";
import cors from 'cors';

import v1ApiRoutes from "./v1/routes/apiRoutes";

// setup express application
const app = express();

// setup Cross-Origin-Resource-Sharing (CORS)
app.use(cors());

// setup routes
app.use("/api/v1/", v1ApiRoutes);

// Handle 404
app.use(function(req, res) {
    res.status(404).json({error: "Page not found"}).end();
});

// Handle 500
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({error: (err.message || "Internal server error")}).end();
});
  
export default app;
