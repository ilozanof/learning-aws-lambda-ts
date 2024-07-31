import { JsonError } from "./Validator";

export function parseJSON(arg: string) {
    try {
        return JSON.parse(arg);
    } catch (error) {
        throw new JsonError(error.message);
    }
}