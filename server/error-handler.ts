import { DomainError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "./shared/error";
import type Elysia from "elysia";

export const errorHandle = (app: Elysia) => app.onError(({error, set}) => {
    if (error instanceof DomainError) {
        set.status = 400

        return {code: error.code, message: error.detail}
    }

    if (error instanceof NotFoundError) {
        set.status = 404

        return {code: "NOT_FOUND", message: 'Resourse not found'}
    }
    
    if (error instanceof UnauthorizedError) {
        set.status = 401

        return {code: "ERR_UNAUTHORIZED", message: 'unauthorized'}
    }

    if (error instanceof ForbiddenError) {
        set.status = 403

        return {code: "ERR_FORBIDDEN", message: "forbidden"}
    }

    if (error instanceof ValidationError) {
        set.status = 422

        return {code: "ERR_VALIDATION", message: error.message}
    }

    set.status = 500
    
    console.log(error)
    
    return {code: "INTERNAL", message: "internal error"}
})