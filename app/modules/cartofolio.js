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
  
  Cartofolio.projects = new Project.Collection();
  

  // Default View.
  
  Cartofolio.Views = {};
  
  
  Cartofolio.Views.Layout = Backbone.Layout.extend({
  
    template: "cartofolio",
	className: "cartofolio_parchment",
	tagName: "svg",
	
	projectgroup: {},
	parchment: {},
	w: $(this).width(),
	h: $(this).height(),
	firstRender: true,
	sidebar: 100,
	r: 20,
	s: 2*this.r/150,
	maptype: "random",
	
	padding: 7,
	fadetime: 1000,
	
	
	afterRender: function() {
      var cmp = this;
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
		
		Cartofolio.projects.on("create", function (wrapper) {
			console.log("cartfolio project created, wrapped with " + wrapper.tn + "." + wrapper.cn);
			projectgroup = new Project.Views.List({
				className: wrapper.cn,
				tagName: wrapper.tn
			})
			app.layouts.carto.insertView(projectgroup);
		});
		
		Cartofolio.projects.on("add", function(model) {
				
			console.log(model.attributes.title + " calling from on(add)");
			
			var item = new Project.Views.Item({model: model});
			projectgroup.insertView(item);
		});
		
	},
	
	/* ----------------------- d3 setup ------------------------ */
	setup_d3: function () {
	
		parchment = d3.select(".cartofolio_parchment");
		this.setbuffer();
		
		console.log(Cartofolio.projects);
		parchment.select(".projects").selectAll(".node")
				.data(Cartofolio.projects.models)
			.enter().append("text")
				.attr("class", "node")
				.text(function (d) {
					return d.attributes.date + " |----| ";
				});
		/* ------------------- scales --------------------- */
		
		
		var format = d3.time.format("%Y-%m-%d %H:%M:%S");
		var formatDate = function(d) {
			return format.parse( d.date );
		}	
/*
		var x = d3.time.scale()
		        .domain(d3.extent(Cartofolio.projects, function(d) { return format.parse(d.date); }))
		        .nice(d3.time.year)
		        .range([xmin, xmax]);
		
		var y = d3.scale.linear()
				.domain(d3.extent(Cartofolio.projects, function(d) { return d.hours; }))
				.range([ymax, ymin])
				.nice();
*/		

		
		
		var ux = function(x){
			return (x)/s-75;
		}
		var uy = function(y){
			return (y)/s-75;
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
