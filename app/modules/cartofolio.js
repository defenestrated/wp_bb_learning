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
		"click circle#test": "test"
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
	
	test: function () { console.log("works!"); },
	
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

		var testbutton = this.parchment.append("g")
				.attr("class", "controls");
				
		testbutton.append("circle")
				.attr("class", "link")
				.attr("id", "test")
				.attr("r", lay.bR)
				.attr("cx", lay.w-lay.bR*2)
				.attr("cy", lay.bR*2)
				.attr("stroke", "black")
				.attr("fill", "rgba(0,0,0,0)")
				.attr("stroke-width", "2pt");
		testbutton.append("text")
				.attr("class", "link")
				.attr("id", "test")
				.text("test!")
				.attr("x", lay.w-lay.bR*2)
				.attr("y", lay.bR*2)
				.attr("dy", ".35em");

		this.parchment.selectAll(".node")
				.data(Cartofolio.elders.models)
			.enter().append("text")
				.attr("class", "node")
				.attr("x", 60)
				.attr("y", function (d) { return d.get("hours"); })
				.attr("width", 100)
				.attr("height", 50)
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
		        .range([xmin, xmax]);
		
		lay.y = d3.scale.linear()
				.domain(d3.extent(Cartofolio.projects.models, function(d) {
					return d.get("hours");
				}))
				.range([ymax, ymin])
				.nice();
*/
	

		
		
		lay.ux = function(x){
			return (x)/lay.s-75;
		}
		lay.uy = function(y){
			return (y)/lay.s-75;
		}

		
		/* -------------------------------------------------- */
		
		
		
	},
	
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
