import type { AsyncLocalStorage } from "node:async_hooks";
import type { AlsStore } from "../types";

export interface IAsyncLocalStorage extends AsyncLocalStorage<AlsStore> {}
