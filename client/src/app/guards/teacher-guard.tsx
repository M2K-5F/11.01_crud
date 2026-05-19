import type { FC, PropsWithChildren } from "react";
import { RoleGuard } from "./role-guard";

export const TeacherGuard: FC<PropsWithChildren> = ({children}) => <RoleGuard roles={['Teacher']} >{children}</RoleGuard>