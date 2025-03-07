import express, { Request, Response } from "express";
import { EmployeeBenefits } from "@root/datasources/hr/entity/employeeBenefits.entity";
import { Employee } from "@root/datasources/hr/entity/employee.entity";
import { BenefitsPlan } from "@root/datasources/hr/entity/benefitsPlan.entity";
import { HRDataSource } from "@root/datasources/hr/data-source";

const employeeBenefitsRouter = express.Router();
const employeeBenefitsRepository = HRDataSource.getRepository(EmployeeBenefits);
const employeeRepository = HRDataSource.getRepository(Employee);
const benefitsPlanRepository = HRDataSource.getRepository(BenefitsPlan);

// Create a new EmployeeBenefits record
employeeBenefitsRouter.post("/", async (req: Request, res: Response) => {
    const { employeeId, benefitsPlanId, startDate } = req.body;

    try {
        const employee = await employeeRepository.findOneBy({ id: employeeId });
        const benefitsPlan = await benefitsPlanRepository.findOneBy({ id: benefitsPlanId });

        if (!employee) {
            return res.BadRequest("Employee not found");
        }
        if (!benefitsPlan) {
            return res.BadRequest("Benefits plan not found");
        }

        const employeeBenefits = employeeBenefitsRepository.create({
            employee,
            benefitsPlan,
            startDate, // Include start date
        });

        const savedEmployeeBenefits = await employeeBenefitsRepository.save(employeeBenefits);
        res.Ok(savedEmployeeBenefits); // Using your custom response function
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error saving employee benefits");
    }
});

// Read all EmployeeBenefits records with relations
employeeBenefitsRouter.get("/", async (req: Request, res: Response) => {
    try {
        const employeeBenefits = await employeeBenefitsRepository.find({
            relations: ["employee", "benefitsPlan"],
        });
        res.Ok(employeeBenefits); // Using your custom response function
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error retrieving employee benefits");
    }
});

// Read a single EmployeeBenefits record by ID with relations
employeeBenefitsRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const employeeBenefits = await employeeBenefitsRepository.findOne({
            where: { id: Number(id) },
            relations: ["employee", "benefitsPlan"],
        });
        if (employeeBenefits) {
            res.Ok(employeeBenefits); // Using your custom response function
        } else {
            res.BadRequest("Employee benefits record not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error retrieving employee benefits");
    }
});

// Update an EmployeeBenefits record by ID
employeeBenefitsRouter.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { employeeId, benefitsPlanId, startDate } = req.body;

    try {
        const employeeBenefits = await employeeBenefitsRepository.findOneBy({ id: Number(id) });

        if (employeeBenefits) {
            if (employeeId) {
                const employee = await employeeRepository.findOneBy({ id: employeeId });
                if (!employee) {
                    return res.BadRequest("Employee not found");
                }
                employeeBenefits.employee = employee; // Update employee reference
            }

            if (benefitsPlanId) {
                const benefitsPlan = await benefitsPlanRepository.findOneBy({ id: benefitsPlanId });
                if (!benefitsPlan) {
                    return res.BadRequest("Benefits plan not found");
                }
                employeeBenefits.benefitsPlan = benefitsPlan; // Update benefits plan reference
            }

            if (startDate) {
                employeeBenefits.startDate = startDate; // Update start date
            }

            const updatedEmployeeBenefits = await employeeBenefitsRepository.save(employeeBenefits);
            res.Ok(updatedEmployeeBenefits); // Using your custom response function
        } else {
            res.BadRequest("Employee benefits record not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error updating employee benefits");
    }
});

// Delete an EmployeeBenefits record by ID
employeeBenefitsRouter.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await employeeBenefitsRepository.delete(Number(id));
        if (result.affected) {
            res.Ok({ message: "Employee benefits record deleted successfully" }); // Using your custom response function
        } else {
            res.BadRequest("Employee benefits record not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error deleting employee benefits");
    }
});

module.exports = employeeBenefitsRouter;
