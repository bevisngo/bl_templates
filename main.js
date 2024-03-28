import express from "express";
import routers from "./routes/index.js";
import router from "./routes/health-check.js";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// health check
app.use("/", router);
// endpoints
app.use("/api", routers.template1Router);
app.use("/api", routers.template2Router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
