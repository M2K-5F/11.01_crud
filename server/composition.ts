import { Pool } from "@m2k-5f/pgtx";
import "crypto"
import { IdentityService } from "@applications/services/identity.service";
import { BCryptHashStrategy } from "./src/infra/security/bcrypt-hash-strategy";
import { CourseManagementService } from "@applications/services/content.manage.service";
import { TransactionManager } from "@infra/write";
import { ReadService } from "./src/infra/read";
import LearningService from "@applications/services/learning.service";
import { TokenSigner } from "@infra/security/jwt-token-signer";
import { AuthService } from "@applications/services/auth.service";
import { env } from "bun";
import { createPrivateKey, createPublicKey } from "crypto";
import { readFileSync } from "fs";

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
    logLevel: 'query'
})

const txm = new TransactionManager(persistensePool)

const signer = new TokenSigner(
    createPublicKey(readFileSync(Bun.env.ACCESS_PUB).toString()),
    createPrivateKey(readFileSync(Bun.env.ACCESS_PRIVATE).toString()),
    createPublicKey(readFileSync(Bun.env.REFRESH_PUB).toString()),
    createPrivateKey(readFileSync(Bun.env.REFRESH_PRIVATE).toString()),
)

export const authService = new AuthService(txm, new BCryptHashStrategy(), signer)

export const reader = new ReadService(queriesPool)

export const identityService = new IdentityService(txm, new BCryptHashStrategy())
export const courseManagementService = new CourseManagementService(txm)
export const learningService = new LearningService(txm)