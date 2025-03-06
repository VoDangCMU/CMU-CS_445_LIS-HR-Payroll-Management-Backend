import express, {Request, Response} from "express";

const employeeRouter = express.Router();

employeeRouter.get("/", (req: Request, res: Response) => {
    res.Ok("ok")
});

module.exports = employeeRouter;