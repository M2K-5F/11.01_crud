import type { TokenStorage } from "../store/token.storage";
import { TokenSigner } from "./token.signer";
import { ErrRefreshTokenInvalid, ErrSessionNotFound, ErrTokenExpired } from "../errors";
import { Session, type Device } from "../entities";
import type { ID } from "@domain/common/abstractions";
import type { User, UserRole } from "@domain/identity/user";


export class SessionService {
    constructor(
        private storage: TokenStorage,
        private signer: TokenSigner,
    ) {}

    async newSession(userID: ID<User>, device: Device, roles: UserRole[]) {
        const session = Session.new(userID, device)

        const refresh = await this.signer.signRefresh(
            userID, session.id
        )

        session.updateToken(refresh)

        const access = await this.signer.signAccess(
            userID, roles
        )

        await this.storage.save(session)

        return {refresh, access}
    }

    async verifyRefresh(refresh: string) {
        const {sessionID} = await this.signer.verifyRefresh(refresh)
                .catch(() => {throw ErrRefreshTokenInvalid})

        const session = await this.storage.getByID(sessionID)
        if (!session) throw ErrSessionNotFound

        if (session.currentToken !== refresh) throw ErrRefreshTokenInvalid

        return session
    }

    async refreshTokensForSession(session: Session, roles: UserRole[]) {
        session.updateActivity()

        const refresh = await this.signer.signRefresh(
            session.userId, session.id
        )

        session.updateToken(refresh)

        const access = await this.signer.signAccess(
            session.userId, roles
        )

        await this.storage.save(session)

        return {access, refresh}
    }

    async verifyAccess(access: string) {
        try {
            return await this.signer.verifyAccess(access)
        } catch {
            throw ErrTokenExpired
        }
    }
}