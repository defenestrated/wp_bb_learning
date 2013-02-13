// Project module
define([
	// Application.
	"app"
],

// Map dependencies from above array.
function(app) {

	// Create a new module.
	var Project = app.module();


/*------------------- MODEL ------------------*/

	Project.Model = Backbone.Model.extend({
	
		defaults: {
			type: 'default post_type',
			id: 0,
			title: "default title",
			excerpt: "default excerpt",
			content: "default content",
			thumbnail: "default thumb",
			images: "default images",
	
			date: "default date",
			hours: "default hours",
			materials: "default materials",
			techniques: "default techniques",
			dimensions: "default dims",
			scale: "default scale",
			reasons: "default reasons"
		},
	
	
	
		initialize: function() {
			var wp_object = this.get('wp_object');
			
			console.log('project "' + wp_object.slug + '" initialized.');
			//console.log(wp_object);
			
			this.set({
				type: wp_object.type,
				id: wp_object.id,
				title: wp_object.title,
				excerpt: wp_object.excerpt,
				content: wp_object.content,
				thumbnail: wp_object.thumbnail,
				images: wp_object.attachments,
				
				date: wp_object.date,
				hours: wp_object.hours,
				materials: wp_object.materials,
				techniques: wp_object.techniques,
				dimensions: wp_object.dimensions,
				scale: wp_object.scale,
				reasons: wp_object.reasons
				
			});
			
			// hup hey
		}
	
		
	
	});





	// Default Collection.
	Project.Collection = Backbone.Collection.extend({
		model: Project.Model,
		
		initialize: function() {
			console.log("project collection initialized - length: " + this.length);
			
		}
		
		
	});
	
	// Default View.  

	Project.Views = {};
	
	/* -------------------- single --------------------- */
	
	Project.Views.Item = Backbone.View.extend({
		template: "project_single",
		className: "solo",
		model: Project.Model,
		manage: true,
			    
		initialize: function () {
			console.log("single view created for " + this.model.get("title"));
			var obj = d3.select("cartofolio_parchment")
			.append("svg")
				.attr("class", "projects");
		}
		
	});
	
	/* --------------------- list ----------------------- */
	
	
	Project.Views.List = Backbone.View.extend({
		className: "project_list",
		el: ".content",
	
		beforeRender: function() {
			var obj = this;
			var count = 0;
			console.log("--------");
			console.log(obj);
			console.log("--------");
			Cartofolio.projects.each(function(item) {
				obj.insertView(new Project.Views.Item({
					model: item,
					id: count
				}));
				count++;
			}, obj);
		},
		
		initialize: function () {
			var obj = this;
		}
		
		
	});
	
	
	/* -------------------------------------------------- */
	
	
	/* -------------------- layout ---------------------- */
	
	Project.Views.Layout = Backbone.Layout.extend({
		
	});
	
	
	
	
	// Return the module for AMD compliance.
	return Project;

});
