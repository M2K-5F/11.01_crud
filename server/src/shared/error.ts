export abstract class AppError extends Error {
    constructor(
        override message: string
    ) {
        super(message)
        this.name = this.constructor.name
    }
}

export class DomainError extends AppError {
    constructor(
        readonly code: string,
        readonly detail: string = "исключение домена"
    ) {
        super(detail)
    }
}

export class NotFoundError extends AppError {}

export const ErrNotFound = new NotFoundError("resourse not found")

export class ValidationError extends AppError {}

export class UnauthorizedError extends AppError {}

export const ErrUnauthorized = new UnauthorizedError("Не авторизован")

export class ForbiddenError extends AppError {}

export const ErrForbidden = new ForbiddenError("Доступ запрещен")