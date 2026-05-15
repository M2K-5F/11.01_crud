import type { FC } from "react";

export const ErrorFallback: FC<{message: any}> = ({message}) => {
    return <p className="text-red-500 w-full min-h-20 h-full text-center justify-center">{message}</p>
}