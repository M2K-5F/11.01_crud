import type { ITransactionManager } from "@applications/interfaces/itransaction-manager"
import TelegramLink from "@domain/common/value-objects/telegram-link"
import { User, UserHashedPassword, UserRawPassword, UserUsername, type PasswordHashStrategy } from "@domain/identity/user"
import { DomainError } from "@shared/error"

export type RegisterUserCMD = {
    name: string,
    telegram_link: string,
    password: string
}

export type AuthUserCMD = {
    name: string,
    password: string,
}


const ErrUserNameExists = new DomainError("USER_NAME_EXISTS")
const ErrAuthorization = new DomainError("AUTH_FAILED")


export class UserService {
    constructor(
        readonly txmanager: ITransactionManager,
        readonly hashStrategy: PasswordHashStrategy
    ) {}


    async register(cmd: RegisterUserCMD) {
        return await this.txmanager.begin(async uow => {
            const rawPassword = UserRawPassword.from(cmd.password)

            if (await uow.users.checkNameExists(UserUsername.from(cmd.name))) throw ErrUserNameExists
            
            const user = User.register(
                UserUsername.from(cmd.name),
                TelegramLink.from(cmd.telegram_link),
                UserHashedPassword.from(await rawPassword.hash(this.hashStrategy))
            )

            await uow.users.save(user)

            return user.id
        })
    }

    async authorize(cmd: AuthUserCMD) {
        return await this.txmanager.begin(async uow => {
            const user = await uow.users.getByName(UserUsername.from(cmd.name))
            if (!user) throw ErrAuthorization
            
            if (!await user.authenticate(cmd.password, this.hashStrategy)) throw ErrAuthorization

            return [user.id, user.roles] as const
        })
    }
}