import { ConnectionOptions } from "typeorm"

export const ormconfig: ConnectionOptions = {
  type: "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.DB_PORT ?? "3306"),
  username: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "db",
  entities: ["src/entity/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  synchronize: process.env.NODE_ENV === "development",
  logging: false,
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
}

// configファイルとしても利用するためdefault exportも定義
export default ormconfig
