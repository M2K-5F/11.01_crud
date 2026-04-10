declare module "bun" {
    interface Env {
        ACCESS_PRIVATE: string,
        ACCESS_PUB: string,
        REFRESH_PUB: string,
        REFRESH_PRIVATE: string,
        ACCESS_TTL: string,
        SESSION_TTL: string
    }
}
