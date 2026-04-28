import type { Pool } from "@m2k-5f/pgtx";
import { AbstractReader } from "../common/abstract.reader";
import type { EnrollmentRead } from "../views";

export class EnrollmentReader extends AbstractReader<EnrollmentRead> {
    constructor(pool: Pool) { super(pool, "v_enrollments_r") }
}