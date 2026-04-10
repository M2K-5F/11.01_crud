import type { PasswordHashStrategy } from "@domain/contexts/identity/abstractions";

export class BCryptHashStrategy implements PasswordHashStrategy {
    async hash(raw: string) {
        return await Bun.password.hash(raw) 
    }

    async compare(raw: string, hash: string) {
        return await Bun.password.verify(raw, hash)
    }
}