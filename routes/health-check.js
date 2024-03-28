import express from "express";

const router = express.Router();


router.get("/ping", async (_, res) => {
    res.json({
      message: "pong!!",
    });
  });

export default router;
