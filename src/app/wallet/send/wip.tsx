import { useEffect, useState } from "react";

export function useCycle<T>(options: Array<T>, defaultValue?: T) {
    const [index, setIndex] = useState(defaultValue ? undefined : 0);
    const next = () => setIndex((i) => ((i ?? -1) + 1) % options.length);

    return [
        index == null && defaultValue ? defaultValue : options[index ?? 0]!,
        next,
    ] as const;
}

export function useRootClick(cb: () => void) {
    useEffect(() => {
        const controller = new AbortController();
        document.documentElement.addEventListener(
            "click",
            () => {
                cb();
            },
            { signal: controller.signal }
        );
        document.documentElement.addEventListener(
            "mousedown",
            (event) => {
                // Prevent selection of text:
                // https://stackoverflow.com/a/43321596
                if (event.detail > 1) {
                    event.preventDefault();
                }
            },
            { signal: controller.signal }
        );
        return () => {
            controller.abort();
        };
    }, []);
}