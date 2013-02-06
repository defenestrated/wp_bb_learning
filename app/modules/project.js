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
		console.log("model initialized");
		$.post("http://localhost/learning/wordpress/?json=get_page_index", function(data) {
			console.log(data);
			//you could do anything you want with the data here
		});
	}

	

});





  // Default Collection.
  Project.Collection = Backbone.Collection.extend({
	model: Project.Model
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
