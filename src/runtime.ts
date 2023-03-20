let DEBUG = false;

export const setDebug = () => (DEBUG = true);
export const isDebug = () => DEBUG;
export const isDevelopment = () => process.env.NODE_ENV === "development";
