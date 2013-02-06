define([
  // Application.
  "app",
  "modules/project"
],

function(app, Project) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
  	
  	initialize: function () {
  		app.layouts.main = new Backbone.Layout({
	  		template: "main",
	  		el: "#main"
  		});
  		
  		app.layouts.main.render();
  	},
  	
    routes: {
    	"test/:command": "testCmd",
		"test": "test",
		"project": "project",
		"load": "loadData",
		"": "index",
		"*splat": "splatter"
    },
    
    
    testCmd: function (command) {
    	console.log("test command: " + command);
    },
    
    test: function() {
	    console.log("from the test function");
    },
    
    project: function () {
    	console.log("project");
    	app.layouts.main.setView(".content", app.layouts.project).render();
    },
    
    loadData: function () {
    	console.log("sup, i'm the data function");
    	$.post("http://localhost/learning/wordpress/?json=get_page_index", function(data) {
			console.log(data);
			//you could do anything you want with the data here
		});
    },

    index: function() {
    	console.log("heyyyyy! i'm the index function. i get called when the route is ''.");
    },
    
    splatter: function (splat) {
    	console.log("splat");
    	this.navigate("", { trigger: true });
    }
    
  });

  return Router;

});
