// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var file = "assets/data/data.csv"

d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error) {
    throw err
}

// Retrieve data from the CSV file and execute everything below
function successHandle(statesData) {

    // parse data
    statesData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([8.1, d3.max(statesData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([20, d3.max(statesData, d => d.obesity)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale)
        .ticks(7);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(statesData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", 17)
        .attr("fill", "lightblue")
        .attr("opacity", ".50");

    var circlesGroup = chartGroup.selectAll()
        .data(statesData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.obesity))
        .style("font-size", "13px")
        .style("text-anchor", "middle")
        .style('fill', 'white')
        .text(d => (d.abbr));

    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty (%)");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Obesity (%)");

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .style("display", "block")
        .html(function (d) {
            return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}% `);
        });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })

};