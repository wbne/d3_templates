function linegraph()
{

total_max = d3.max(data, function(d) {return +d[data.columns[Y_AXIS]]})
max_time = d3.max(data, function(d) {return +d[data.columns[X_AXIS]]})
min_time = d3.min(data, function(d) {return +d[data.columns[X_AXIS]]})
const labelMargin = getRightMargin(data.columns[Y_AXIS])

  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {return +d[data.columns[X_AXIS]]; }))
    .range([ 0, graphWidth ]);
  svg.append("g")
    .attr("transform", "translate(0," + graphHeight + ")")
    .call(d3.axisBottom(x).ticks(5));
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", graphWidth)
      .attr("y", graphHeight+30 )
      .text(""+data.columns[X_AXIS])
      .attr("id", "X-AXIS")

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, total_max])
    .range([ graphHeight, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Draw the line
  svg.selectAll(".line")
      .data([data])
      .enter()
      .append("path")
        .attr("d", d3.line()
          .x(function(d){return x(+d[data.columns[X_AXIS]]) })
          .y(function(d){return y(+d[data.columns[Y_AXIS]]) })
      )
        .attr("fill", "none")
        .attr("stroke", function(d){ return "rgb(0,0,0)" })
        .attr("stroke-width", 3)
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", labelMargin)
        .attr("y", -10)
        .text(""+data.columns[Y_AXIS])
        .attr("id", "Y-AXIS")

}