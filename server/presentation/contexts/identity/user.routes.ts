import { dependencies } from "@index/injection";
import Elysia, { t } from "elysia";

export const userRoutes = new Elysia()
.use(dependencies)

.post("/register", 
    async ({
        body,
        userService,
        qs
    }) => {
        const userID = await userService.register(body)

        return await qs.user.firstBy({id: userID.id})
    }, {
        body: t.Object({
            name: t.String(),
            telegram_link: t.String(),
            password: t.String()
        }),
    }
)
