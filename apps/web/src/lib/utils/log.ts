import { Logger } from "@taxi/utils/logger";
import { dev } from "$app/environment";

export const log = (name: string) => new Logger(name, dev);
