import { DomainError } from "../../../shared/error";

export const 
ErrUsernameLength = new DomainError("USERNAME_LENGTH", "длина имени должна быть от 8 до 32 символов"),
ErrPasswordLength = new DomainError("PASSWORD_LENGTH", "Пароль должен быть длиннее 8 символов"),
ErrTelegramLinkInvalid = new DomainError("TELEGRAM_LINK_INVALID", "Невалидная ссылка на telegram"),
ErrUserNameExists = new DomainError("USER_NAME_EXISTS"),
ErrAuthorization = new DomainError("AUTH_FAILED")