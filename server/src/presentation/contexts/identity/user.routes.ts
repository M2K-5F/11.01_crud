import { ID } from "@domain/common/abstractions";
import { dependencies } from "@index/../injection";
import { authFilter } from "@presentation/common/auth.middleware";
import { ErrNotFound } from "@shared/error";
import { Obj, Str } from "@shared/typebox";
import Elysia, { t } from "elysia";

export const userRoutes = new Elysia()
.use(
    new Elysia()
    .use(dependencies)


    .post("/users", 
        async ({
            body,
            identityService,
            readService
        }) => {
            const {uid} = await identityService.register(body)

            return await readService.user.firstBy({id: uid.asString()})
        }, {
            body: Obj({
                name: Str,
                telegramLink: t.String(),
                password: t.String()
            }),
        }
    )
)
.use(
    new Elysia()
    .use(dependencies)
    .use(authFilter())
    

    .post("/users/:userPlainID/addrole",
        async ({
            identityService,
            body: {roleName},
            params: {userPlainID},
            readService
        }) => {
            const {uid} = await identityService.addRole({
                roleName,
                uid: ID.from(userPlainID)
            })

            return await readService.user.firstBy({id: uid.asString()})
        }, {
            body: Obj({
                roleName: t.Union([t.Literal('student'), t.Literal('teacher')] as const),
            })
        }
    )

    .get("/users/:userPlainID", 
        async ({
            params: {userPlainID},
            readService
        }) => {
            const user = await readService.user.firstBy({id: userPlainID})
            if (!user) throw ErrNotFound

            return user
        }
    )


    .get("/users/me",
        async ({
            currentUser: {uid},
            readService
        }) => {
            const user = await readService.user.firstBy({id: uid.asString()})
            if (!user) throw ErrNotFound

            return user
        }
    )
)
