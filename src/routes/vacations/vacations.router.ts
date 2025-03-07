import express, { Request, Response } from "express";
import { Vacation } from "@root/datasources/hr/entity/vacation.entity";
import { Employee } from "@root/datasources/hr/entity/employee.entity";
import { HRDataSource } from "@root/datasources/hr/data-source";

const vacationRouter = express.Router();
const vacationRepository = HRDataSource.getRepository(Vacation);
const employeeRepository = HRDataSource.getRepository(Employee);

// Create a new vacation with employee
vacationRouter.post("/", async (req: Request, res: Response) => {
    const { employeeId, ...vacationData } = req.body;

    try {
        const employee = await employeeRepository.findOneBy({ id: employeeId });
        if (!employee) {
            return res.BadRequest("Employee not found");
        }

        const vacation = vacationRepository.create({
            ...vacationData,
            employee,
        });

        const savedVacation = await vacationRepository.save(vacation);
        res.Ok(savedVacation); // Using your custom response function
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error saving vacation");
    }
});

// Read all vacations with employee details
vacationRouter.get("/", async (req: Request, res: Response) => {
    try {
        const vacations = await vacationRepository.find({ relations: ["employee"] });
        res.Ok(vacations); // Using your custom response function
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error retrieving vacations");
    }
});

// Read a single vacation by ID with employee details
vacationRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const vacation = await vacationRepository.findOne({
            where: { id: Number(id) },
            relations: ["employee"],
        });
        if (vacation) {
            res.Ok(vacation); // Using your custom response function
        } else {
            res.BadRequest("Vacation not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error retrieving vacation");
    }
});

vacationRouter.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { employeeId, ...vacationData } = req.body;

    try {
        const vacation = await vacationRepository.findOneBy({ id: Number(id) });
        if (vacation) {
            vacationRepository.merge(vacation, vacationData);
            const updatedVacation = await vacationRepository.save(vacation);
            res.Ok(updatedVacation); // Using your custom response function
        } else {
            res.BadRequest("Vacation not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error updating vacation");
    }
});

// Delete a vacation by ID
vacationRouter.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await vacationRepository.delete(Number(id));
        if (result.affected) {
            res.Ok({ message: "Vacation deleted successfully" }); // Using your custom response function
        } else {
            res.BadRequest("Vacation not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error deleting vacation");
    }
});

module.exports = vacationRouter;
