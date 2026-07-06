import { Entity, ID } from "@domain/common/abstractions"
import type { User } from "@domain/identity/user"
import { Serializable } from "nucleus-mold"

@Serializable()
export class Session extends Entity {
    constructor(
        readonly userId: ID<User>,
        readonly device: Device,
        public lastActivity: Date,
        public currentToken: string
    ) {super()}

    updateToken(newRefresh: string) {
        this.currentToken = newRefresh
    }

    updateActivity() {
        this.lastActivity = new Date()
    }

    static new(user_id: ID<User>, device: Device) {
        return new this(
            user_id,
            device,
            new Date(),
            "token",
        )
    }
}

@Serializable()
export class Device extends Entity {
    constructor (
        public ip: string,
        public os: string,
        public browser: string,
        public ua: string
    ) {super()}
}

export const mockDevice: Device = new Device(
    "192.168.1.42", 
    "macOS 14.2", 
    "Chrome 122", 
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36..."
)