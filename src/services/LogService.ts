import pc from "picocolors";
import { isDebug } from "../runtime";

const error = (message: string) => console.log(pc.red(message));
const warning = (message: string) => console.log(pc.yellow(message));
const info = (message: string) => console.log(pc.blue(message));
const success = (message: string) => console.log(pc.green(message));

const debug = (message: string) => {
    if (isDebug()) info(`🔍 ${message}`);
};

export const LogService = {
    error,
    warning,
    info,
    success,
    debug,
};
