(function(module) {
  var aboutController = {};

  aboutController.index = function() {
    $('main > section').hide();
    $('#about').show();
  };
    // DONE: Define a function that hides all main section elements, and then reveals just the #about section:

  module.aboutController = aboutController;
})(window);
