import { identityService, reader } from "@composition";
import { authFilter } from "@presentation/common/auth.middleware";
import { ErrNotFound } from "@shared/error";
import Elysia, { t } from "elysia";

export const userRoutes = new Elysia()
.group('', g => g
    .post("/users", 
        async ({
            body
        }) => {
            const {uid} = await identityService.register(body)

            return reader.user.firstBy({id: uid})
        }, {
            body: t.Object({
                name: t.String(),
                telegramLink: t.String(),
                password: t.String()
            }),
        }
    )
)


.group('', g => g
    .use(authFilter())

    .post("/users/:userID/addrole",
        async ({
            body: {roleName},
            params: {userID},
        }) => {
            await identityService.addRole({
                roleName,
                uid: userID
            })

            return reader.user.firstBy({id: userID})
        }, {
            body: t.Object({
                roleName: t.Union([
                    t.Literal('student'), 
                    t.Literal('teacher')
                ] as const),
            })
        }
    )
    

    .get("/users/:userID", 
        async ({
            params: {userID},
        }) => {
            const user = await reader.user.firstBy({id: userID})

            if (!user) throw ErrNotFound

            return user
        }
    )


    .get("/users/me",
        async ({
            currentUser: {uid},
        }) => {
            const user = await reader.user.firstBy({id: uid})
            
            if (!user) throw ErrNotFound

            return user
        }
    )
)
