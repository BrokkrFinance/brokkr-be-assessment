import express, { Router } from "express";
import log4js from "log4js";
import { HELLO_MESSAGE } from "../config/constants";
import client, { register } from "prom-client";

export default async function getDefaultRouter(): Promise<Router> {
  await client.collectDefaultMetrics();
  const router = express.Router();
  const logger = log4js.getLogger();

  router.get("/", (req, res) => {
    // Confirm that API works
    res.send("What can I do for you?");
  });

  router.get("/info", async (req, res) => {
    try {
      res.send({
        helloMessage: HELLO_MESSAGE,
      });
    } catch (e: unknown) {
      logger.error(e);

      let message = "Unknown Error";
      if (e instanceof Error) {
        message = e.message;
      }
      res.status(500).send({
        errorMessage: message,
      });
    }
  });

  router.get("/metrics", async (req, res) => {
    const metrics = await register.metrics();

    res.contentType(register.contentType).send(metrics);
  });

  router.get("*", function (req, res) {
    res.status(404).send({ errorMessage: "Not found" });
  });

  return router;
}
