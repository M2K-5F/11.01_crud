import type { ITransactionManager, Mutable } from "@applications/interfaces/itransaction-manager"
import TelegramLink from "@domain/common/value-objects/telegram-link"
import User, { UserRawPassword, UserUsername, type PasswordHashStrategy } from "@domain/contexts/identity/user"
import { DomainError } from "@shared/error"

// #region Commands
export type RegisterUserCMD = {
    name: string,
    telegram_link: string,
    password: string
}

export type AuthUserCMD = {
    name: string,
    password: string,
}
// #endregion


// #region Errors
const ErrUserNameExists = new DomainError("USER_NAME_EXISTS")
const ErrAuthorization = new DomainError("AUTH_FAILED")
// #endregion


// #region Service
export class UserService {
    constructor(
        readonly txmanager: ITransactionManager,
        readonly HashStrategy: PasswordHashStrategy
    ) {}


    async register(cmd: RegisterUserCMD) {
        return await this.txmanager.begin(async uow => {
            if (await uow.users.checkNameExists(cmd.name)) throw ErrUserNameExists
            
            const user = User.register(
                UserUsername.create(cmd.name),
                TelegramLink.create(cmd.telegram_link),
                await UserRawPassword.create(cmd.password).hash(this.HashStrategy)
            ) as Mutable<User>

            await uow.users.save(user)

            return user.id
        })
    }

    async authorize(cmd: AuthUserCMD) {
        return await this.txmanager.begin(async uow => {
            const user = await uow.users.getByName(cmd.name)
            if (!user) throw ErrAuthorization
            
            if (!await user.authenticate(cmd.password, this.HashStrategy)) throw ErrAuthorization

            return [user.id, user.roles] as const
        })
    }
}
// #endregion