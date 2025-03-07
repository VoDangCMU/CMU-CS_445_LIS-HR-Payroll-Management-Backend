import express, { Request, Response } from "express";
import { BenefitsPlan } from "@root/datasources/hr/entity/benefitsPlan.entity";
import { HRDataSource } from "@root/datasources/hr/data-source";

const benefitsPlanRouter = express.Router();
const benefitsPlanRepository = HRDataSource.getRepository(BenefitsPlan);

// Create a new benefits plan
benefitsPlanRouter.post("/", async (req: Request, res: Response) => {
    const benefitsPlan = benefitsPlanRepository.create(req.body);
    try {
        const savedPlan = await benefitsPlanRepository.save(benefitsPlan);
        res.Ok(savedPlan); // Using your custom response function
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error saving benefits plan");
    }
});

// Read all benefits plans
benefitsPlanRouter.get("/", async (req: Request, res: Response) => {
    try {
        const plans = await benefitsPlanRepository.find();
        res.Ok(plans); // Using your custom response function
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error retrieving benefits plans");
    }
});

// Read a single benefits plan by ID
benefitsPlanRouter.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const plan = await benefitsPlanRepository.findOneBy({ id: Number(id) });
        if (plan) {
            res.Ok(plan); // Using your custom response function
        } else {
            res.BadRequest("Benefits plan not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error retrieving benefits plan");
    }
});

// Update a benefits plan by ID
benefitsPlanRouter.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const plan = await benefitsPlanRepository.findOneBy({ id: Number(id) });
        if (plan) {
            benefitsPlanRepository.merge(plan, req.body);
            const updatedPlan = await benefitsPlanRepository.save(plan);
            res.Ok(updatedPlan); // Using your custom response function
        } else {
            res.BadRequest("Benefits plan not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error updating benefits plan");
    }
});

// Delete a benefits plan by ID
benefitsPlanRouter.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await benefitsPlanRepository.delete(Number(id));
        if (result.affected) {
            res.Ok({ message: "Benefits plan deleted successfully" }); // Using your custom response function
        } else {
            res.BadRequest("Benefits plan not found");
        }
    } catch (error) {
        console.error(error);
        res.InternalServerError("Error deleting benefits plan");
    }
});

module.exports = benefitsPlanRouter;
