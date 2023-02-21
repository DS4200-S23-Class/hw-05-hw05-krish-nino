// create a scatter plot in d3 importing data from a csv file
// using the d3.csv() method

// create a function to draw the scatter plot
window.onload = function() {
    // create a function to draw the scatter plot
    function drawScatterPlot() {
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
    
        // append the svg object to the body of the page
        var svg = d3.select("#scatterplot")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
        //Read the data
        d3.csv("../data/scatter-data.csv").then(function(data) {

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 10])
            .range([ 0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
    
        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 10])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
    
        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.x); } )
            .attr("cy", function (d) { return y(d.y); } )
            .attr("r", 10)
            .style("fill", "deepskyblue")
            // add mouseover event listeners
            .on("mouseover", function(d) {
                d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "orange");
            })
            // add mouseout event listeners
            .on("mouseout", function(d) {
                d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "deepskyblue");
            })
            // add click event listeners that records the x and y values and adds a border to the circle
            .on("click", function(d) {
                d3.select(this)
                .style("stroke-width", 5)
                .style("stroke", "black");
                var lastClicked = d3.select("#point_select");
                lastClicked.text("Last point clicked: X=" + d.x + ", Y=" + d.y);
                
                });
        });
    }
    drawScatterPlot();

}