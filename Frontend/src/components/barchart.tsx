"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

const data = [25, 40, 60, 80, 25];

interface BarChartProps {
  barColor: string;
}

export default function BarChart({ barColor }: BarChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 300;

    svg.attr("width", width).attr("height", height);

    const maxDataValue = d3.max(data)!;
    const yMax = maxDataValue + 10;

    const xScale = d3
      .scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height, 0]);

    // tooltip 
    const tooltipElement = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "4px");

    // bars
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, i) => xScale(i.toString())!)
      .attr("y", d => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d))
      .attr("fill", barColor)  // Use selected color
      .on("mouseover", (event, d) => {
        tooltipElement
          .style("visibility", "visible")
          .text(`Value: ${d}`);

        d3.select(event.currentTarget)
          .attr("fill", d3.color(barColor)?.brighter()?.toString() || barColor);
      })
      .on("mousemove", (event) => {
        tooltipElement
          .style("top", `${event.pageY + 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", (event) => {
        tooltipElement.style("visibility", "hidden");

        d3.select(event.currentTarget)
          .attr("fill", barColor);
      });

    // x-axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // y-axis
    svg.append("g")
      .call(d3.axisLeft(yScale));

  }, [barColor]);

  return (
    <div className="flex justify-center items-center p-5">
      <svg ref={svgRef} className="bg-main border-2 rounded-base border-border dark:border-darkBorder shadow-light dark:shadow-dark"></svg>
    </div>
  );
}
