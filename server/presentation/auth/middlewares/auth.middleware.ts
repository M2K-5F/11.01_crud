import type { SessionService } from "../service/token.service";
import { ErrForbidden, ErrUnauthorized } from "../../../shared/error";
import Elysia from "elysia";
import { dependencies } from "@index/injection";
import type { UserRole } from "@domain/contexts/identity/user";

export function authFilter(...rolesRequired: UserRole[]) { 
    return (app: Elysia) => app
        .use(dependencies)
        .derive(async ({sessionService, headers}: {headers: Record<string, string | undefined>, sessionService: SessionService}) => {
            const authHeader = headers['authorization']
            const token = authHeader?.startsWith('Bearer ') 
                ? authHeader.slice(7) 
                : undefined
            
            if (!token) throw ErrUnauthorized

            const {roles, user_id} = await sessionService.verifyAccess(token)

            if (rolesRequired.length === 0) {
                return {currentUser: {id: user_id, roles}}
            }

            if (roles.some(p => rolesRequired.some(pr => pr.equal(p)))) {
                return {currentUser: {id: user_id, roles}}
            }

            throw ErrForbidden
        })
        .guard({detail: {security: [{BearerAuth: []}]}})
}