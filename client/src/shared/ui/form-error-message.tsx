import type { FieldError, Message } from "react-hook-form";

export const ErrorMessage = (
    {error}: {
        error: 
            | FieldError 
            | Partial<{
                type: string | number;
                message: Message;
            }> 
            | undefined
    }
) => <>{error && <span className="text-red-500 justify-center flex">{error.message}</span>}</>