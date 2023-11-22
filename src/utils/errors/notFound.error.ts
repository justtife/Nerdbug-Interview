import Custom from "./custom.error";
import { StatusCode } from "../enums";
export default class NotFound extends Custom {
    constructor(
        message: string,
        readonly name: string = "NotFoundError",
        readonly statusCode: number = StatusCode.NOT_FOUND,
        readonly errorCode: number = StatusCode.BADREQUEST_ERROR,
    ) {
        super(message, statusCode, errorCode);
        this.name = name;
    }
}
