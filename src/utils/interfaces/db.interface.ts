import { PoolOptions, Dialect } from "sequelize";
export default interface DB {
  name: string;
  user: string;
  pass: string;
  host: string;
  port: number;
  dialect: Dialect;
  pool: PoolOptions;
}
