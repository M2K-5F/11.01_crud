import { DeviceID, Session, SessionID } from "../entities";
import { sql, type Pool } from "@m2k-5f/pgtx";
import type { SessionRow } from "./shema";
import { UserID } from "@domain/contexts/identity/user";

export class TokenStorage {
    mapper = TokenMapper

    constructor(
        private pool: Pool,
    ) {}

    async saveSession(session: Session) {
        const row = this.mapper.toRow(session)
        await this.pool.query`
        insert into sessions ${sql.insert(row)}
        on conflict (id) do update set 
        ${sql.excluded(["user_id", 'device', 'current_token', 'last_activity'])};`
        }

    async getByID(id: SessionID) {
        const [row] = await this.pool.query<SessionRow>`
        select * from sessions 
        where id = ${id.id} 
        limit 1;`
        if (!row) return null

        return this.mapper.fromRow(row)
    }
}


class TokenMapper {
    static fromRow(r: SessionRow): Session {
        return new Session(
            SessionID.fromString(r.id),
            UserID.fromString(r.user_id),
            {
                device_id: DeviceID.fromString(r.device.device_id),
                ip: r.device.ip,
                os: r.device.os,
                browser: r.device.browser,
                ua: r.device.ua,
            },
            r.last_activity,
            r.current_token
        )
    }

    static toRow(s: Session): SessionRow {
        return {
            id: s.id.id,
            user_id: s.userId.id,
            device: {
                os: s.device.os,
                device_id: s.device.device_id.id,
                ip: s.device.ip,
                browser: s.device.browser,
                ua: s.device.ua
            },
            last_activity: s.lastActivity,
            current_token: s.currentToken
        }
    }
}