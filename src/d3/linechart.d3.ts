import {select} from "d3-selection";
import {scaleBand,scaleTime, scaleLinear, scaleOrdinal} from "d3-scale"
import { malagaStats } from "../data/linechart.data";
import {line} from "d3-shape";
import {extent} from "d3-array";
import { schemeCategory10 } from "d3-scale-chromatic";
import {axisBottom, axisLeft} from "d3-axis";
import {timeFormat} from "d3-time-format";
import {max} from "d3-array"

const d3 = {
    select,
    scaleTime,
    scaleLinear,
    extent,
    line,
    scaleOrdinal,
    schemeCategory10,
    axisBottom,
    axisLeft,
    scaleBand,
    timeFormat,
    max,

};

// Constant. SVG Coordinate
const width: number = 500; // SVG Coordinate system
const height: number = 300; //
const padding: number = 50;

const card = d3
    .select("#root")
    .append("div")
    .attr("class","card");

const svg = card
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox",`${-padding} ${-padding} ${width  + 2* padding} ${height + 2 *padding}`); // "0 0 500 300"


const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const xScale = d3
    .scaleBand()
    .domain(months)
    .rangeRound([0, width])
    .paddingInner(0.05)

const xGroup = d3.scaleBand()
    .padding(0.05)
    .domain(["avg","min","max"])
    .rangeRound([0, xScale.bandwidth()])

const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(malagaStats.reduce((acc, s) => acc.concat(s.values), []))])
    .rangeRound([height,0])


// Colors
const z = d3
        .scaleOrdinal(d3.schemeCategory10)
        .domain(["max", "min", "avg"]);



// Add Chart
svg.append("g")
    .selectAll("g")
    .data(malagaStats)
    .enter().append("g")
        .attr("transform", function(d) { return "translate(" + xGroup(d.id) + ",0)"; })
        .attr("fill", d =>  z(d.id) )
        .selectAll("rect")
        .data(function(d) { return d.values })
        .enter().append("rect")
            .attr("x", function(d,i) { return xScale(months[i]); })
            .attr("y", function(d) { return yScale(d); })
            .attr("width", xGroup.bandwidth())
            .attr("height", function(d) { return height - yScale(d); })
            .attr("opacity",0.9)
            .on("mouseover", function() {
                d3.select(this)
                    .attr("opacity",1)
                    .style("border","solid 1px black")

            })
            .on("mouseout", function(d, i) {
                d3.select(this)
                    .attr("opacity",0.9)
            })


// Axis
const axisGroup = svg.append("g");

axisGroup.append("g")
    .call(d3.axisLeft(yScale).tickFormat(d=> d + '°C'))


axisGroup.append("g")
    .attr("transform",`translate(0, ${height})`)
    .call(d3.axisBottom(xScale))


// text label for the y axis
svg.append("text")
    .attr("y", height+30)
    .attr("x",width/2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size","10")
    .text("Málaga Average Temperatures 2018");

// Legend
const legend = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(malagaStats)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * -20 + ")"; });

legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", d=>z(d.id));

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) { return d.id.toUpperCase(); });
