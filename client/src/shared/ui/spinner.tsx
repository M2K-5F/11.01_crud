import clsx from "clsx"

interface SpinnerProps {
    className?: string
}

export const Spinner = ({ className }: SpinnerProps) => {
    return (
        <div className={clsx("w-full h-full flex items-center justify-center", className)}>
            <div
                className={clsx(
                    "w-8 h-8 border-4 rounded-full",
                    "border-t-transparent border-green-500",
                    "animate-spin"
                )}
                style={{ animationDuration: "0.8s" }}
                aria-label="Loading"
            />
        </div>
    )
}
