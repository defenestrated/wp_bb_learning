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
  
  Cartofolio.projects = new Project.Collection();

  // Default Model.
  Cartofolio.Model = Backbone.Model.extend({
  
  });


  // Default View.
  
  Cartofolio.Views = {};
  
  
  Cartofolio.Views.Layout = Backbone.Layout.extend({
  
    template: "cartofolio",
	className: "cartofolio_parchment",
	keep: true,
	
	initialize: function () {
		console.log("cartofolio layout initialized.");
		console.log(this);
		
		
		Cartofolio.projects.on("add", function(model) {
				
			console.log(model.attributes.title + " calling from on(add)");
			
			var item = new Project.Views.Item({model: model});
			app.layouts.carto.insertView(item);
		});

	}
  });

  // Return the module for AMD compliance.
  return Cartofolio;

});
