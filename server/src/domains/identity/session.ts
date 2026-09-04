import { Entity, ID, ValueObject } from "@domain/common/abstractions"
import { Serializable } from "nucleus-mold"
import type { User, UserRole } from "./user"
import { DateTime } from "@domain/common/value-objects/date-time"
import type { Updatable } from "@shared/lib"
import { UnauthorizedError } from "@shared/error"


export const ErrSessionNotFound = new UnauthorizedError("SESSION_NOT_FOUND", "Сессия не найдена")
export const ErrRefreshTokenInvalid = new UnauthorizedError("INVAlID_REFRESH_TOKEN", "Refresh токен невалиден")
export const ErrTokenExpired = new UnauthorizedError("ACCESS_TOKEN_EXPIRED", "token expired")


export interface IRefreshTokenSigner {
    signRefresh(session: Session): Promise<string>
    verifyRefresh(token: string): Promise<{uid: ID<User>, sessionID: ID<Session>}>
}

export interface IAccessTokenSigner {
    signAccess(user: User): Promise<string>
    verifyAccess(token: string): Promise<{uid: ID<User>, roles: UserRole[]}>
}


@Serializable()
export class RefreshToken extends ValueObject<string> {
    static async generate(session: Session, signStrategy: IRefreshTokenSigner) {
        return new RefreshToken(await signStrategy.signRefresh(session))
    }

    async verify(signStrategy: IRefreshTokenSigner) {
        try {
            return await signStrategy.verifyRefresh(this._value)
        }
        catch {
            throw ErrRefreshTokenInvalid
        }
    }

    static from(string: string) {
        return new RefreshToken(string)
    }

    asString() {return this._value}
}


export class AccessToken extends ValueObject<string> {
    static async generate(user: User, signStrategy: IAccessTokenSigner) {
        return new AccessToken(await signStrategy.signAccess(user))
    }

    verify(signStrategy: IAccessTokenSigner) {
        try {
            return signStrategy.verifyAccess(this._value)
        }
        catch {
            throw ErrTokenExpired
        }
        
    }

    static from(string: string) {
        return new AccessToken(string)
    }
    
    asString() {return this._value}
}


@Serializable()
export class Session extends Entity {
    constructor(
        private _userID: ID<User>,
        private lastActivity: DateTime,
        private currentToken: RefreshToken | null
    ) {super()}
    
    static new(userID: ID<User>) {
        return new Session(
            userID,
            DateTime.now(),
            null,
        ) as Updatable<Session>
    }

    updateToken(newRefresh: RefreshToken) {
        this.currentToken = newRefresh
    }

    updateActivity() {
        this.lastActivity = DateTime.now()
    }

    get refreshToken() {return this.currentToken}
    get userID() {return this._userID}
}