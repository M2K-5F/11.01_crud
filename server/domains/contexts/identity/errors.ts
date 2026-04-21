import { DomainError } from "../../../shared/error";


export const ErrUserNameExists = new DomainError("USER_NAME_EXISTS")
export const ErrAuthorization = new DomainError("AUTH_FAILED")