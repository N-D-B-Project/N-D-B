import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Observable, catchError } from "rxjs";
import { CommandError } from "../errors/Command.error";

@Injectable()
export class CommandInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError(error => {
        if (error instanceof CommandError) {
          throw new BadRequestException(error.message);
        } else {
          throw error;
        }
      })
    );
  }
}
