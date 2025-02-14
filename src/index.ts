import express from 'express';
import {injectCoreServices} from "@root/middlewares/injectCoreServices";
import env from "@root/env";
import {HRDataSource} from "@root/datasources/hr/data-source";
import {PayrollDataSource} from "@root/datasources/payroll/data-source";

import { ObjectId } from 'mongodb'

export const toObjectId = (value: string | ObjectId): ObjectId => {
    return typeof value === 'string' ? new ObjectId(value) : value
}

HRDataSource.initialize()
    .then(() => console.log('PSQL: HR database connection established'))
    .catch((err) => {
        console.error(err);
    });

PayrollDataSource.initialize()
    .then(() => {
        console.log('MONGODB: Payroll database connection established')
    })
    .catch((err) => {
        console.error(err);
    });



const app = express();

app.use(injectCoreServices);
app.use(express.json());

app.get("/", (req, res) => {
    res.Ok("Work")
})

app.listen(env.APP_PORT, () => {
    console.log(`Server running on port ${env.APP_PORT}\nURL: http://localhost:${env.APP_PORT}`);
});