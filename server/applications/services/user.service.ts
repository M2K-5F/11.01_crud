import type { ITransactionManager } from "@applications/interfaces/itransaction-manager"
import type { PasswordHashStrategy } from "@domain/contexts/identity/abstractions"
import { User } from "@domain/contexts/identity/aggregates/user"
import { ErrAuthorization, ErrUserNameExists } from "@domain/contexts/identity/errors"
import { RawUserPassword } from "@domain/contexts/identity/value_objects/user-raw-password"
import { TelegramLink } from "@domain/contexts/identity/value_objects/user-telegram-link"
import { Username } from "@domain/contexts/identity/value_objects/user-username"
import { ErrNotFound, ErrUnauthorized } from "../../shared/error"

export type RegisterUserCMD = {
    name: string,
    telegram_link: string,
    password: string
}

export type AuthUserCMD = {
    name: string,
    password: string,
}


export class UserService {
    constructor(
        readonly txmanager: ITransactionManager,
        readonly HashStrategy: PasswordHashStrategy
    ) {}


    async register(cmd: RegisterUserCMD) {
        return await this.txmanager.begin(async uow => {
            if (await uow.users.checkNameExists(cmd.name)) throw ErrUserNameExists
            
            const user = User.register(
                Username.create(cmd.name),
                TelegramLink.create(cmd.telegram_link),
                await RawUserPassword.create(cmd.password).hash(this.HashStrategy)
            )

            await uow.users.save(user)

            return user.id
        })
    }

    async authorize(cmd: AuthUserCMD) {
        return await this.txmanager.begin(async uow => {
            const user = await uow.users.getByName(cmd.name)
            if (!user) throw ErrAuthorization
            console.log('pipisi');
            
            if (!await user.authenticate(cmd.password, this.HashStrategy)) throw ErrAuthorization

            return user.id
        })
    }
}