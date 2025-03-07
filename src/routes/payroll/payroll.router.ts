import express, { Request, Response } from "express";
import { PayrollRecord } from "@root/datasources/payroll/entity/payroll.entity";
import { PayrollDataSource } from "@root/datasources/payroll/data-source";
import { HRDataSource } from "@root/datasources/hr/data-source";
import { Employee } from "@root/datasources/hr/entity/employee.entity";
import { ObjectId } from "bson";

const payrollRouter = express.Router();
const payrollRepository = PayrollDataSource.getRepository(PayrollRecord);
const employeeRepository = HRDataSource.getRepository(Employee);

// Create a new payroll record
payrollRouter.post("/", async (req: Request, res: Response) => {
    const { employeeID, payDate, grossSalary, netSalary, deductions, benefitsPaid } = req.body;

    try {
        // Check if the employee exists in the HR datasource
        const employee = await employeeRepository.findOneBy({ id: employeeID });
        if (!employee) {
            return res.BadRequest("Employee not found");
        }

        // Check for existing payroll record for the same employee and pay date
        const existingRecord = await payrollRepository.findOneBy({ employeeID });
        if (existingRecord) {
            return res.BadRequest("Payroll record for this employee already exists");
        }

        const payrollRecord = payrollRepository.create({
            employeeID,
            payDate,
            grossSalary,
            netSalary,
            deductions,
            benefitsPaid,
        });

        const savedRecord = await payrollRepository.save(payrollRecord);
        res.Ok({ ...savedRecord, employee }); // Include employee data in the response
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error saving payroll record");
    }
});

// Read all payroll records
payrollRouter.get("/", async (req: Request, res: Response) => {
    try {
        const records = await payrollRepository.find();
        const detailedRecords = await Promise.all(
            records.map(async (record) => {
                const employee = await employeeRepository.findOneBy({ id: record.employeeID });
                return { ...record, employee }; // Include employee data in each record
            })
        );

        console.log(detailedRecords);

        res.Ok(detailedRecords);
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error retrieving payroll records");
    }
});

// Read a single payroll record by ID
payrollRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const record = await payrollRepository.findOneBy({ _id: new ObjectId(id) });
        if (record) {
            const employee = await employeeRepository.findOneBy({ id: record.employeeID });
            res.Ok({ ...record, employee }); // Include employee data in the response
        } else {
            res.BadRequest("Payroll record not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error retrieving payroll record");
    }
});

// Update a payroll record by ID
payrollRouter.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const record = await payrollRepository.findOneBy({ _id: new ObjectId(id) });

        if (record) {
            payrollRepository.merge(record, req.body);
            const updatedRecord = await payrollRepository.save(record);
            const employee = await employeeRepository.findOneBy({ id: updatedRecord.employeeID });
            res.Ok({ ...updatedRecord, employee }); // Include employee data in the response
        } else {
            res.BadRequest("Payroll record not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error updating payroll record");
    }
});

// Delete a payroll record by ID
payrollRouter.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await payrollRepository.delete(new ObjectId(id));
        if (result.affected) {
            res.Ok({ message: "Payroll record deleted successfully" });
        } else {
            res.BadRequest("Payroll record not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error deleting payroll record");
    }
});

module.exports = payrollRouter;
