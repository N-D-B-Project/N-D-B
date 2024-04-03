import { AxiosResolveError } from "@/common/errors/Axios.error";
import { Logger } from "@nestjs/common";
import { AxiosError } from "axios";
import { Observable, catchError, firstValueFrom } from "rxjs";

export async function resolveAxiosObservable<T>(source: Observable<T>): Promise<T> {
	const logger = new Logger("ResolveAxiosObservable");
	return (await firstValueFrom(
		source.pipe(
			catchError((error: AxiosError) => {
				logger.error(error.response.data);
				throw new AxiosResolveError("An error happened!");
			}),
		),
	)) as T;
}
