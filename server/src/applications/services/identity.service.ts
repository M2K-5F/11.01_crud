import type { ITransactionManager } from "@applications/interfaces/itransaction-manager"
import type { ID } from "@domain/common/abstractions"
import TelegramLink from "@domain/common/value-objects/telegram-link"
import { User, UserHashedPassword, UserRawPassword, UserUsername, type PasswordHashStrategy } from "@domain/identity/user"
import { DomainError, ErrNotFound } from "@shared/error"

export type RegisterUserCMD = {
    name: string,
    telegram_link: string,
    password: string
}

export type AuthUserCMD = {
    name: string,
    password: string,
}


export type GetRolesCMD = {
    uid: ID<User>
}

const ErrUserNameExists = new DomainError("USER_NAME_EXISTS")
const ErrAuthorization = new DomainError("AUTH_FAILED")


export class IdentityService {
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

            return {uid: user.id}
        })
    }

    async authorize(cmd: AuthUserCMD) {
        return await this.txmanager.begin(async uow => {
            const user = await uow.users.getByName(UserUsername.from(cmd.name))
            if (!user) throw ErrAuthorization
            
            if (!await user.authenticate(cmd.password, this.hashStrategy)) throw ErrAuthorization

            return {
                uid: user.id, 
                roles: user.roles
            }
        })
    }

    async getRoles(cmd: GetRolesCMD) {
        const user = await this.txmanager.begin(tx => tx.users.getByID(cmd.uid))
        if (!user) throw ErrNotFound

        return {roles: user.roles}
    }
}