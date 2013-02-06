// Category module
define([
  // Application.
  "app",

  //Views
  "modules/helpers/category"
],

// Map dependencies from above array.
function(app, Category) {

  // Create a new module.
  var Post = app.module();

  //======= MODEL =======

  Post.Model = Backbone.Model.extend({
    defaults: {
      type: 'post',
      id: 0,
      title: "",
      date: "",
      excerpt: "",
      content: "",
      categories: "",
      thumbnail: "",
      images: ""
    },

    initialize: function() {
      var wp_object = this.get('wp_object');
/*       console.log(wp_object); */

      //set array of categories
      var categoryCollection = [];
      _.forEach(wp_object.categories, function(category) {
        categoryCollection.push(category.slug);
      });
      categoryCollection.push("all");

      //create date object
      var dateArray = wp_object.date.split(/[\s:\-]+/);
      var date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5], 0);

      //preload thumbnail
      var thumbnail = new Image();
      thumbnail.src = wp_object.thumbnail;
      var featuredUrl = wp_object.thumbnail.replace("-150x150", "");

      this.set({ id: wp_object.id, title: wp_object.title, date: date, excerpt: wp_object.excerpt, content: wp_object.content, categories: categoryCollection, thumbnail: thumbnail, images: wp_object.attachments, featuredSrc: featuredUrl});
/*       console.log(this); */
/*      console.log("Post.Model initialized"); */
    },

    destroy: function() {
      this.trigger("destroy");
    }
  });

  //======= COLLECTION =======

  Post.Collection = Backbone.Collection.extend({
    model: Post.Model,

    initialize: function() {
/*      console.log("Post.List initialized"); */
      this.bind("add", this.modelAdd);

      this.comparator = function(post) {
        return -post.get('date').getTime();
      };
    },

    modelAdd: function( model ){
/*       console.log(model); */
/*       console.log("Post.List:  added model:  " + model.get("id")); */
    }
  });

  //======= VIEWS =======

  var Views = {};

//heres' where views go

  Post.Views = Views;

  // Return the module for AMD compliance.
  return Post;

});
