import Elysia from "elysia";
import { TokenSigner } from "@presentation/auth/service/token.signer";
import { Pool } from "@m2k-5f/pgtx";
import { IdentityService } from "@applications/services/identity.service";
import { BCryptHashStrategy } from "./src/infra/security/bcrypt-hash-strategy";
import { CourseManagementService } from "@applications/services/content.manage.service";
import { TokenStorage } from "@presentation/auth/store/token.storage";
import { SessionService } from "@presentation/auth/service/token.service";
import { types } from "pg";
import { TransactionManager } from "@infra/write";
import { ReadService } from "./src/infra/read";

export const getDependencies = async () => {
    types.setTypeParser(20, (val) => parseInt(val, 10))

    const persistensePool = new Pool({
        connectionString: Bun.env.PERSISTENSE_DSN,
        max: 20,
        // enableLogs: true
    })

    const sessionsPool = new Pool({
        connectionString: Bun.env.SESSION_DB_DSN,
        max: 3,
        enableLogs: true
    })

    const queriesPool = new Pool({
        connectionString: Bun.env.QUERY_DB_DSN,
        max: 100,
        
        // enableLogs: true
    })

    const txm = new TransactionManager(persistensePool)
    

    const identityService = new IdentityService(txm, new BCryptHashStrategy())
    const courseManagementService = new CourseManagementService(txm)
    // const learningService = new LearningService(txm)

    const readService = new ReadService(queriesPool)

    const sessionStorage = new TokenStorage(sessionsPool)
    const signer = await TokenSigner.newWithKeys()

    const sessionService = new SessionService(sessionStorage, signer)

    
    return {
        querier: queriesPool,
        identityService,
        courseManagementService,
        sessionService,
        readService
        // learningService,
    }
};

const deps = await getDependencies()

export const dependencies = (app: Elysia) => app.derive(() => deps)