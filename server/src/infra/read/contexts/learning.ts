import type { ID } from "@domain/common/abstractions";
import { AbstractReader } from "../common/abstract.reader";
import type { EnrollmentRead } from "@contracts";
import type { Enrollment } from "@domain/learning/course-enrollment";

export class EnrollmentReader extends AbstractReader<EnrollmentRead> {
    protected override tablename: string = 'enrolments_r'
}