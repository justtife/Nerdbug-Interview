import { NextFunction, Response, Request } from "express";
import { ResponseHandler, Error, ResponseInterface, StatusCode } from "../utils";
const errorHandler = (
  err: Error.Custom,
  req: Request,
  res: Response,
  next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  const customError: Omit<ResponseInterface, "status"> = {
    message: err.message,
    statusCode: err.statusCode,
    code: err.errorCode,
  };
  //Different cases of errors
  switch (true) {
    case err.name === ("SyntaxError" || "TypeError"):
      // throw new Error.BadRequest(err.message);
      customError.message = err.name;
      customError.data = err.message;
      customError.code = StatusCode.BADREQUEST_ERROR;
      customError.statusCode = StatusCode.BAD_REQUEST;
      break;
    default:
      // throw new Error.Server(err.name || "An error occured, please try again later");
      customError.message =
        err.name || "An error occured, please try again later";
      customError.statusCode =
        err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
      customError.data = err.message;
      customError.code = err.errorCode;
      break;
  }
  ResponseHandler.error(res, {
    message: customError.message,
    data: customError.data,
    code: customError.code,
    statusCode: customError.statusCode,
  });
};
export default errorHandler;
