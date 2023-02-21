// create a scatter plot in d3 importing data from a csv file
// using the d3.csv() method

// create a function to draw the scatter plot
window.onload = function() {
    // create a function to draw the scatter plot
    function drawScatterPlot() {
        // set the dimensions and margins of the graph
        var margin = {top: 50, right: 50, bottom: 50, left: 50},
            width = 600 - margin.left - margin.right,
            height = 550 - margin.top - margin.bottom;
    
        // append the svg object to the body of the page
        var svg = d3.select("#scatterplot")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")


        //Read the data
        d3.csv("../data/scatter-data.csv").then(function(data) {

        const X_MAX = d3.max(data, d => {return parseInt(d.x)});
        const Y_MAX = d3.max(data, d => {return parseInt(d.y)});

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, X_MAX])
            .range([0, Y_MAX * 50]);
        svg.append("g")
            .attr("transform", "translate(" + 
            margin.left + "," + (margin.top +height) + ")")
            .call(d3.axisBottom(x));
    
        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, Y_MAX])
            .range([Y_MAX * 50 , 0]);
        svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(d3.axisLeft(y));
    
        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(parseInt(d.x)) + margin.left; } )
            .attr("cy", function (d) { return y(parseInt(d.y)) + margin.top } )
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
                d3.select(this).classed("highlightBorder", d3.select(this).classed("highlightBorder") ? false : true);
                var lastClicked = d3.select("#point_select");
                lastClicked.text("(" + (this.getAttribute("cx") / 50 - 1) + ", " + ((500- this.getAttribute("cy")) / 50) + ")");
                });

        //listen to html button click and add a new point
        d3.select("#add_point").on("click", function() {
            var x = d3.select("#x_input").node().value;
            var y = d3.select("#y_input").node().value;
            var point = {"x": x, "y": y};
            data.push(point);
            drawScatterPlot();
        });
    });
        //TODO: add tooltip add point selection

    }
    drawScatterPlot();

}