import Elysia, { t } from "elysia";
import { ErrUnauthorized } from "@shared/error";
import { authService } from "@composition";

export const authRoutes = new Elysia()


.post("/auth/login", 
    async ({
        body, 
        cookie: { refresh }
    }) => {
        const {refreshToken, accessToken, uid} = await authService.authorize(body)

        refresh?.set({
            value: refreshToken,
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 30 * 24 * 3600,
            path: '/'
        })

        return {
            accessToken, uid
        }
    }, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        }),
    }
)


.post('/auth/refresh',
    async ({
        cookie: { refresh }
    }) => {
        if (!refresh.value) throw ErrUnauthorized

        const {refreshToken, accessToken} = await authService.refreshTokens({refreshToken: refresh.value})

        refresh.set({
            value: refreshToken,
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 30 * 24*3600,
            path: '/'
        })

        return {
            accessToken
        }
    }, {
        cookie: t.Object({
            refresh: t.Optional(t.String())
        })
    }
)


.post('/auth/logout', 
    async ({
        cookie: { refresh }
    }) => {
        if (!refresh.value) throw ErrUnauthorized

        refresh.remove()

        return {
            message: "Successful logout"
        }
    }, {
        cookie: t.Object({
            refresh: t.Optional(t.String())
        }),
    }
)
