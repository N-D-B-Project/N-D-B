import { RequestHandler } from "express";

export default function CheckAuth(token: string): RequestHandler {
  return (req, res, next) => {
    if (req.headers.authorization !== token) {
      res.sendStatus(401);
      return;
    }
    next();
  };
}
