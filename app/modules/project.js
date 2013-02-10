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
		type: 'post',
		id: 0,
		title: "",
		excerpt: "",
		content: "",
		categories: "",
		thumbnail: "",
		images: "",

		date: "",
		hours: "",
		materials: "",
		techniques: "",
		dimensions: "",
		scale: "",
		reasons: ""
	},



	initialize: function() {
		var wp_object = this.get('wp_object');
		
		console.log('project "' + wp_object.slug + '" initialized');
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
  
  Project.Views.Layout = Backbone.Layout.extend({
    template: "project",
    className: "projects",
    
    initialize: function () {
    	console.log("initialized project view layout");
    }
  });
  
  Project.Views.Item = Backbone.Layout.extend({
	 template: "project_single"
  });
  
  app.layouts.project = new Project.Views.Layout({});




  // Return the module for AMD compliance.
  return Project;

});
