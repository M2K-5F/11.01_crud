import type { FC, HTMLAttributes } from "react"
import { useClipboard } from "../hooks/useClipboard"
import { Button } from "./button"

export const CopyableSpan: FC<HTMLAttributes<HTMLSpanElement> & {value: any}> = ({value, ...params}) => {
    const copy = useClipboard()

    return (
        <Button variant={'link'} onClick={() => {copy(value)}} className="p-0 m-0 w-fit text-sm text-muted-foreground" {...params} >{value}</Button>
    )
}