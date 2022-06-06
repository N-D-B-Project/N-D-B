import { Logger } from "@Utils/Tools";
import { ErrorRequestHandler } from "express";

export default function (logger: Logger): ErrorRequestHandler {
  return (err, req, res, next) => {
    logger.error(
      `Um erro ocorreu ao processar o ${req.method} requisitado por ${req.url}`,
      err
    );
    res.status(500).json({ error: true, message: err.message });
  };
}
