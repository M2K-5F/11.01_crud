import { importPKCS8, importSPKI, jwtVerify, SignJWT } from "jose"
import { UserRole, type User, type UserRoleType } from "@domain/identity/user"
import { ID } from "@domain/common/abstractions"
import type { IAccessTokenSigner, IRefreshTokenSigner, Session } from "@domain/identity/session"
import { readFileSync } from 'fs'
import crypto from 'crypto'

type ITokenSigner = IAccessTokenSigner & IRefreshTokenSigner 

export class TokenSigner implements ITokenSigner {
    constructor(
        private accessPub: crypto.KeyObject,
        private accessPri: crypto.KeyObject,
        private refreshPub: crypto.KeyObject,
        private refreshPri: crypto.KeyObject,
    ) {}

    async signAccess(user: User) {
        const token = await new SignJWT({roles: user.roles.map(r => r.asString())})
        .setProtectedHeader({ alg: 'ES256' })
        .setSubject(user.id.asString())
        .setExpirationTime(Bun.env.ACCESS_TTL)
        .setIssuedAt()
        .sign(this.accessPri)

        return token
    }

    async signRefresh(session: Session) {
        const token = await new SignJWT({sessionID: session.id.asString()})
        .setProtectedHeader({ alg: 'ES256' })
        .setIssuedAt()
        .setExpirationTime(Bun.env.SESSION_TTL)
        .setSubject(session.userID.asString())
        .sign(this.refreshPri)

        return token
    }

    async verifyAccess(access: string) {
        const {sub, roles} = (await jwtVerify(access, this.accessPub)).payload as {sub: string, roles: UserRoleType[]}
    
        return {uid: ID.from<User>(sub), roles: roles.map(r => r === 'Student' ? UserRole.Student : UserRole.Teacher)}
    }

    async verifyRefresh(refresh: string) {
        const {sub, sessionID} = (await jwtVerify(refresh, this.refreshPub)).payload as {sub: string, sessionID: string}
        return {uid: ID.from<User>(sub), sessionID: ID.from<Session>(sessionID)}
    }
}