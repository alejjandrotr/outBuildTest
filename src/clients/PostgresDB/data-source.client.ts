import { DataSource, DataSourceOptions } from "typeorm";
import { CONFIG_VARS } from "../../common/configs/config";

const DBConfig = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  url: CONFIG_VARS.DATABASE_URL,
  ssl: true,
  entities: ["src/**/**/*.entity.ts"],
  logging: false,
  synchronize: true,
} as DataSourceOptions;
export const DBSource = new DataSource(DBConfig);
export const DBSourceTest = new DataSource({
  ...DBConfig,
  url: CONFIG_VARS.DATABASE_URL_TEST || "",
} as DataSourceOptions);
