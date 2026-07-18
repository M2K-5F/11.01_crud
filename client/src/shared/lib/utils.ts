import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


type NumericKeys<T> = {
    [K in keyof T]: T[K] extends number ? K : never
}[keyof T]

export const sorted = <T extends Record<string, any>>(
    array: T[], 
    param: NumericKeys<T>
) => {
    return [...array].sort((a, b) => a[param] - b[param])
}