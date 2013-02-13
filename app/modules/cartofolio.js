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
	width: "100%",
	height: "100%",
	w: $(this).width(),
	h: $(this).height(),
	firstRender: true,
	sidebar: 100,
	r: 20,
	s: 2*this.r/150,
	
	afterRender: function() {
      var cmp = this;
      if (this.firstRender) {
        this.firstRender = false;
        this.setup_d3();
        //Cartofolio.projects.bind("all", this.d3_update);
      }
    },
	
	initialize: function () {
		_.bindAll(this);
		var pg;
		
		console.log("cartofolio layout initialized.");
		console.log(this);
		
		var projectsgroup;
		
		Cartofolio.projects.on("create", function (wrapper) {
			console.log("cartfolio project created, wrapped with " + wrapper.tn + "." + wrapper.cn);
			pg = new Project.Views.List({
				className: wrapper.cn,
				tagName: wrapper.tn
			})
			app.layouts.carto.insertView(pg);
		});
		
		Cartofolio.projects.on("add", function(model) {
				
			console.log(model.attributes.title + " calling from on(add)");
			
			var item = new Project.Views.Item({model: model});
			pg.insertView(item);
		});
		
	},
	
	setup_d3: function () { /* ------------------- D3 SETUP */
		
		
				
		
		var maptype = "random";
		
		var x, y, xmin, xmax, ymin, ymax,
			axes,
			leader;
		
		var padding = 7;
		
		var fadetime = 1000;
		
		this.setbuffer();
		
		/* ------------------- scales --------------------- */
		
		/*
var format = d3.time.format("%m/%d/%y");
		var formatDate = function(d) {
			return format.parse( d.date );
		}	
		
		var x = d3.time.scale()
		        .domain(d3.extent(Cartofolio.projects, function(d) { return format.parse(d.date); }))
		        .nice(d3.time.year)
		        .range([xmin, xmax]);
		
		var y = d3.scale.linear()
				.domain(d3.extent(Cartofolio.projects, function(d) { return d.hours; }))
				.range([ymax, ymin])
				.nice();
		
		var ux = function(x){
			return (x)/s-75;
		}
		var uy = function(y){
			return (y)/s-75;
		}
*/
		
		/* -------------------------------------------------- */
		
		
		this.parchment = d3.select(".cartofolio_parchment");
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
