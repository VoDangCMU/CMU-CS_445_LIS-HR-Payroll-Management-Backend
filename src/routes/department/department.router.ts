import express, { Request, Response } from "express";
import { Department } from "@root/datasources/hr/entity/department.entity";
import { HRDataSource } from "@root/datasources/hr/data-source";

const departmentRouter = express.Router();
const departmentRepository = HRDataSource.getRepository(Department);

// Create a new department
departmentRouter.post("/", async (req: Request, res: Response) => {
    const department = departmentRepository.create(req.body);
    try {
        const savedDepartment = await departmentRepository.save(department);
        res.Ok(savedDepartment);
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error saving department");
    }
});

// Read all departments
departmentRouter.get("/", async (req: Request, res: Response) => {
    try {
        const departments = await departmentRepository.find();
        res.Ok(departments);
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error retrieving departments");
    }
});

// Read a single department by ID
departmentRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const department = await departmentRepository.findOneBy({ departmentID: Number(id) });
        if (department) {
            res.Ok(department);
        } else {
            res.BadRequest("Department not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error retrieving department");
    }
});

// Update a department by ID
departmentRouter.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const department = await departmentRepository.findOneBy({ departmentID: Number(id) });
        if (department) {
            departmentRepository.merge(department, req.body);
            const updatedDepartment = await departmentRepository.save(department);
            res.Ok(updatedDepartment);
        } else {
            res.BadRequest("Department not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error updating department");
    }
});

// Delete a department by ID
departmentRouter.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await departmentRepository.delete(Number(id));
        if (result.affected) {
            res.Ok({ message: "Department deleted successfully" });
        } else {
            res.BadRequest("Department not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error deleting department");
    }
});

module.exports = departmentRouter;
