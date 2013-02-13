define([
  // Application.
  "app",
  "modules/cartofolio"
],

function(app, Cartofolio) {

  // Defining the application router, you can attach sub routers here.
	var Router = Backbone.Router.extend({

		initialize: function () {

			app.layouts.main = new Backbone.Layout({
		  		template: "main",
		  		el: "#main"
	  		});

	  		app.layouts.main.render();


			app.layouts.carto = new Cartofolio.Views.Layout({});
			app.layouts.main.setView(".content", app.layouts.carto).render();
			

			console.log("router initializing...");


			Router.getPosts(function (data) {
				
				_.each(data.posts, function(post) {
					Cartofolio.projects.add({wp_object: post});
				});
				
			});



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
		//app.layouts.main.setView(".content", app.layouts.project).render();
	},

	loadData: function () {
		console.log("sup, i'm the data function");
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

		var localcheck = document.URL.search("samgalison.com");
		//console.log("url: " + document.URL + " - samgalison.com at pos. " + localcheck);
		if (localcheck == -1) {
			// we're not on the web
			console.log("---- operating locally ----");

			$.post("http://localhost/learning/wordpress/?json=get_recent_posts&post_type=project&count=0", function(data) {
				callback(data);
			});
		}

		else {
			// we're live!
			console.log("---- operating online ----");

			$.post("../wordpress/?json=get_recent_posts&post_type=project&count=0", function(data) {
				callback(data);
			});
		}

	};

  return Router;

});
