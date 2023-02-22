

// create a function to draw the scatter and bar plot when the page loads
window.onload = function() {
    // create a function to draw the scatter plot
        // set the dimensions and margins of the graph
        let margin = {top: 50, right: 50, bottom: 50, left: 50},
            width = 600 - margin.left - margin.right,
            height = 550 - margin.top - margin.bottom;
          
        // append the svg object to the body of the page
        let svg = d3.select("#scatterplot")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")

        let submit = d3.select("#submit");


        //Read the data
        d3.csv("data/scatter-data.csv").then(function(data) {

        const X_MAX = d3.max(data, d => {return parseInt(d.x)});
        const Y_MAX = d3.max(data, d => {return parseInt(d.y)});  
        

        // Add X axis
        const X_SCALE = d3.scaleLinear()
            .domain([0, X_MAX])
            .range([0, Y_MAX * 50]);
        svg.append("g")
            .attr("transform", "translate(" + 
            margin.left + "," + (margin.top +height) + ")")
            .call(d3.axisBottom(X_SCALE));
    
        // Add Y axis
        const Y_SCALE = d3.scaleLinear()
            .domain([0, Y_MAX])
            .range([Y_MAX * 50 , 0]);
        svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(d3.axisLeft(Y_SCALE));
    
        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return X_SCALE(parseInt(d.x)) + margin.left; } )
            .attr("cy", function (d) { return Y_SCALE(parseInt(d.y)) + margin.top } )
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


        });
    

        //  add point to grid
    function addPoint() {
	// add new points
	// reverse the arithmetic
	 let xcord = (50 + document.getElementById("x-point").value * 50)
	 let ycord = ((10 - document.getElementById("y-point").value) * 50)
	 let r = 10; 
	 // add point to graph
	 svg.append("circle")
        .attr("cx", xcord)
        .attr("cy", ycord)
        .attr("r", r)
        .style("fill", "deepskyblue")
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
}

document.getElementById("submit").addEventListener("click", addPoint);


// add in barchart frame below scatterplot
let bar = d3.select("#scatterplot").append("svg").attr("width", width).attr("height", height).append("g")

function generateBarPlot() {
    // create a function to draw the bar plot
	d3.csv("data/bar-data.csv").then((data) => {

        // get max y value according to data
		const MAX_Y2 = d3.max(data, (d) => {return parseInt(d.amount); });

        // create x-axis scaling value
		const X_SCALE2 = d3.scaleBand()
                        .domain(data.map((d) => {return d.category}))
                        .range([0, width])
                        .padding(0.2); 

        // create y-axis scaling value                
		const Y_SCALE2 = d3.scaleLinear()
							.range([height, 0])
							.domain([0, MAX_Y2])


        // add bar chart to plot                     
		bar.selectAll(".bar")
						.data(data)
		    			.enter().append("rect")
		    						.attr("class", "bar")
		    						.attr("x", d => {
		    								return X_SCALE2(d.category) + margin.left
		    							})
		    						.attr("y", d => {
		    							return (Y_SCALE2(d.amount) + margin.bottom)
		    						})
		    						.attr("width", X_SCALE2.bandwidth() - 5)
		    						.attr("height", d => {
		    							return (height - Y_SCALE2(d.amount))
		    						}).style("fill", "deepskyblue")

		// create x-axis
		bar.append("g")
	      		.attr("transform", "translate(" + 
	      			margin.left+ "," + (margin.top + height) + ")")
	      			.call(d3.axisBottom(X_SCALE2).tickFormat(function(d) { return d.category; })); 

        // create y-axis
		bar.append("g")
	      		.attr("transform", "translate(" + 
	      			margin.left + "," + (margin.top) + ")")
	      		.call(d3.axisLeft(Y_SCALE2).ticks(10));

	  
        // create and add tooltip
	    const bartooltip = d3.select("#scatterplot")
							.append("div")
								.attr("class", "tooltip")
								.style("opacity", 0)
                                .style("background-color", "white")


		// add mouseover event listeners
		function handleMouseover(event, d) {

            // show tooltip when hovered over
			bartooltip.style("opacity", 2);
		}						

	    // add mousemove event listeners
		function handleMousemove(event, d) {

            // update tooltip when it moves across
			bartooltip.html("Name: " + d.category + "<br>Value: " + d.amount)
					.style("left", (event.pageX + 10) + "px")
					.style("top", (event.pageY - 50) + "px");
		}

        // add mouseleave event listeners
		function handleMouseleave(event, d) {

            // hide tooltip
			bartooltip.style("opacity", 0);
		}


        // add event listeners to bars
		bar.selectAll("rect")
			.on("mouseover", handleMouseover)
			.on("mousemove", handleMousemove)
			.on("mouseleave", handleMouseleave);

	});
}

// call function to generate bar plot when page loads
generateBarPlot();


}

    

