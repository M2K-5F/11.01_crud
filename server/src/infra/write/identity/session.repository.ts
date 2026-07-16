import type { Session } from "@domain/identity/session";
import { AbstractRepository } from "../common/abstract_repository";
import type { ISessionRepository } from "@applications/interfaces/itransaction-manager";

export class SessionRepository extends AbstractRepository<Session> implements ISessionRepository {
    protected override tablename: string = 'sessions'
}