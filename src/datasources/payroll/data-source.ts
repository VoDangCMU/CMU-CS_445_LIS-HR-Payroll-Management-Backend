import { DataSource } from 'typeorm';
import env from "../../env";

export const PayrollDataSource = new DataSource({
    type: 'mongodb',
    host: env.MONGO_HOST,
    port: env.MONGO_PORT,
    username: env.MONGO_USERNAME,
    password: env.MONGO_PASSWORD,
    database: `${env.MONGO_DATABASE}_${env.ENV}`,
    synchronize: true,
    logging: env.ENV !== 'production' && env.ENV !== 'testing',
    entities: [__dirname + '/entity/*.{js,ts}'],
    subscribers: [],
    migrations: [],
    authSource: 'admin',
});