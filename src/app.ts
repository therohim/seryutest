import "reflect-metadata";

import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: process.argv[2] });
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import config from './config/config';
import postgres from './config/postgres';
import createResponse from './utils/http-response';
import baseRouter from "./routes/base";

const app = express();
const server: http.Server = http.createServer(app);

/** Secure Express HTTP headers */
app.use(helmet());

/** Parse the body of the request */
app.use(cors({ origin: config.server.cors }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** Rules of our API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Route */
app.use(`health-check`, (req, res) => {
    res.json({
        message: 'Health check success'
    })
});
app.use(baseRouter);

/** Error handling */
app.use((req, res, next) => {
    createResponse(res, 404, {
        message: { id: 'Route Not found' }
    });
    return;
});

const start = async (): Promise<void> => {
  try {
    // console.log(config.postgres.host)
    await postgres.connect()
    app.listen(config.server.port, () => {
      console.log(`Server started on port ${config.server.port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();