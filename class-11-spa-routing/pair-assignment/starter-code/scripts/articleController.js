(function(module) {
  var articlesController = {};
  Article.createTable();
  // DONE: Create the `articles` table when the controller first loads,
  //  with the code that used to be in index.html:

  articlesController.index = function() {
    Article.fetchAll(articleView.initIndexPage);
    // DONE: Complete this function that kicks off the fetching and rendering
    //  of articles, using the same
    //  code that used to be in index.html:
    $('main > section').hide();
    $('#articles').show();
  };

    // DONE: But wait! There's more: Also be sure to hide all the main section
    //  elements, and reveal the articles section:

  module.articlesController = articlesController;
})(window);
