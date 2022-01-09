import { ConnectionOptions } from "typeorm"

const dir = process.env.NODE_ENV === "development" ? "./src/" : "./dist/"
const extension = process.env.NODE_ENV === "development" ? "ts" : "js"

export const ormconfig: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.DB_PORT ?? "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [dir + "entity/*." + extension],
  migrations: [dir + "migration/**/*." + extension],
  synchronize: false,
  logging: false,
  cli: {
    entitiesDir: dir + "entity",
    migrationsDir: dir + "migration",
    subscribersDir: dir + "subscriber",
  },
}

// configファイルとしても利用するためdefault exportも定義
export default ormconfig
