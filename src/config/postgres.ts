import { Sequelize } from "sequelize-typescript";
import config from "./config";
import { Pool } from "pg";

// const postgres = new Sequelize(`postgres://${config.postgres.username}:${config.postgres.password}@${config.postgres.host}:${config.postgres.port}/${config.postgres.db}`, {
//   models:[]
// })

const postgres = new Pool({
  user: process.env.POSTGRES_USERNAME,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
},);

export default postgres;