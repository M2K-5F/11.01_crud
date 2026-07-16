import type { ITransactionManager } from "@applications/interfaces/itransaction-manager"
import type { ID } from "@domain/common/abstractions"
import TelegramLink from "@domain/common/value-objects/telegram-link"
import { User, UserHashedPassword, UserRawPassword, UserRole, UserUsername, type PasswordHashStrategy } from "@domain/identity/user"
import { DomainError, ErrNotFound } from "@shared/error"

export type RegisterUserCMD = {
    name: string,
    telegramLink: string,
    password: string
}

export type AddRoleCMD = {
    roleName: "teacher" | "student",
    uid: ID<User>
}

const ErrUserNameExists = new DomainError("USER_NAME_EXISTS")


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
                TelegramLink.from(cmd.telegramLink),
                UserHashedPassword.from(await rawPassword.hash(this.hashStrategy))
            )

            await uow.users.save(user)

            return {uid: user.id}
        })
    }


    async addRole(cmd: AddRoleCMD) {
        return this.txmanager.begin(async uow => {
            const user = await uow.users.getByIDForUpdate(cmd.uid)
            if (!user) throw ErrNotFound

            user.addRole(
                cmd.roleName === 'student' 
                    ?   UserRole.Student
                    :   UserRole.Teacher
            )

            await uow.users.save(user)

            return {
                uid: user.id
            }
        })
    }
}