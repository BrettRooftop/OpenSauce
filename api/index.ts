import express from "express";
import apiRouter from "../src/apiRoutes.js";

const app = express();
app.use(express.json());
app.use(apiRouter); // We will map /api/* to this in vercel.json, or just mount it. 
// However, since vercel.json will rewrite `/api/(.*)` to `/api/index.ts`, 
// the request path arriving here from Express might still include `/api` depending on the rewrite or if Express strips it.
// To be safe, the safest is to export an Express app that uses the router at `/api`.

const exportApp = express();
exportApp.use("/api", apiRouter);

export default exportApp;
