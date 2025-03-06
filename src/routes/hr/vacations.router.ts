import express, { Request, Response } from "express";
import { VacationRecord } from "@root/datasources/hr/entity/vacation.entity";
import { Employee } from "@root/datasources/hr/entity/employee.entity";
import { HRDataSource } from "@root/datasources/hr/data-source";

const vacationRouter = express.Router();
const vacationRepository = HRDataSource.getRepository(VacationRecord);
const employeeRepository = HRDataSource.getRepository(Employee);

// Create a new vacation record
vacationRouter.post("/", async (req: Request, res: Response) => {
    const { employeeId, vacationDate, vacationDays } = req.body;

    const employee = await employeeRepository.findOneBy({ id: employeeId });
    if (!employee) {
        return res.BadRequest("Employee not found");
    }

    const vacationRecord = vacationRepository.create({
        employee,
        vacationDate,
        vacationDays,
    });

    try {
        const savedRecord = await vacationRepository.save(vacationRecord);
        res.Ok(savedRecord);
    } catch (error) {
        res.InternalServerError("");
    }
});

// Read all vacation records
vacationRouter.get("/", async (req: Request, res: Response) => {
    try {
        const records = await vacationRepository.find({ relations: ["employee"] });
        res.Ok(records);
    } catch (error) {
        res.InternalServerError("");
    }
});

// Read a single vacation record by ID
vacationRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const record = await vacationRepository.findOne({
            where: { id: Number(id) },
            relations: ["employee"],
        });
        if (record) {
            res.Ok(record);
        } else {
            res.BadRequest("Vacation record not found");
        }
    } catch (error) {
        res.InternalServerError("");
    }
});

// Update a vacation record by ID
vacationRouter.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const record = await vacationRepository.findOneBy({ id: Number(id) });
        if (record) {
            vacationRepository.merge(record, req.body);
            const updatedRecord = await vacationRepository.save(record);
            res.Ok(updatedRecord);
        } else {
            res.BadRequest("Vacation record not found");
        }
    } catch (error) {
        res.InternalServerError("");
    }
});

// Delete a vacation record by ID
vacationRouter.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await vacationRepository.delete(Number(id));
        if (result.affected) {
            res.Ok({ message: "Vacation record deleted successfully" });
        } else {
            res.BadRequest("Vacation record not found");
        }
    } catch (error) {
        res.InternalServerError("");
    }
});

export default vacationRouter;
