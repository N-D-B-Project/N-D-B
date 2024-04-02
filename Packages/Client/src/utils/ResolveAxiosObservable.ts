import { AxiosResolveError } from "@/common/errors/Axios.error";
import { Logger } from "@nestjs/common";
import { AxiosError } from "axios";
import { Observable, catchError, firstValueFrom } from "rxjs";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function resolveAxiosObservable<T>(source: Observable<any>): T {
	const logger = new Logger("ResolveAxiosObservable");
	return firstValueFrom<T>(
		source.pipe(
			catchError((error: AxiosError) => {
				logger.error(error.response.data);
				throw new AxiosResolveError("An error happened!");
			}),
		),
	) as T;
}
