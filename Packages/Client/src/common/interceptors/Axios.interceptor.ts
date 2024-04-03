import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, catchError } from "rxjs";
import { CommandError } from "../errors/Command.error";

@Injectable()
export class AxiosInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
		return next.handle().pipe(
			catchError((error) => {
				if (error instanceof CommandError) {
					throw new BadRequestException(error.message);
				}
				throw error;
			}),
		);
	}
}
