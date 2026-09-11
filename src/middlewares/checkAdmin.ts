import express from "express";

const checkAdmin = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    console.log("Checking admin permissions...");
    next();
}

export default checkAdmin;