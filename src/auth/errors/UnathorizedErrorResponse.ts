import { NextFunction, Request, Response } from "express";

export const UnathorizedErrorResponse = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send({ message: "Invalid token o.o" });
    return;
  }
  next();
};
