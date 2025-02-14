import { DataSource } from 'typeorm';
import env from "../../env";

export const HRDataSource = new DataSource({
    type: 'postgres',
    host: env.PG_HOST,
    port: env.PG_PORT,
    username: env.PG_USERNAME,
    password: env.PG_PASSWORD,
    database: `${env.PG_DATABASE}_${env.ENV}`,
    synchronize: true,
    logging: env.ENV !== 'production' && env.ENV !== 'testing',
    entities: [__dirname + '/entity/*.{js,ts}'],
    subscribers: [],
    migrations: [],
});