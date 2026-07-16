import type { ITransactionManager } from "@applications/interfaces/itransaction-manager";
import type { ID } from "@domain/common/abstractions";
import { AccessToken, ErrRefreshTokenInvalid, ErrSessionNotFound, RefreshToken, Session, type IAccessTokenSigner, type IRefreshTokenSigner } from "@domain/identity/session";
import { ErrAuthorizationFailed, User, UserRawPassword, UserUsername, type PasswordHashStrategy } from "@domain/identity/user";


type AuthorizeCMD = {
    username: string
    password: string
}

type RefreshTokensCMD = {
    refreshToken: string
}

type VerifyAccessTokenCMD = {
    accessToken: string
}


export class AuthService {
    constructor (
        private readonly txmanager: ITransactionManager,
        private readonly passwordHashStrategy: PasswordHashStrategy,
        private readonly tokenSigner: IRefreshTokenSigner & IAccessTokenSigner
    ) {}


    async authorize(cmd: AuthorizeCMD) {
        return this.txmanager.begin(async uow => {
            const user = await uow.users.getByName(UserUsername.from(cmd.username))
            if (!user) throw ErrAuthorizationFailed

            user.authenticate(UserRawPassword.from(cmd.password), this.passwordHashStrategy)

            const session = Session.new(user.id)

            const refreshToken = await RefreshToken.generate(session, this.tokenSigner)

            session.updateToken(refreshToken)

            await uow.sessions.save(session)

            const accessToken = await AccessToken.generate(user, this.tokenSigner)

            return {refreshToken, accessToken, uid: user.id}
        })  
    }


    async refreshTokens(cmd: RefreshTokensCMD) {
        const {uid, sessionID} = await RefreshToken.from(cmd.refreshToken).verify(this.tokenSigner)

        return this.txmanager.begin(async uow => {
            const session = await uow.sessions.getByIDForUpdate(sessionID)
            if (!session) throw ErrSessionNotFound

            if (!session.refreshToken?.equals(RefreshToken.from(cmd.refreshToken))) throw ErrRefreshTokenInvalid

            session.updateActivity()

            const refreshToken = await RefreshToken.generate(session, this.tokenSigner)

            session.updateToken(refreshToken)

            const user = await uow.users.getByID(uid)
            if (!user) throw ErrSessionNotFound

            const accessToken = await AccessToken.generate(user, this.tokenSigner)

            await uow.sessions.save(session)

            return {refreshToken, accessToken}
        })
    }


    verifyAccess(cmd: VerifyAccessTokenCMD) {
        const accessToken = AccessToken.from(cmd.accessToken)
        return accessToken.verify(this.tokenSigner)
    }
}