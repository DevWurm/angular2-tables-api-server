import express from "express";

import v1ApiRoutes from "./v1/routes/apiRoutes";

// setup express application
const app = express();

// setup routes
app.use("/api/v1/", v1ApiRoutes);

// setup error handler and fallbacks
app.use(function(err, req, res, next) {
    
})

export default app;
