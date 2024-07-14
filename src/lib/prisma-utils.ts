import { HttpStatus } from "@nestjs/common";
import { PrismaClientExceptionFilter } from "nestjs-prisma";

export const PrismaExceptionFilter = (httpAdapter) => {
	return new PrismaClientExceptionFilter(httpAdapter, {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  });
};
