function barplot() {
    const min = d3.min(data, function(d) {return +d[data.columns[Y_AXIS]]})
    const max = d3.max(data, function(d) {return +d[data.columns[Y_AXIS]]})
    const labelMargin = getRightMargin(data.columns[Y_AXIS])

    var x = d3.scaleBand()
    .range([ 0, graphWidth ])
    .domain(data.map(function(d) { return d[data.columns[X_AXIS]]; }))
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + graphHeight + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", graphWidth)
        .attr("y", graphHeight+40 )
        .text(""+data.columns[X_AXIS])
        .attr("id", "X-AXIS")

    var y = d3.scaleLinear()
    .domain([min, max])
    .range([ graphHeight, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", labelMargin)
        .attr("y", -10)
        .text(""+data.columns[Y_AXIS])
        .attr("id", "Y-AXIS")

    svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
        .attr("x", function(d) { return x(d[data.columns[X_AXIS]]); })
        .attr("y", function(d) { return y(d[data.columns[Y_AXIS]]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return graphHeight - y(d[data.columns[Y_AXIS]]); })
        .attr("fill", "#69b3a2")
}