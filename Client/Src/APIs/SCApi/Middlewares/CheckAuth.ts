import * as Express from "express";

export default function CheckAuth(token: string): Express.RequestHandler {
  return (req, res, next) => {
    if (req.headers.authorization !== token) {
      res.sendStatus(401);
      return;
    }
    next();
  };
}
