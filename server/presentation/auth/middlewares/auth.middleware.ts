import type { SessionService } from "../service/token.service";
import { ErrForbidden, ErrUnauthorized } from "../../../shared/error";
import Elysia from "elysia";
import { dependencies } from "@index/injection";

export function authFilter(...permissionsRequired: string[]) { 
    return (app: Elysia) => app
        .use(dependencies)
        .derive(async ({sessionService, headers}: {headers: Record<string, string | undefined>, sessionService: SessionService}) => {
            const authHeader = headers['authorization']
            const token = authHeader?.startsWith('Bearer ') 
                ? authHeader.slice(7) 
                : undefined
            
            if (!token) throw ErrUnauthorized

            const {permissions, user_id} = await sessionService.verifyAccess(token)

            if (permissionsRequired.length === 0) {
                return {currentUser: {id: user_id, permissions}}
            }

            if (permissions.some(p => permissionsRequired.includes(p))) {
                return {currentUser: {id: user_id, permissions}}
            }

            throw ErrForbidden
        })
        .guard({detail: {security: [{BearerAuth: []}]}})
}