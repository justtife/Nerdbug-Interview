import Custom from "./custom.error";
import { StatusCode } from "../enums";
export default class Duplicate extends Custom {
    constructor(
        message: string,
        readonly name: string = "DuplicateError",
        readonly statusCode: number = StatusCode.CONFLICT,
        readonly errorCode: number = StatusCode.DUPLICATE_ERROR,
    ) {
        super(message, statusCode, errorCode);
        this.name = name;
    }
}
