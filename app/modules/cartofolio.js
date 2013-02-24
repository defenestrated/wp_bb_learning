// Cartofolio module
define([
  // Application.
  "app",
  "modules/project",
  "modules/controls"
],

// Map dependencies from above array.
function(app, Project, Controls) {

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
	w: '',
	h: '',
	x: '', y: '', ux: '', uy: '', xmin: '', ymin: '', xmax: '', ymax: '', axes: '', leader: '',
	firstRender: true,
	sidebar: 100,
	r: 20,
	s: 0,
	maptype: "random",
	nodes: [],
	force: '',
	gravity: '',
	tick: '',
	collide: '',
	
	padding: 7,
	fadetime: 1000,
	
	bR: 30, // button radius
	
	
	projects: [ 
			{ "name" : "bellflower", "date" : "12/12/12", "img" : "icon-01", "hours" : 80 },
			{ "name" : "dissolve", "date" : "1/2/12", "img" : "icon-02", "hours" : 14.5 },
			{ "name" : "clownhome", "date" : "8/4/10", "img" : "icon-03", "hours" : 0.25 },
			{ "name" : "pentacup", "date" : "9/1/10", "img" : "icon-04", "hours" : 4 },
			{ "name" : "plusdores", "date" : "4/6/07", "img" : "icon-05", "hours" : 30 },
			{ "name" : "pelogo", "date" : "3/14/11", "img" : "icon-06", "hours" : 13 },
			{ "name" : "alanmiller", "date" : "1/5/13", "img" : "icon-07", "hours" : 20 },
			{ "name" : "lostshores", "date" : "9/10/11", "img" : "icon-08", "hours" : 40 },
			{ "name" : "joeljeske", "date" : "5/13/12", "img" : "icon-09", "hours" : 35 },
			{ "name" : "faq", "date" : "10/9/11", "img" : "icon-10", "hours" : 2 }		
	],
	
	
	format: '', // to hold date formatting
	
	ux: function(x){
			return (x)/this.s-75;
		},
		
	uy: function(y){
			return (y)/this.s-75;
		},
	
	// !events
	events: {
		"click #random" : "arrange"
	},
	
	afterRender: function() {
	 	var lay = this;
	
      if (lay.firstRender) {
        lay.firstRender = false;
        
        Cartofolio.elders = new Project.Collection (_(Cartofolio.projects.models).filter(function (model) {
			return model.get("parent") == 0;
		}), {name:"elder projects only"});
		
		console.log("elders models:");
		console.log(_(Cartofolio.elders.models).map(function (model) {
			return model.get("title");
		}));
        
        
        
        lay.w = $(window).width();
		lay.h = $(window).height();
		lay.s = 2*lay.r/150;
		lay.format = d3.time.format("%Y-%m-%d %H:%M:%S");
		lay.setbuffer();
        
        
        
        lay.d3_dom();
        lay.setup_d3();
        
        Cartofolio.projects.bind("all", lay.d3_update);
        
        var rtime = new Date(1, 1, 2000, 12,00,00);
		var timeout = false;
		var delta = 200;
		$(window).resize(function() {
		    rtime = new Date();
		    if (timeout === false) {
		        timeout = true;
		        setTimeout(resizeend, delta);
		    }
		});
		
		function resizeend() {
		    if (new Date() - rtime < delta) {
		        setTimeout(resizeend, delta);
		    } else {
		        timeout = false;
		/*         console.log("window: " + $(window).width() + ", " + $(window).height()); */
		        lay.arrange("random");
		    }               
		}
        
        
      }
    },
	
	
	/*  !cartofolio init  */
	
	initialize: function () {
		_.bindAll(this);
		
		console.log("cartofolio layout initialized.");		
		console.log(this);
		
		var projectsgroup;
		
		/*
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
*/
		
		


		
		
	},
	
	
	d3_dom: function() {
		var lay = this;

		lay.parchment = d3.select(".cartofolio_wrapper").append("svg")
			.attr("class", "parchment")
			.attr("width", "100%")
			.attr("height", "100%")
			;
		
		// !buttons
		
		var Bscramble = this.parchment.append("g")
				.attr("class", "link")
				.attr("id", "random")
				;
		
		Bscramble.append("text") // button text
				.attr("class", "link")
				.text("scramble")
				.attr("x", lay.w-lay.sidebar)
				.attr("y", this.parchment.selectAll("text.link")[0].length*40);
		
		Bscramble.insert("ellipse", "text") //background circle
				.attr("class", "link")
				.attr("rx", function () { return Bscramble.select("text")[0][0].clientWidth*3/4; })
				.attr("ry", 20)
				.attr("cx", lay.w-lay.sidebar)
				.attr("cy", this.parchment.selectAll("text.link")[0].length*40)
				.attr("stroke", "black")
				.attr("stroke-width", "2pt");
			
			
		
		Cartofolio.elders.models.forEach(function(d, i) {
			d.x = $(window).width()/2;
			d.y = $(window).height()/2;
			d.x0 = $(window).width()/2;
			d.y0 = $(window).height()/2;
			d.r = lay.r;
		});
		
		// !force
		
		lay.force = d3.layout.force()
			.nodes(Cartofolio.elders.models)
			.on("tick", lay.tick)
			.gravity(0)
			.friction(0.9)
			.start();
			
			
		// !nodes
					
		
		lay.node = lay.parchment.selectAll(".node")
				.data(Cartofolio.elders.models)
			.enter().append("g")
				.attr("class", "node")
				.call(lay.force.drag);
				
		
		lay.node.append("circle")
			.attr("class", "orbcircle")
			.attr("r", lay.r)
			;
			
		lay.node.append("clipPath")
					.attr("id", function(d) { return d.get("slug"); })
				.append("circle")
					.attr("class", "orbclip")
					.attr("r", lay.r)
					;
					
		lay.node.append("g")
					.attr("class", "clip_group")
					.attr("clip-rule", "nonzero")
					.attr("id", function(d) { return d.get("slug") + "_to_clip"; })
					.attr("clip-path", function(d) { return "url(#" + d.get("slug") + ")"; })
				.append("image")
					.attr("x", lay.ux(0))
					.attr("y", lay.uy(0))
					.attr("width", 150)
					.attr("height", 150)
					.attr("transform", "scale(" + lay.s + ")")
					.attr("xlink:href", function (d) { return d.get("thumbnail"); })
					;
		d3.selectAll("g.node").on("mouseover", function (d) { 
			var cmp = this;
			lay.force.resume();
			d3.transition().tween(d.r, function() {
				var i = d3.interpolate(d.r, 75);
				return function(t) {
					d.r = i(t);
					d3.select(cmp).select("circle.orbclip").attr("r", d.r);
					d3.select(cmp).select("circle.orbcircle").attr("r", d.r);
				};
			});
			
			
			
			d3.select(cmp).select("g.clip_group").transition().attr("transform", "scale(" + 1/lay.s + ")");
		});
		
		d3.selectAll("g.node").on("mouseout", function (d) { 
			lay.force.resume();
			var cmp = this;
			d3.transition().tween(d.r, function() {
				var i = d3.interpolate(d.r, lay.r);
				return function(t) {
					d.r = i(t);
					d3.select(cmp).select("circle.orbclip").attr("r", d.r);
					d3.select(cmp).select("circle.orbcircle").attr("r", d.r);
				};
			});
			
			d3.select(cmp).select("g.clip_group").transition().attr("transform", "scale(" + 1 + ")");
		});
	},
	
	setup_d3: function () {
		
	}, // end d3_setup	
	
	// !force fn's
	tick: function(e) {
		var lay = this;
	    lay.node.each(lay.gravity(e.alpha * 0.7))
	        .each(lay.collide(0.5))
	        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	        ;
	},
	
	gravity: function(k) {
	    return function(d) {
	      d.x += (d.x0 - d.x) * k;
	      d.y += (d.y0 - d.y) * k;
	    };
	},
	  
	collide: function(k) {
		var lay = this;
		var q = d3.geom.quadtree(Cartofolio.elders.models);
	    return function(node) {
	      var nr = node.r + lay.padding,
	          nx1 = node.x - nr,
	          nx2 = node.x + nr,
	          ny1 = node.y - nr,
	          ny2 = node.y + nr;
	      q.visit(function(quad, x1, y1, x2, y2) {
	        if (quad.point && (quad.point !== node)) {
	          var x = node.x - quad.point.x,
	              y = node.y - quad.point.y,
	              l = x * x + y * y,
	              r = nr + quad.point.r;
	          if (l < r * r) {
	            l = ((l = Math.sqrt(l)) - r) / l * k;
	            node.x -= x *= l;
	            node.y -= y *= l;
	            quad.point.x += x;
	            quad.point.y += y;
	          }
	        }
	        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
	      });
	    };
	},
	
	// !sorting fn's
		
	test: function test() { console.log("testing"); },
	
	arrange: function (e) {
		var lay = this;
		var kind = '';
		if (e.currentTarget != undefined) { kind = e.currentTarget.id; }
		else kind = e;
		
		console.log("arranging by " + kind);
		
		lay.setbuffer();
		
		if (kind == "random") {
			Cartofolio.elders.models.forEach(function(d, i) {
				d.x0 = Math.random()*(lay.xmax-lay.xmin) + lay.xmin+1;
				d.y0 = Math.random()*(lay.ymax-lay.ymin) + lay.ymin+1;
				d.r = lay.r;
			});
		}
		
		
		lay.force.resume();
	},
		
		/* -------------------------------------------------- */
	
	
	setbuffer: function() {	
		var lay = this;
		
		lay.w = $(window).width();
		lay.h = $(window).height();
		
		if (lay.w >= lay.h) {
			lay.buffer = lay.h/5;
			lay.r = Math.round(lay.buffer/4);
		}
		else {
			lay.buffer = lay.w/5;
			lay.r = Math.round(lay.buffer/4);
		}
		
		lay.s = 2*lay.r/150;
		lay.xmin = lay.buffer;
		lay.xmax = (lay.w-lay.buffer-lay.sidebar);
		lay.ymax = lay.h-lay.buffer*1.5;
		lay.ymin = lay.buffer;
	}
	
	  });

  // Return the module for AMD compliance.
  return Cartofolio;

});
