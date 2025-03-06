import express from 'express';
import {injectCoreServices} from "@root/middlewares/injectCoreServices";
import env from "@root/env";
import {HRDataSource} from "@root/datasources/hr/data-source";
import {PayrollDataSource} from "@root/datasources/payroll/data-source";
import * as path from "node:path";
import fs from "fs";

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

const routesPath = path.resolve(__dirname, 'routes');
const routes: Array<string> = fs
    .readdirSync(routesPath)
    .filter((e: string) => !(e.includes('.router.js') || e.includes('.router.ts')));

for (const router of routes) {
    const routerPath = path.resolve(routesPath, router);
    const routerFiles: Array<string> = fs.readdirSync(routerPath).filter((e: string) => e.includes('.router.js') || e.includes('.router.ts'));

    for (const routerFile of routerFiles) {
        const requiredPath = path.resolve(routerPath, routerFile);
        console.log("Registering router:", router, "- File: ", requiredPath);

        const routerBody = require(requiredPath);

        app.use(`/${router}`, routerBody)
    }
}

app.listen(env.APP_PORT, () => {
    console.log(`Server running on port ${env.APP_PORT}\nURL: http://localhost:${env.APP_PORT}`);
});