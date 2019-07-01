import { useRef, useEffect, RefObject } from "react";
import { select, brushX, event } from "d3";

type Range<T> = [T, T];

export function useBrushX(
  [topLeft, bottomRight]: [[number, number], [number, number]],
  onChange: (range: Range<number> | null) => void,
  deps: any[],
  ref?: RefObject<SVGGElement>
) {
  const ownRef = useRef<SVGGElement>(null);
  const brushRef = ref || ownRef;
  const initializedBrush = brushX()
    .extent([topLeft, bottomRight])
    .on("end", () => onChange(event.selection));

  useEffect(() => {
    select(brushRef.current).call(initializedBrush as any);
  }, [...deps, onChange, ...topLeft, ...bottomRight]);

  return brushRef;
}
