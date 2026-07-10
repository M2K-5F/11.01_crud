export function useDebounce<T extends (...args: any[]) => void>(debounceFunction: T, delay: number): (...args: Parameters<T>) => void {
    let timer: NodeJS.Timeout | null = null

    return (...args: any[]) => {
        timer && clearTimeout(timer)
        timer = setTimeout(() => debounceFunction(...args), delay)
        return
    }
}
