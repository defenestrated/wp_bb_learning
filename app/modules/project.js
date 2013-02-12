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
			
			console.log('project "' + wp_object.slug + '" initialized:');
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
			
			console.log(this.attributes);
			//new Project.Views.Item;
			// hup hey
		}
	
		
	
	});





	// Default Collection.
	Project.Collection = Backbone.Collection.extend({
		model: Project.Model,
		
		initialize: function() {
			console.log("project collection initialized");
			
		}
		
		
	});
	
	// Default View.  
	
	var Views = {};
	
	/* ------------------ single ------------------- */
	
	Views.Item = Backbone.View.extend({
	
		template: "project_single",
		className: "solo",
		
		
		initialize: function () {
			console.log("single layout created");
			this.model.on('change', this.render, this);
		}
		
	});
	
	
	/* -------------------- list -------------------- */
	
	Views.List = Backbone.View.extend({
		
		className: "list",
		
		initialize: function () {
			console.log("list view added");
		}
	});
	
	Project.Views.Layout = Backbone.Layout.extend({
		template: "project",
		className: "projects",
		
		initialize: function () {
			console.log("initialized project view layout");
		}
	});
	
	
  
  
	
	
	// Return the module for AMD compliance.
	return Project;

});
