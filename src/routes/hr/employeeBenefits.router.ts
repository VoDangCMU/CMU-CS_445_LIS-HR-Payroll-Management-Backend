import express, { Request, Response } from "express";
import { EmployeeBenefits } from "@root/datasources/hr/entity/employeeBenefits.entity";
import { Employee } from "@root/datasources/hr/entity/employee.entity";
import { BenefitsPlan } from "@root/datasources/hr/entity/benefitsPlan.entity";
import { HRDataSource } from "@root/datasources/hr/data-source";

const employeeBenefitsRouter = express.Router();
const employeeBenefitsRepository = HRDataSource.getRepository(EmployeeBenefits);
const employeeRepository = HRDataSource.getRepository(Employee);
const benefitsPlanRepository = HRDataSource.getRepository(BenefitsPlan);

// Create a new employee benefit
employeeBenefitsRouter.post("/", async (req: Request, res: Response) => {
    const { employeeId, benefitsPlanId, startDate } = req.body;

    const employee = await employeeRepository.findOneBy({ id: employeeId });
    const benefitsPlan = await benefitsPlanRepository.findOneBy({ id: benefitsPlanId });

    if (!employee || !benefitsPlan) {
        return res.BadRequest("Employee or Benefits Plan not found");
    }

    const employeeBenefit = employeeBenefitsRepository.create({
        employee,
        benefitsPlan,
        startDate,
    });

    try {
        const savedBenefit = await employeeBenefitsRepository.save(employeeBenefit);
        res.Ok(savedBenefit);
    } catch (error) {
        res.InternalServerError("");
    }
});

// Read all employee benefits
employeeBenefitsRouter.get("/", async (req: Request, res: Response) => {
    try {
        const benefits = await employeeBenefitsRepository.find({ relations: ["employee", "benefitsPlan"] });
        res.Ok(benefits);
    } catch (error) {
        res.InternalServerError("");
    }
});

// Read a single employee benefit by ID
employeeBenefitsRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const benefit = await employeeBenefitsRepository.findOne({
            where: { id: Number(id) },
            relations: ["employee", "benefitsPlan"],
        });
        if (benefit) {
            res.Ok(benefit);
        } else {
            res.BadRequest("Employee benefit not found");
        }
    } catch (error) {
        res.InternalServerError("");
    }
});

// Update an employee benefit by ID
employeeBenefitsRouter.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const benefit = await employeeBenefitsRepository.findOneBy({ id: Number(id) });
        if (benefit) {
            employeeBenefitsRepository.merge(benefit, req.body);
            const updatedBenefit = await employeeBenefitsRepository.save(benefit);
            res.Ok(updatedBenefit);
        } else {
            res.BadRequest("Employee benefit not found");
        }
    } catch (error) {
        res.InternalServerError("");
    }
});

// Delete an employee benefit by ID
employeeBenefitsRouter.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await employeeBenefitsRepository.delete(Number(id));
        if (result.affected) {
            res.Ok({ message: "Employee benefit deleted successfully" });
        } else {
            res.BadRequest("Employee benefit not found");
        }
    } catch (error) {
        res.InternalServerError("");
    }
});

export default employeeBenefitsRouter;
