import { ID } from "@domain/common/abstractions/abstract-identificator"
import type { UserID } from "@domain/contexts/identity/user"

export class SessionID extends ID<Session> {}


export class Session {
    constructor(
        readonly id: SessionID,
        readonly userId: UserID,
        readonly device: Device,
        public lastActivity: Date,
        public currentToken: string
    ) {}

    updateToken(newRefresh: string) {
        this.currentToken = newRefresh
    }

    updateActivity() {
        this.lastActivity = new Date()
    }

    static new(user_id: UserID, device: Device) {
        return new this(
            SessionID.generate(),
            user_id,
            device,
            new Date(),
            "token",
        )
    }
}

export class DeviceID extends ID<Device> {}

export type Device = {
    device_id: DeviceID,
    ip: string,
    os: string,
    browser: string,
    ua: string
}

export const mockDevice: Device = {
    device_id: DeviceID.generate(),
    ip: "192.168.1.42",
    os: "macOS 14.2",
    browser: "Chrome 122",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36..."
};