import express, { Response } from "express";
import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
interface obj extends Request {
  user?: JwtPayload | undefined;
}
export function verifyToken(
  req: obj,
  res: Response,
  next: express.NextFunction
) {
  const authHeader = req.cookies.Authorization as string;
  console.log(authHeader);
  const token = authHeader;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "SECRET", (err: any, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
