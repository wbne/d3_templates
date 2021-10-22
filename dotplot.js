function dotplot() {
    const min = [d3.min(data, function(d) {return +d[data.columns[X_AXIS]]}), d3.min(data, function(d) {return +d[data.columns[Y_AXIS]]})]
    const max = [d3.max(data, function(d) {return +d[data.columns[X_AXIS]]}), d3.max(data, function(d) {return +d[data.columns[Y_AXIS]]})]
    const labelMargin = getRightMargin(data.columns[Y_AXIS])
    
    var x = d3.scaleLinear()
      .domain([min[0], max[0]])
      .range([ 0, graphWidth ]);
    svg.append("g")
      .attr("transform", "translate(0," + graphHeight + ")")
      .call(d3.axisBottom(x));
      svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", graphWidth)
        .attr("y", graphHeight+30 )
        .text(""+data.columns[X_AXIS])
        .attr("id", "X-AXIS")

    var y = d3.scaleLinear()
      .domain([min[1], max[1]])
      .range([ graphHeight, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d[data.columns[X_AXIS]]); } )
        .attr("cy", function (d) { return y(d[data.columns[Y_AXIS]]); } )
        .attr("r", 4)
        .style("fill", "#69b3a2")
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", labelMargin)
      .attr("y", -15)
      .text(""+data.columns[Y_AXIS])
      .attr("id", "Y-AXIS")
}