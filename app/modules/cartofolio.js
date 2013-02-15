// Cartofolio module
define([
  // Application.
  "app",
  "modules/project"
],

// Map dependencies from above array.
function(app, Project) {

  // Create a new module.
  var Cartofolio = app.module();
  

  // Default Model.
  Cartofolio.Model = Backbone.Model.extend({
  
  });
  
  Cartofolio.projects = new Project.Collection({}, {name: "all projects"});

  

  // Default View.
  
  Cartofolio.Views = {};
  
  
  Cartofolio.Views.Layout = Backbone.Layout.extend({
  
    template: "cartofolio",
	className: "cartofolio_parchment",
	
	
	projectgroup: {},
	parchment: {},
	w: '', h: '', x: '', y: '', ux: '', uy: '', xmin: '', ymin: '', xmax: '', ymax: '', axes: '', leader: '',
	firstRender: true,
	sidebar: 100,
	r: 20,
	s: 2*this.r/150,
	maptype: "random",
	
	padding: 7,
	fadetime: 1000,
	
	bR: 30, // button radius
	
	
	format: '', // to hold date formatting
	
	events: {
		"click #test" : "test",
		"click #hours" : "hours",
		"click #dimensions" : "dimensions",
		"click #children" : "children",
		"click #scramble" : "scramble"
	},
	
	
	afterRender: function() {
      if (this.firstRender) {
        this.firstRender = false;
        this.setup_d3();
        Cartofolio.projects.bind("all", this.d3_update);
      }
    },
	
	
	/* ------------------- cartofolio init --------------------- */
	
	initialize: function () {
		_.bindAll(this);
		
		console.log("cartofolio layout initialized.");
		
		var projectsgroup;
		
		Cartofolio.projects.on("createView", function (wrapper) {
			console.log("cartfolio project created, wrapped with " + wrapper.tn + "." + wrapper.cn);
			projectgroup = new Project.Views.List({
				className: wrapper.cn,
				tagName: wrapper.tn
			})
			app.layouts.carto.insertView(projectgroup);

		});
		
		Cartofolio.projects.on("add", function(model) {
			
			var item = new Project.Views.Item({model: model});
			projectgroup.insertView(item);
			
		});
		
	},
	

	/* ----------------------- d3 setup ------------------------ */
	
	setup_d3: function () {
		var lay = this;
		lay.format = d3.time.format("%Y-%m-%d %H:%M:%S");
		
		lay.w = $(window).width();
		lay.h = $(window).height();
		
		this.parchment = d3.select(".cartofolio_wrapper").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			;
		lay.setbuffer();
				
/* 		_.each(Cartofolio.projects, function(element, index, list) { console.log(list.at(index).attributes) }); */
		Cartofolio.elders = new Project.Collection (_(Cartofolio.projects.models).filter(function (model) {
			return model.get("parent") == 0;
		}), {name:"elder projects only"});
		
		console.log(Cartofolio.elders);
		console.log(_(Cartofolio.elders.models).map(function (model) {
			return model.get("title");
		}));
		// var sorted = _(Cartofolio.projects.models).sortBy(function(model){ return model.get("hours") });
		// ^^ this is how you sort with underscore
		
		
		/* ----------------- test button ----------------- */
		
		var Btest = this.parchment.append("g")
				.attr("class", "link");
		
		Btest.append("text") // button text
				.attr("class", "link")
				.attr("id", "test")
				.text("test")
				.attr("x", lay.w-lay.sidebar);

		Btest.select("text#test").attr("y", this.parchment.selectAll("text.link")[0].length*40);
		
		Btest.insert("ellipse", "text") //background circle
				.attr("class", "link")
				.attr("id", "test")
				.attr("rx", function () { return Btest.select("text")[0][0].clientWidth*3/4; })
				.attr("ry", 20)
				.attr("cx", lay.w-lay.sidebar)
				.attr("cy", this.parchment.selectAll("text.link")[0].length*40)
				.attr("stroke", "black")
				.attr("stroke-width", "2pt");
		
		/* ----------------- hour button ----------------- */
		
		var Bhours = this.parchment.append("g")
				.attr("class", "link");
		
		Bhours.append("text") // button text
				.attr("class", "link")
				.attr("id", "hours")
				.text("hours")
				.attr("x", lay.w-lay.sidebar);

		Bhours.select("text#hours").attr("y", this.parchment.selectAll("text.link")[0].length*40);
		
		Bhours.insert("ellipse", "text") //background circle
				.attr("class", "link")
				.attr("id", "hours")
				.attr("rx", function () { return Bhours.select("text")[0][0].clientWidth*3/4; })
				.attr("ry", 20)
				.attr("cx", lay.w-lay.sidebar)
				.attr("cy", this.parchment.selectAll("text.link")[0].length*40)
				.attr("stroke", "black")
				.attr("stroke-width", "2pt");
				
		/* ---------------- dims button  ----------------- */		
				
				
		var Bdimensions = this.parchment.append("g")
				.attr("class", "link");
		
		Bdimensions.append("text") // button text
				.attr("class", "link")
				.attr("id", "dimensions")
				.text("dimensions")
				.attr("x", lay.w-lay.sidebar);

		Bdimensions.select("text#dimensions").attr("y", this.parchment.selectAll("text.link")[0].length*40);
		
		Bdimensions.insert("ellipse", "text") //background circle
				.attr("class", "link")
				.attr("id", "dimensions")
				.attr("rx", function () { return Bdimensions.select("text")[0][0].clientWidth*3/4; })
				.attr("ry", 20)
				.attr("cx", lay.w-lay.sidebar)
				.attr("cy", this.parchment.selectAll("text.link")[0].length*40)
				.attr("stroke", "black")
				.attr("stroke-width", "2pt");		
				
				
		/* -------------- children button ---------------- */		
				
				
		var Bchildren = this.parchment.append("g")
				.attr("class", "link");
		
		Bchildren.append("text") // button text
				.attr("class", "link")
				.attr("id", "children")
				.text("children")
				.attr("x", lay.w-lay.sidebar);

		Bchildren.select("text#children").attr("y", this.parchment.selectAll("text.link")[0].length*40);
		
		Bchildren.insert("ellipse", "text") //background circle
				.attr("class", "link")
				.attr("id", "children")
				.attr("rx", function () { return Bchildren.select("text")[0][0].clientWidth*3/4; })
				.attr("ry", 20)
				.attr("cx", lay.w-lay.sidebar)
				.attr("cy", this.parchment.selectAll("text.link")[0].length*40)
				.attr("stroke", "black")
				.attr("stroke-width", "2pt");	
		
		/* -------------- scramble button ---------------- */		
				
				
		var Bscramble = this.parchment.append("g")
				.attr("class", "link");
		
		Bscramble.append("text") // button text
				.attr("class", "link")
				.attr("id", "scramble")
				.text("scramble")
				.attr("x", lay.w-lay.sidebar);

		Bscramble.select("text#scramble").attr("y", this.parchment.selectAll("text.link")[0].length*40);
		
		Bscramble.insert("ellipse", "text") //background circle
				.attr("class", "link")
				.attr("id", "scramble")
				.attr("rx", function () { return Bscramble.select("text")[0][0].clientWidth*3/4; })
				.attr("ry", 20)
				.attr("cx", lay.w-lay.sidebar)
				.attr("cy", this.parchment.selectAll("text.link")[0].length*40)
				.attr("stroke", "black")
				.attr("stroke-width", "2pt");
				
						
		/* ----------------     nodes     ----------------- */	

		this.nodes = this.parchment.selectAll(".node")
				.data(Cartofolio.elders.models)
			.enter().append("text")
				.attr("class", "node")
				.attr("x",10)
				.attr("y",10)
				.text(function (d) { return d.get("title"); })
				.attr("fill", function (d) {
					var c = d.get("hours")*2;
					return "rgb("+c+","+c+","+c+")";
				});
				
				
		/* ------------------- scales --------------------- */
		
		
		/*
lay.x = d3.time.scale()
		        .domain(d3.extent(Cartofolio.projects.models, function(d) { return lay.format.parse(d.get("date")); }))
		        .nice(d3.time.year)
		        .range([lay.xmin, lay.xmax]);
		
		lay.y = d3.scale.linear()
				.domain(d3.extent(Cartofolio.projects.models, function(d) {
					return d.get("hours");
				}))
				.range([lay.ymax, lay.ymin])
				.nice();
*/
	

		
		
		lay.ux = function(x){
			return (x)/lay.s-75;
		}
		lay.uy = function(y){
			return (y)/lay.s-75;
		}

		
		/* -------------------------------------------------- */
		
	}, // end d3_setup
	
		/* ------------------ sorting fn's ------------------ */
		
	test: function () { console.log("testing"); },

	hours: function () { 
		console.log("sorting by hours");
		this.nodes
			.transition(1000)
			.attr("x", 60)
			.attr("y", function (d) { return d.get("hours"); });
	},
	
	dimensions: function () { 
		console.log("sorting by dimensions");
		this.nodes
			.transition(1000)
			.attr("x", 60)
			.attr("y", function (d) { return d.get("dimensions")*10; });
	},
	
	children: function () { 
		console.log("sorting by # of children");
		this.nodes
			.transition(1000)
			.attr("x", 60)
			.attr("y", function (d) { return (d.get("children").length*10+50 > 50) ? 
					d.get("children").length*10+50 : 50; });
	},
	
	scramble: function () {
		var lay = this;
		console.log("scrambling");
		this.nodes
			.transition(1000)
			.attr("x", function () { return Math.floor(Math.random()*($(window).width()-300-lay.sidebar))+150 })
			.attr("y", function () { return Math.floor(Math.random()*($(window).height()-300))+150 });
	},
		
		/* -------------------------------------------------- */
	
	setbuffer: function() {
		w = $(window).width();
		h = $(window).height();
		
		if (w >= h) {
			buffer = h/5;
			r = Math.round(buffer/10);
		}
		else {
			buffer = w/5;
			r = Math.round(buffer/10);
		}
		
		xmin = buffer;
		xmax = (w-buffer-this.sidebar);
		ymax = h-buffer*1.5;
		ymin = buffer;
	}
  });

  // Return the module for AMD compliance.
  return Cartofolio;

});
