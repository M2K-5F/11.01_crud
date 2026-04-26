import { importPKCS8, importSPKI, jwtVerify, SignJWT } from "jose"
import { SessionID } from "../entities"
import hydrate from "@persistense/commands/common/hydrator"
import { UserID, UserRole, type UserRoleValue } from "@domain/contexts/identity/user"

export class TokenSigner {
    private constructor(
        private access_pub: CryptoKey,
        private access_pri: CryptoKey,
        private refresh_pub: CryptoKey,
        private refresh_pri: CryptoKey,
    ) {}

    static async newWithKeys() {
        const [aPub, aPri, rPub, rPri] = await Promise.all([
            Bun.file(Bun.env.ACCESS_PUB).text(),
            Bun.file(Bun.env.ACCESS_PRIVATE).text(),
            Bun.file(Bun.env.REFRESH_PUB).text(),
            Bun.file(Bun.env.REFRESH_PRIVATE).text()
        ])

        return new this(
            await importSPKI(aPub, 'ES256'),
            await importPKCS8(aPri, 'ES256'),
            await importSPKI(rPub, 'ES256'),
            await importPKCS8(rPri, 'ES256')
        )
    }

    async signAccess(user_id: UserID, roles: UserRole[]) {
        const token = await new SignJWT({roles: roles.map(r => r['_value'])})
        .setProtectedHeader({ alg: 'ES256' })
        .setSubject(user_id.id)
        .setExpirationTime(Bun.env.ACCESS_TTL)
        .setIssuedAt()
        .sign(this.access_pri)

        return token
    }

    async signRefresh(user_id: UserID, session_id: SessionID) {
        const token = await new SignJWT({session_id: session_id.id})
        .setProtectedHeader({ alg: 'ES256' })
        .setIssuedAt()
        .setExpirationTime(Bun.env.SESSION_TTL)
        .setSubject(user_id.id)
        .sign(this.refresh_pri)

        return token
    }

    async verifyAccess(access: string) {
        const {sub, roles} = (await jwtVerify(access, this.access_pub)).payload as {sub: string, roles: UserRoleValue[]}
    
        return {user_id: UserID.fromString(sub), roles: roles.map(r => hydrate(UserRole, r))}
    }

    async verifyRefresh(refresh: string) {
        const {sub, session_id} = (await jwtVerify(refresh, this.refresh_pub)).payload as {sub: string, session_id: string}
        return {user_id: UserID.fromString(sub), session_id: SessionID.fromString(session_id)}
    }
}