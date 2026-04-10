import type { TokenStorage } from "../store/token.storage";
import { UserID } from "@domain/contexts/identity/value_objects/user-id";
import { TokenSigner } from "./token.signer";
import { ErrRefreshTokenInvalid, ErrSessionNotFound, ErrTokenExpired } from "../errors";
import { Session, type Device } from "../entities";


export class SessionService {
    constructor(
        private storage: TokenStorage,
        private signer: TokenSigner,
    ) {}

    async newSession(user_id: UserID, device: Device, permissions: string[]) {
        const session = Session.new(user_id, device)

        const refresh = await this.signer.signRefresh(
            user_id, session.id
        )

        session.updateToken(refresh)

        const access = await this.signer.signAccess(
            user_id, permissions
        )

        await this.storage.saveSession(session)

        return {refresh, access}
    }

    async refreshTokens(old_refresh: string, permissions: string[]) {
        let pl
        try {
            pl = await this.signer.verifyRefresh(old_refresh)
        } catch {
            throw ErrRefreshTokenInvalid
        }

        const {session_id, user_id} = pl

        const session = await this.storage.getByID(session_id)
        if (!session) throw ErrSessionNotFound

        if (session.currentToken !== old_refresh) throw ErrRefreshTokenInvalid

        session.updateActivity()

        const refresh = await this.signer.signRefresh(
            user_id, session_id
        )

        session.updateToken(refresh)

        const access = await this.signer.signAccess(
            user_id, permissions
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