import { UnauthorizedError } from "../../src/shared/error";

export const ErrSessionNotFound = new UnauthorizedError("Сессия не найдена")
export const ErrRefreshTokenInvalid = new UnauthorizedError("Refresh токен невалиден")
export const ErrTokenExpired = new UnauthorizedError("token expired")