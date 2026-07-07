import { importPKCS8, importSPKI, jwtVerify, SignJWT } from "jose"
import { UserRole, type User, type UserRoleType } from "@domain/identity/user"
import { ID } from "@domain/common/abstractions"
import type { Session } from "../entities"

export class TokenSigner {
    private constructor(
        private accessPub: CryptoKey,
        private accessPri: CryptoKey,
        private refreshPub: CryptoKey,
        private refreshPri: CryptoKey,
    ) {}

    static async newWithKeys() {
        const [aPub, aPri, rPub, rPri] = await Promise.all([
            Bun.file(Bun.env.ACCESS_PUB).text(),
            Bun.file(Bun.env.ACCESS_PRIVATE).text(),
            Bun.file(Bun.env.REFRESH_PUB).text(),
            Bun.file(Bun.env.REFRESH_PRIVATE).text()
        ])

        return new TokenSigner(
            await importSPKI(aPub, 'ES256'),
            await importPKCS8(aPri, 'ES256'),
            await importSPKI(rPub, 'ES256'),
            await importPKCS8(rPri, 'ES256')
        )
    }

    async signAccess(userID: ID<User>, roles: UserRole[]) {
        const token = await new SignJWT({roles: roles.map(r => r.asString())})
        .setProtectedHeader({ alg: 'ES256' })
        .setSubject(userID.asString())
        .setExpirationTime(Bun.env.ACCESS_TTL)
        .setIssuedAt()
        .sign(this.accessPri)

        return token
    }

    async signRefresh(userID: ID<User>, sessionID: ID<Session>) {
        const token = await new SignJWT({sessionID: sessionID.asString()})
        .setProtectedHeader({ alg: 'ES256' })
        .setIssuedAt()
        .setExpirationTime(Bun.env.SESSION_TTL)
        .setSubject(userID.asString())
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