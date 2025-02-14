import {z} from 'zod';
import {config} from 'dotenv';
import * as process from "node:process";

const PORT_PER_ENV = {
    "development": 4532,
    "production": 7682,
    "staging": 9241,
    "testing": 9243,
}

config();

const env_schema = z.object({
    ENV: z
        .union([
            z.literal('development'),
            z.literal('staging'),
            z.literal('production'),
            z.literal('testing'),
        ])
        .optional()
        .default('development'),
    APP_PORT: z.string().regex(/^\d+$/).transform(Number).optional(),
    PG_HOST: z.string().ip(),
    PG_PORT: z.string().regex(/^\d+$/).transform(Number),
    PG_USERNAME: z.string(),
    PG_PASSWORD: z.string(),
    PG_DATABASE: z.string(),
    MONGO_HOST: z.string().ip(),
    MONGO_PORT: z.string().regex(/^\d+$/).transform(Number),
    MONGO_USERNAME: z.string(),
    MONGO_PASSWORD: z.string(),
    MONGO_DATABASE: z.string(),
})

const env = env_schema.parse(process.env);

env.APP_PORT = PORT_PER_ENV[env.ENV];

export default env;
