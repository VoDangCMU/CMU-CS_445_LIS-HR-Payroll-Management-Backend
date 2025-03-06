// src/routes/hr/employee.router.ts
import express, { Request, Response } from "express";
import { Employee } from "@root/datasources/hr/entity/employee.entity";
import { Department } from "@root/datasources/hr/entity/department.entity";
import { HRDataSource } from "@root/datasources/hr/data-source";

const employeeRouter = express.Router();
const employeeRepository = HRDataSource.getRepository(Employee);
const departmentRepository = HRDataSource.getRepository(Department);

// Create a new employee
employeeRouter.post("/", async (req: Request, res: Response) => {
    const { departmentId, ...employeeData } = req.body;

    const department = await departmentRepository.findOneBy({ departmentID: departmentId });
    if (!department) {
        return res.BadRequest("Department not found");
    }

    const employee = employeeRepository.create({
        ...employeeData,
        department,
    });

    try {
        const savedEmployee = await employeeRepository.save(employee);
        res.Ok(savedEmployee);
    } catch (error) {
        res.InternalServerError("");
    }
});

// Read all employees
employeeRouter.get("/", async (req: Request, res: Response) => {
    try {
        const employees = await employeeRepository.find({ relations: ["department", "employeeBenefits"] });
        res.Ok(employees);
    } catch (error) {
        console.error(error)
        res.InternalServerError("");
    }
});

// Read a single employee by ID
employeeRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const employee = await employeeRepository.findOne({
            where: { id: Number(id) },
            relations: ["department", "employeeBenefits"],
        });
        if (employee) {
            res.Ok(employee);
        } else {
            res.BadRequest("Employee not found");
        }
    } catch (error) {
        res.InternalServerError("");
    }
});

// Update an employee by ID
employeeRouter.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { departmentId, ...employeeData } = req.body;

    try {
        const employee = await employeeRepository.findOneBy({ id: Number(id) });
        if (employee) {
            if (departmentId) {
                const department = await departmentRepository.findOneBy({ departmentID: departmentId });
                if (!department) {
                    return res.BadRequest("Department not found");
                }
                employee.department = department;
            }
            employeeRepository.merge(employee, employeeData);
            const updatedEmployee = await employeeRepository.save(employee);
            res.Ok(updatedEmployee);
        } else {
            res.BadRequest("Employee not found");
        }
    } catch (error) {
        res.InternalServerError("");
    }
});

// Delete an employee by ID
employeeRouter.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await employeeRepository.delete(Number(id));
        if (result.affected) {
            res.Ok({ message: "Employee deleted successfully" });
        } else {
            res.BadRequest("Employee not found");
        }
    } catch (error) {
        res.InternalServerError("");
    }
});

module.exports = employeeRouter;
