import {type RefObject, useLayoutEffect, useState} from 'react';

export type ElementSize = { width: number; height: number };

/** The rendered size of an element, kept up to date with a ResizeObserver. */
export function useElementSize(elementRef: RefObject<HTMLElement | null>): ElementSize | undefined {
    const [size, setSize] = useState<ElementSize>();
    useLayoutEffect(() => {
        const element = elementRef.current;
        if (element === null) {
            return;
        }
        // The border box, padding included: ornaments drawn over the whole element need its full size.
        const observer = new ResizeObserver(([entry]) => {
            const [{inlineSize: width, blockSize: height}] = entry.borderBoxSize;
            setSize({width, height});
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [elementRef]);
    return size;
}
