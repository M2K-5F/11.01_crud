import type { ITransactionManager } from "@applications/interfaces/itransaction-manager"
import { ID } from "@domain/common/abstractions"
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
    uid: string
}

const ErrUserNameExists = new DomainError("USER_NAME_EXISTS", "USER_NAME_EXISTS")


export class IdentityService {
    constructor(
        readonly txmanager: ITransactionManager,
        readonly hashStrategy: PasswordHashStrategy
    ) {}


    register(cmd: RegisterUserCMD) {
        return this.txmanager.begin(async uow => {
            if (await uow.users.checkNameExists(UserUsername.from(cmd.name))) 
                throw ErrUserNameExists
            
            const user = User.register(
                UserUsername.from(cmd.name),
                TelegramLink.from(cmd.telegramLink),
                UserHashedPassword.from(
                    await UserRawPassword.from(cmd.password)
                        .hash(this.hashStrategy)
                )
            )

            await uow.users.save(user)

            return {
                uid: user.id.asString()
            }
        })
    }


    addRole(cmd: AddRoleCMD) {
        return this.txmanager.begin(async uow => {
            const user = await uow.users.getByIDForUpdate(
                ID.from(cmd.uid)
            )

            if (!user) throw ErrNotFound

            user.addRole(
                cmd.roleName === 'student' 
                    ?   UserRole.Student
                    :   UserRole.Teacher
            )

            await uow.users.save(user)

            return {
                uid: user.id.asString()
            }
        })
    }
}