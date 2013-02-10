define([
  // Application.
  "app",
  "modules/project"
],

function(app, Project) {

  // Defining the application router, you can attach sub routers here.
	var Router = Backbone.Router.extend({
		
		initialize: function () {
		
			Router.getPosts(function () {
				// nothing needed here
			});
		
			app.layouts.main = new Backbone.Layout({
	  		template: "main",
	  		el: "#main"
			});
			
			app.layouts.main.render();
		},
		
	routes: {
		"test/:command": "testCmd",
		"test": "test",
		"projects": "projects",
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
	
	projects: function () {
		console.log("you're on the project route");
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
  
	Router.getPosts = function(callback) {
		plib = new Project.Collection();
		
		$.post("http://localhost/learning/wordpress/?json=get_recent_posts&post_type=project&count=0", function(data) {
			console.log(data);
			_.each(data.posts, function(post) {
				plib.add({wp_object: post});
			});
		});
	};

  return Router;

});
