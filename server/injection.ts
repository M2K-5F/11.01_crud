import Elysia from "elysia";
import { Pool, setTypeParser, sql, } from "@m2k-5f/pgtx";
import { IdentityService } from "@applications/services/identity.service";
import { BCryptHashStrategy } from "./src/infra/security/bcrypt-hash-strategy";
import { CourseManagementService } from "@applications/services/content.manage.service";
import { TransactionManager } from "@infra/write";
import { ReadService } from "./src/infra/read";
import LearningService from "@applications/services/learning.service";
import { TokenSigner } from "@infra/security/jwt-token-signer";
import { AuthService } from "@applications/services/auth.service";
import { env } from "bun";

export const getDependencies = async () => {
    setTypeParser(20, (val) => parseInt(val, 10))

    const persistensePool = new Pool({
        port: env.PG_PORT,
        host: env.PG_HOST,
        password: env.PG_PWD,
        user: env.PG_USER,
        database: env.PG_DB,
        max: 30,
        logLevel: 'notice'
    })

    const queriesPool = new Pool({
        port: env.PG_PORT,
        host: env.PG_HOST,
        password: env.PG_PWD,
        user: env.PG_USER,
        database: env.PG_DB,
        max: 10,
        logLevel: 'notice'
    })

    const txm = new TransactionManager(persistensePool)
    

    const identityService = new IdentityService(txm, new BCryptHashStrategy())
    const courseManagementService = new CourseManagementService(txm)
    const learningService = new LearningService(txm)

    const readService = new ReadService(queriesPool)

    const signer = await TokenSigner.newWithKeys()

    const authService = new AuthService(txm, new BCryptHashStrategy(), signer)

    
    return {
        querier: queriesPool,
        identityService,
        courseManagementService,
        authService,
        readService,
        learningService,
    }
};

const deps = await getDependencies()

export const dependencies = (app: Elysia) => app.derive(() => deps)