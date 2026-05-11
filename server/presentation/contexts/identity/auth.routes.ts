import Elysia, { t } from "elysia";
import deviceIdentity from "../../auth/middlewares/device.identity.middleware";
import { AppError, ErrUnauthorized } from "../../../shared/error";
import { dependencies } from "@index/injection";
import { authFilter } from "@presentation/auth/middlewares/auth.middleware";

export const authRoutes = new Elysia()
.use(dependencies)
.use(deviceIdentity)


.post("/login", 
    async ({
        body, 
        cookie: { refresh_token }, 
        sessionService, 
        userService,
        device,
    }) => {
        const [userId, roles] = await userService.authorize(body)

        const {refresh, access} = await sessionService.newSession(
            userId, device, roles
        )

        refresh_token!.set({
            value: refresh,
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 30 * 24 * 3600,
            path: '/'
        })

        return {access, id: userId.id}
    }, {
        body: t.Object({
            name: t.String(),
            password: t.String()
        }),
    }
)


.post('/refresh',
    async ({
        sessionService,
        cookie: { refresh_token },
        readService
    }) => {
        if (!refresh_token.value) throw ErrUnauthorized

        const session = await sessionService.verifyRefresh(refresh_token.value)

        const roles = await readService.user.getRolesByID(session.userId)

        const {access, refresh} = await sessionService.refreshTokensForSession(
            session, roles
        )

        refresh_token.set({
            value: refresh,
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 30 * 24*3600,
            path: '/'
        })

        return {access}
    }, {
        cookie: t.Object({
            refresh_token: t.Optional(t.String())
        })
    }
)


.post('/logout', 
    async ({
        cookie: { refresh_token }
    }) => {
        if (!refresh_token.value) throw ErrUnauthorized

        refresh_token.remove()

        return {message: "Successful logout"}
    }, {
        cookie: t.Object({
            refresh_token: t.Optional(t.String())
        }),
    }
)

.group('', app => app
    .use(authFilter())
    .get("/me", 
        async ({
            currentUser: {id},
            readService
        }) => {
            return await readService.user.firstBy({id: id.id}) 
        },
    )
)