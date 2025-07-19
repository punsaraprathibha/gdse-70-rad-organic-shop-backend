import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticateToken = (req: Request,
                                  res: Response,
                                  next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({
            error: 'Auth token is not present in request headers!'
        });
        return;
    }

    jwt.verify(token, JWT_SECRET,
        (error, user) => {
        if (error) {
            res.status(401).json({
                error: 'Invalid or expired auth token ' +
                    'provided!'
            });
            return;
        }
        (req as Request & {user?:any}).user = user;
        next();
    });
}

export const authorizeRoles = (... roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as Request & { user?: any }).user;
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({
                error: "Access denied! User doesn't have " +
                    "permission to perform this operation"
            });
            return;
        }
        next();
    }
}