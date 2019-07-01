import React, { memo, useRef, useEffect } from "react";
import {
  scaleTime,
  max,
  min,
  scaleLinear,
  scaleSequential,
  interpolateRdYlBu,
  axisBottom,
  axisLeft,
  select,
  brush,
  brushX,
  event
} from "d3";
import useAxis from "../hooks/useAxis";
import { useBrushX } from "../hooks/useBrush";

const width = 650;
const height = 400;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

interface Datum {
  avg: number;
  high: number;
  low: number;
  date: Date;
}

interface ChartProps {
  data: Datum[];
  onRangeChange: (range: [Date, Date] | []) => void;
  range: [Date, Date] | [];
}

function Chart({ data = [], onRangeChange, range }: ChartProps) {
  const xScale = scaleTime()
    .domain([min(data, d => d.date)!, max(data, d => d.date)!])
    .range([margin.left, width - margin.right]);

  const [tempLow, tempHigh] = [
    min(data, d => Math.min(0, d.low))!,
    max(data, d => d.high)!
  ];

  const yScale = scaleLinear()
    .domain([tempLow, tempHigh])
    .range([height - margin.bottom, margin.top]);

  const colorScale = scaleSequential(interpolateRdYlBu).domain([
    tempHigh,
    tempLow
  ]);

  const [xAxisRef] = useAxis(axisBottom(xScale), [data]);
  const [yAxisRef] = useAxis(axisLeft(yScale), [data]);

  const brushRef = useBrushX(
    [[margin.left, margin.top], [width - margin.right, height - margin.bottom]],
    newRange => {
      if (!newRange) return onRangeChange([]);
      const [min, max] = newRange;
      onRangeChange([xScale.invert(min), xScale.invert(max)]);
    },
    [data]
  );

  return (
    <svg width={width} height={height}>
      {data.map((d, i) => (
        <rect
          key={i}
          x={xScale(d.date)}
          y={yScale(d.high)}
          height={yScale(d.low) - yScale(d.high)}
          width={width / data.length}
          fill={
            range.length === 0 || (range[0] < d.date && range[1] > d.date)
              ? colorScale(d.avg)
              : "#ccc"
          }
        />
      ))}
      <g ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`} />
      <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`} />
      <g ref={brushRef} />
    </svg>
  );
}

export default memo(Chart);
