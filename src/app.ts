import express, { ErrorRequestHandler, Express } from "express";
import log4js from "log4js";
import morgan from "morgan";
import { LOG_DEBUG } from "./config/constants";
import getDefaultRouter from "./routes/general";

async function main() {
  const app = express();
  const port = 3000;

  initLogging(app);
  const router = await getDefaultRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
    log4js.getLogger().error(err);
    res.status(500);
    res.send({ errorMessage: err.message });
  };

  app.use(router);
  app.use(errorHandler);

  app.listen(port, () => {
    const logger = log4js.getLogger();
    logger.info(`Express is listening at port ${port}`);
    logger.debug(`Debugging the app running at port ${port}`);
  });

  function initLogging(app: Express) {
    let appenders = ["stdout", "file"];
    let level = "info";

    if (process.env.NODE_ENV != "production" || LOG_DEBUG) {
      app.use(morgan("dev"));
      appenders = ["stdout"];
      level = "debug";
    }

    log4js.configure({
      appenders: {
        file: {
          type: "dateFile",
          filename: "./logs/server.log",
          backups: 7,
          compress: true,
          mode: (0o644).toString(8),
        },
        stdout: { type: "stdout" },
      },
      categories: {
        default: { appenders: appenders, level: level },
      },
    });
  }
}

main().catch(console.error);
