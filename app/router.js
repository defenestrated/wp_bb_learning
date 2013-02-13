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

	  		
	  		
	  		app.numprojects = 0;

			
			
			
			

			console.log("router initializing...");

			
			Router.getPosts(function (data) {
				app.layouts.carto = new Cartofolio.Views.Layout({});
				app.layouts.main.setView(".content", app.layouts.carto);
				app.layouts.main.render();
				
				var wrapper = {
					cn: "projects",
					tn: "g"
				};
				
				Cartofolio.projects.trigger("create", wrapper);
				
				_.each(data.posts, function(post) {
					app.numprojects++;
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

		console.log("index route called.");

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
			console.log("==== get posts: operating locally ====");

			$.post("http://localhost/learning/wordpress/?json=get_recent_posts&post_type=project&count=0", function(data) {
				callback(data);
			});
		}

		else {
			// we're live!
			console.log("==== get posts: operating online ====");

			$.post("../wordpress/?json=get_recent_posts&post_type=project&count=0", function(data) {
				callback(data);
			});
		}

	};

  return Router;

});
