import express from "express";

const checkAccess = (
    req: express.Request, 
    res: express.Response, 
    next: express.NextFunction
) => {
    const hasAccess = true;
    
    if (!hasAccess) {
        return res.status(403).json({
            message: "Acceso denegado",
        });
    }
    
    next();
}

export default checkAccess;