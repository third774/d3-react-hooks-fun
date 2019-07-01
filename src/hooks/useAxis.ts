import { useEffect, useRef, RefObject } from "react";
import { select, AxisDomain, Axis } from "d3";

export default function useAxis<Domain extends AxisDomain>(
  axis: Axis<Domain>,
  deps: any[],
  providedRef?: RefObject<SVGGElement>
) {
  const ownRef = useRef<SVGGElement>(null);
  const ref: RefObject<SVGGElement> = providedRef || ownRef;

  useEffect(() => {
    if (!ref.current) return;
    axis(select(ref.current));
  }, deps);

  return [ref, axis] as const;
}
