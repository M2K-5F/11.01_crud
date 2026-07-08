import { dependencies } from "@index/../injection";
import Elysia, { t } from "elysia";

export const userRoutes = new Elysia()
.use(dependencies)

.post("/register", 
    async ({
        body,
        identityService,
        readService
    }) => {
        const {uid} = await identityService.register(body)

        return await readService.user.firstBy({id: uid.asString()})
    }, {
        body: t.Object({
            name: t.String(),
            telegram_link: t.String(),
            password: t.String()
        }),
    }
)
