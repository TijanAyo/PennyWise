export enum HttpCode {
    OK = 200,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    FORBIDDEN = 403,
    CONFLICTING_REQUEST = 409,
}

interface AppErrorArgs {
    name?: string;
    httpCode: HttpCode;
    description: string;
}

class NotFoundError extends Error {
    statusCode: number;

    constructor(args: AppErrorArgs) {
        super(args.description);
        this.name = "NotFoundError";
        this.statusCode = args.httpCode
    }
}

class BadRequestError extends Error {
    statusCode: number;

    constructor(args: AppErrorArgs) {
        super(args.description);
        this.name = "Bad Request";
        this.statusCode = HttpCode.BAD_REQUEST
    }
}

class ConflictingRequestError extends Error {
    statusCode: number;

    constructor(args: AppErrorArgs) {
        super(args.description);
        this.name = "Conflicting Request";
        this.statusCode = HttpCode.CONFLICTING_REQUEST
    }
}
  
class InternalServerError extends Error {
    statusCode: number;

    constructor(args: AppErrorArgs) {
        super(args.description);
        this.name = "Internal Server Error";
        this.statusCode = HttpCode.INTERNAL_SERVER_ERROR
    }
}
class AuthenticationError extends Error {
    statusCode: number;

    constructor(args: AppErrorArgs) {
        super(args.description);
        this.name = "Authentication Error";
        this.statusCode = HttpCode.UNAUTHORIZED;
    }
}
class ForbiddenError extends Error {
    statusCode: number;

    constructor(args: AppErrorArgs) {
        super(args.description);
        this.name = "Forbidden Error";
        this.statusCode = HttpCode.FORBIDDEN;
    }
}

export { NotFoundError, BadRequestError, InternalServerError, AuthenticationError, ForbiddenError, ConflictingRequestError};