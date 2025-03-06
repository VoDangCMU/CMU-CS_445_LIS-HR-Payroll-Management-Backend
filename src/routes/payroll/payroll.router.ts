import express, { Request, Response } from "express";
import { PayrollRecord } from "@root/datasources/payroll/entity/payroll.entity";
import { PayrollDataSource } from "@root/datasources/payroll/data-source";
import {ObjectId} from "mongodb";

const payrollRouter = express.Router();
const payrollRepository = PayrollDataSource.getRepository(PayrollRecord);

// Create a new payroll record
payrollRouter.post("/", async (req: Request, res: Response) => {
    const payrollRecord = payrollRepository.create(req.body);
    try {
        const savedRecord = await payrollRepository.save(payrollRecord);
        res.Ok(savedRecord);
    } catch (error) {
        res.InternalServerError("");
    }
});

// Read all payroll records
payrollRouter.get("/", async (req: Request, res: Response) => {
    try {
        const records = await payrollRepository.find();
        res.Ok(records);
    } catch (error) {
        res.InternalServerError("");
    }
});

// Read a single payroll record by ID
payrollRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const record = await payrollRepository.findOneBy({ id: new ObjectId(id) });
        if (record) {
            res.Ok(record);
        } else {
            res.BadRequest("Payroll record not found");
        }
    } catch (error) {
        res.InternalServerError("");
    }
});

// Update a payroll record by ID
payrollRouter.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const record = await payrollRepository.findOneBy({ id: new ObjectId(id) });
        if (record) {
            payrollRepository.merge(record, req.body);
            const updatedRecord = await payrollRepository.save(record);
            res.Ok(updatedRecord);
        } else {
            res.BadRequest("Payroll record not found");
        }
    } catch (error) {
        res.InternalServerError("");
    }
});

// Delete a payroll record by ID
payrollRouter.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await payrollRepository.delete(Number(id));
        if (result.affected) {
            res.Ok({ message: "Payroll record deleted successfully" });
        } else {
            res.BadRequest("Payroll record not found");
        }
    } catch (error) {
        res.InternalServerError("");
    }
});

module.exports = payrollRouter;
