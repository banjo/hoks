import { Handler } from "../types";

export const installOnLockChange: Handler = (args: string[]) => {
    console.log(args);
};
