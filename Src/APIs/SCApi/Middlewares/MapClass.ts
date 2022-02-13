import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import * as Express from "express";

export default function MapClass(
  cls: ClassConstructor<object>
): Express.RequestHandler {
  return async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    // Map to class
    let obj: object = plainToInstance(cls, req.body);

    // Validate class
    let errors = await validate(obj, {
      skipMissingProperties: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      forbidUnknownValues: true,
    });
    if (errors.length > 0) {
      res
        .status(400)
        .send({ error: true, errors: formatValidationErrors(errors) });
      return;
    }

    // Set validated class to locals
    res.locals.input = obj;
    next();
  };
}

interface ValidationErrorLog {
  property: string;
  constraints?: { [type: string]: string };
  children?: ValidationErrorLog[];
}

function formatValidationErrors(
  errors: ValidationError[]
): ValidationErrorLog[] {
  return errors.map((error) => ({
    property: error.property,
    constraints: error.constraints,
    children:
      error.children?.length > 0
        ? formatValidationErrors(error.children)
        : undefined,
  }));
}
