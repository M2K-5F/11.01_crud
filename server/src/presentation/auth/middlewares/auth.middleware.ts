import type { SessionService } from "../service/token.service";
import { ErrForbidden, ErrUnauthorized } from "../../../src/shared/error";
import Elysia from "elysia";
import { dependencies } from "@index/injection";
import type { UserRole } from "@domain/identity/user";

export function authFilter(...rolesRequired: UserRole[]) { 
    return (app: Elysia) => app
        .use(dependencies)
        .derive(async ({sessionService, headers}) => {
            const authHeader = headers['authorization']
            const token = authHeader?.startsWith('Bearer ') 
                ? authHeader.slice(7) 
                : undefined
            
            if (!token) throw ErrUnauthorized

            const {roles, uid} = await sessionService.verifyAccess(token)

            if (rolesRequired.length === 0) {
                return {currentUser: {uid, roles}}
            }

            if (roles.some(p => rolesRequired.some(pr => pr.equals(p)))) {
                return {currentUser: {uid, roles}}
            }

            throw ErrForbidden
        })
        .guard({detail: {security: [{BearerAuth: []}]}})
}