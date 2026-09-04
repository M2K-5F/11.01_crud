import { ErrForbidden, ErrUnauthorized } from "@shared/error";
import Elysia from "elysia";
import type { UserRole } from "@domain/identity/user";
import { authService } from "@composition";

export function authFilter(...rolesRequired: UserRole[]) { 
    return (app: Elysia) => app
        .derive(async ({ headers }) => {
            const authHeader = headers['authorization']
            const token = authHeader?.startsWith('Bearer ') 
                ? authHeader.slice(7) 
                : undefined
            
            if (!token) throw ErrUnauthorized

            const { roles, uid } = await authService.verifyAccess({accessToken: token})

            if (rolesRequired.length === 0) {
                return {currentUser: {uid, roles}}
            }

            if (roles.some(p => rolesRequired.some(pr => pr.asString() === p))) {
                return {currentUser: {uid, roles}}
            }            

            throw ErrForbidden
        })
        .guard({detail: {security: [{BearerAuth: []}]}})
}