import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  const decode = jwt.verify(authHeader as string, "vipul123");
  if (decode) {
    // @ts-ignore
    req.userId = decode.id;
    next();
  } else {
    // @ts-ignore
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
