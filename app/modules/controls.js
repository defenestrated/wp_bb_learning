// Controls module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

	// Create a new module.
	var Controls = app.module();
	
/*
	Controls.insertControls = function(context) {
		var lay = context;
		console.log("adding controls with context: ");
		console.log(lay);
		
		
		var Btest = lay.parchment.append("g")
				.attr("class", "link");
		
		Btest.append("text") // button text
				.attr("class", "link")
				.attr("id", "test")
				.text("test")
				.attr("x", lay.w-lay.sidebar);
		
		Btest.select("text#test").attr("y", lay.parchment.selectAll("text.link")[0].length*40);
		
		Btest.insert("ellipse", "text") //background circle
				.attr("class", "link")
				.attr("id", "test")
				.attr("rx", function () { return Btest.select("text")[0][0].clientWidth*3/4; })
				.attr("ry", 20)
				.attr("cx", lay.w-lay.sidebar)
				.attr("cy", lay.parchment.selectAll("text.link")[0].length*40)
				.attr("stroke", "black")
				.attr("stroke-width", "2pt");
	}  
	
	function test() { console.log("testing"); }
	
	function scramble() {
		var lay = this;
		console.log("scrambling");
		
		this.nodes
			.transition(1000)
			.attr("transform", function () {
				var rx = Math.floor(Math.random()*150+50);
				var ry = Math.floor(Math.random()*150+50);
				
				return "translate(" + rx + "," + ry + ")";
			});
	}
*/

	return Controls;

});
