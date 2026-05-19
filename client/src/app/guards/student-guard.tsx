import type { FC, PropsWithChildren } from "react";
import { RoleGuard } from "./role-guard";

export const StudentGuard: FC<PropsWithChildren> = ({children}) => <RoleGuard roles={['Student']} >{children}</RoleGuard>