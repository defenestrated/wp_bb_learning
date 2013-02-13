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

  // pull in the project collection:
  Cartofolio.projects = new Project.Collection();

  // Default View.
  
  Cartofolio.Views = {};
  
  Cartofolio.Views.Layout = Backbone.Layout.extend({
  
    template: "cartofolio",
	className: "cartofolio_parchment",
	
	beforeRender: function () {
		
		// make this NOT be undefined   vv
		
		console.log(this.collection);
	},
	
	initialize: function () {
		console.log("cartofolio initialized.");
		
		Cartofolio.projects.on("add", function(model) {
				
			console.log(model.attributes.title + " calling from on(add)");
			
			var itemView = new Project.Views.Item({
				model: model
			});
			
			app.layouts.carto.insertView(".singleproject", itemView).render();
		});

	}
  });

  // Return the module for AMD compliance.
  return Cartofolio;

});
