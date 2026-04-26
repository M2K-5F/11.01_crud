import type { TokenStorage } from "../store/token.storage";
import { TokenSigner } from "./token.signer";
import { ErrRefreshTokenInvalid, ErrSessionNotFound, ErrTokenExpired } from "../errors";
import { Session, type Device } from "../entities";
import type { UserID, UserRole } from "@domain/contexts/identity/user";


export class SessionService {
    constructor(
        private storage: TokenStorage,
        private signer: TokenSigner,
    ) {}

    async newSession(user_id: UserID, device: Device, roles: UserRole[]) {
        const session = Session.new(user_id, device)

        const refresh = await this.signer.signRefresh(
            user_id, session.id
        )

        session.updateToken(refresh)

        const access = await this.signer.signAccess(
            user_id, roles
        )

        await this.storage.saveSession(session)

        return {refresh, access}
    }

    async verifyRefresh(refresh: string) {
        let pl
        try {
            pl = await this.signer.verifyRefresh(refresh)
        } catch {
            throw ErrRefreshTokenInvalid
        }

        const {session_id} = pl

        const session = await this.storage.getByID(session_id)
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

        await this.storage.saveSession(session)

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