export abstract class AppError extends Error {
    abstract status: number
    constructor(
        readonly code: string,
        message: string,
    ) {
        super(message)
        this.name = this.constructor.name
    }
}

export class DomainError extends AppError {
    status = 400
}

export class NotFoundError extends AppError {
    status = 404

}

export const ErrNotFound = new NotFoundError("NOT_FOUND", "Resourse not found")

export class UnauthorizedError extends AppError {
    status = 401
}

export const ErrUnauthorized = new UnauthorizedError("ERR_UNAUTHORIZED", "Unauthorized")

export class ForbiddenError extends AppError {
    status = 403
}

export const ErrForbidden = new ForbiddenError("ERR_FORBIDDEN", "forbidden")
