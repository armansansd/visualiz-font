$("document").ready(function() {
	/******************/
	/* general values */
	/******************/
	var handle = true;
	var link = false;
	var zoom = false;
	var r = 100; //ratio for linked data
	var sb = 50; //sensibility for linked data
	/******************/
	/*     data       */
	/******************/
	//convert ttx to json
	// -> converter-script.js
	// return an json object of the entire xml tree
	var obj = new Object();
	obj = xmltojson();
	// function filtre pour 
	// -> function.js
	//ABCDEFGHIJKLMNOPQRSTUVWXYZ
	//abcdefghijklmnopqrstuvwxyz
	var s = "etla";
	var data = filter(s, table(obj));
	/******************/
	/*   d3 init var  */
	/******************/
	// define margin for the chart and the size of the canvas
	// convention : 
	// https://bl.ocks.org/mbostock/3019563
	var margin = {
			top: 100,
			right: 10,
			bottom: 90,
			left: 150
		},
		width = 1000 - margin.left - margin.right,
		height = 700 - margin.top - margin.bottom;
	//scale the data to the graph size
	//.range([closer_to_the_origin, further_from_the_origin])
	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);
	//color range for each area
	var z = ["#FFACC3", "#94EDE7"];
	//D3 know what the scope of the data
	//The .domain function which returns those maximum
	//and minimum values to D3 as the range for the x axis.
	x.domain(d3.extent(data, function(d, i) {
		return i;
	}));
	y.domain([d3.min(data, function(d) {
		return parseInt(d.y)
	}), d3.max(data, function(d) {
		return parseInt(d.y)
	})]);
	// to do : a function to get the extreme on x and y 
	// console.log(d3.max(data, function(d) { return parseInt(d.y) }) , d3.max(data, function(d) { return parseInt(d.x) }));
	// console.log(d3.min(data, function(d) { return parseInt(d.y) }) , d3.min(data, function(d) { return parseInt(d.x) }));
	//intiate the scale
	var xAxis = d3.axisBottom(x)
	var yAxis = d3.axisLeft(y);
	//init zoom
	var zoom = d3.zoom().scaleExtent([1 / 2, 4]).on("zoom", zoomed);
	//creat the canvas 
	var svg = d3.select("body")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	//init the path for y pos
	//https://github.com/d3/d3-shape/blob/master/README.md#curves
	var area1 = d3.area().x(function(d, i) {
		return x(i);
	}).y0(height).y1(function(d) {
		return y(d.y);
	}).curve(d3.curveCatmullRom.alpha(1));
	//init the path for x pos
	var area2 = d3.area().x(function(d, i) {
		return x(i);
	}).y0(height).y1(function(d) {
		return y(d.x);
	}).curve(d3.curveCatmullRom.alpha(1));
	//store the paths into an array				      
	var p = [area1, area2];
	/******************/
	/*    d3 draw     */
	/******************/
	//draw the paths
	drawPath(p);
	//dislay the axis 
	svg.append("g")
		.call(yAxis)
		.append("text")
		.attr("fill", "#903AF0")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("point");
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
	//zoom available, to comment if not needed
	svg.call(zoom);
	/*************************/
	/*    drawing function   */
	/*************************/
	function drawPath(p) {
		//erase all path then redraw it
		d3.selectAll("path").remove();
		p.forEach(function(d, i) {
			svg.append("path")
				.datum(data)
				.attr("class", "area" + i)
				.attr("fill", z[i])
				.attr("d", d);
		});
		//then erase and redraw the handles x - y
		d3.selectAll("circle").remove();
		drawHandleX();
		drawHandleY();
	}

	function drawHandleY() {
		svg.selectAll("handleY")
			.data(data)
			.enter()
			.append("g")
			.append("circle")
			.attr("class", "pt_y")
			.attr("cx", function(d, i) {return x(i);})
			.attr("cy", function(d, i) {return y(d.y);})
			.attr("r", 4)
			.attr("fill", function(d, i) {if (d.on === "0") {return "white"} else {return "black"}})
			.attr("stroke", z[0])
			.attr("cursor", "ns-resize")
			.call(d3.drag()
				  	.on("start", dragY) //call the function drag to update the data and the shape
					.on("drag", dragY)
				  	.on("end", drop));
	}

	function drawHandleX() {
		svg.selectAll("circleX")
			.data(data)
			.enter()
			.append("g")
			.append("circle")
			.attr("cx", function(d, i) {return x(i);}).attr("cy", function(d, i) {return y(d.x);})
			.attr("r", 4)
			.attr("class", "pt_x")
			.attr("fill", function(d, i) {if (d.on === "0") {return "white"} else {return "black"}})
			.attr("stroke", z[1])
			.attr("cursor", "ns-resize")
			.call(d3.drag()
				  	.on("start", dragX)
				  	.on("drag", dragX)
				  	.on("end", drop));
	}

	function dragY(d, i) {
		//change the aspect of the cursor
		d3.select("body").style("cursor", "ns-resize");
		console.log(d);
		//some info on the point selected ->
		//console.log(d.y, d3.event.dy, d.y = parseInt(d.y) + parseInt(d3.event.dy));
		//get the position of the selected handle
		var elem_y = d3.select(this).attr("cy");
		// get the new position (higher or lower)
		elem_y = parseInt(elem_y) + parseInt(d3.event.dy);
		//update the handle position (aka move the handle)
		d3.select(this).attr("cy", elem_y);
		//update the data by inverting the range maping
		data[i].y = y.invert(d3.select(this).attr("cy"));
		//if the link option is selected
		//move the other points
		if (link != false) {
			for (var j = 1; j < r; j++) {
				if (i + j < data.length && i - j >= 0) {
					if (d3.event.dy < 0) {
						data[i + j].y = parseInt(data[i + j].y) + sb / j;
						data[i - j].y = parseInt(data[i - j].y) + sb / j;
					} else {
						data[i + j].y = parseInt(data[i + j].y) - sb / j;
						data[i - j].y = parseInt(data[i - j].y) - sb / j;
					}
				} else {
					console.log("offset value");
				}
			}
		}
		//redraw the Y area
		drawPath(p);
	}

	function dragX(d, i) {
		/////////////////////////
		//Same as above but for X
		/////////////////////////
		d3.select("body").style("cursor", "ns-resize");
		console.log(d);
		var elem_x = d3.select(this).attr("cy");
		elem_x = parseInt(elem_x) + parseInt(d3.event.dy);
		d3.select(this).attr("cy", elem_x);
		data[i].x = y.invert(d3.select(this).attr("cy"));
		if (link != false) {
			for (var j = 1; j < r; j++) {
				if (i + j < data.length && i - j >= 0) {
					if (d3.event.dy < 0) {
						data[i + j].x = parseInt(data[i + j].x) + sb / j;
						data[i - j].x = parseInt(data[i - j].x) + sb / j;
					} else {
						data[i + j].x = parseInt(data[i + j].x) - sb / j;
						data[i - j].x = parseInt(data[i - j].x) - sb / j;
					}
				} else {
					console.log("offset value");
				}
			}
		}
		drawPath(p);
	}

	function drop(d, i) {
		d3.select("body").style("cursor", "auto");
	}

	function zoomed() {
		svg.attr("transform", d3.event.transform);
	}
	/*******************************/
	/*     buttons interaction     */
	/******************************/
	//upload the data to the xml 
	$("#upload").click(function() {
		// get all the position of the point cy
		// get the mathing values
		//upload ton json then to xml
		d3.selectAll("circle").each(function(d) {
			// update the value to the object 
			//fonction in "general functions"
			updateObj(d.parentId, d.contourId, d.pointId, Math.round(d.x), Math.round(d.y));
		});
		// upload the json to the xml
		// -> functions.js
		jsontoxml(obj);
	});
	//hide - show the handles
	$("#handle").click(function() {
		handle = !handle;
		if (handle === true) {
			drawHandleX();
			drawHandleY();
			$(this).addClass("active");
		} else {
			d3.selectAll("circle").remove();
			$(this).removeClass("active");
		}
	});
	//hide - show the handles
	$("#link").click(function() {
		link = !link;
		if (link != false) {
			$(this).addClass("active");
		} else {
			$(this).removeClass("active");
		}
	});
	/******************************/
	/*     general functions      */
	/******************************/
	function updateObj(i, j, k, x, y) {
		//find the element
		// update the data
		var contour = obj.ttFont.glyf.TTGlyph[i].contour;
		//console.log(obj.ttFont.glyf.TTGlyph[i].contour[j]);
		if ($.isArray(contour)) {
			obj.ttFont.glyf.TTGlyph[i].contour[j].pt[k]._x = x;
			obj.ttFont.glyf.TTGlyph[i].contour[j].pt[k]._y = y;
		} else {
			obj.ttFont.glyf.TTGlyph[i].contour.pt[k]._x = x;
			obj.ttFont.glyf.TTGlyph[i].contour.pt[k]._y = y;
		}
	};
});
/*notes : 
	//API doc' 
	https://github.com/d3/d3-drag/blob/master/README.md#drag

  //call -> bind a behavior to the object

	//process of d3
	var p = elem.selectAll("p") // fetch all p in the elem 
	 				.data(theData) //bind the data to the object
	 				.enter() // enter the object
	 				.append("p")
					.text(function (d, i) { return 'i = '+i + 'd = '+d; }); // d, i variable provide by d3 d-> data i -> elem index 
*/