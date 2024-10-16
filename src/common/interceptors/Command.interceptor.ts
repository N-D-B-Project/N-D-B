import {
	BadRequestException,
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import { type Observable, catchError } from "rxjs";
import { CommandError } from "../errors/Command.error";

@Injectable()
export class CommandInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler<unknown>,
	): Observable<unknown> | Promise<Observable<unknown>> {
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
