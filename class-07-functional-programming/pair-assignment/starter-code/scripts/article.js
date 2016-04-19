// TODO: Wrap the entire contents of this file in an IIFE.
// Pass in to the IIFE a module, upon which objects can be attached for later access.
(function(module) {
  var article = {};
  article.property = 'property';


function Article (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

Article.loadAll = function(dataPassedIn) {
  dataPassedIn.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  // DONE: Refactor the forEach code below using `.map()` -  since what we are
  // trying to accomplish is the transformation of one colleciton into another.

  // dataPassedIn.forEach(function(ele) {
  //   Article.all.push(new Article(ele));
  // })
  Article.all = dataPassedIn.map(function(ele) {
    return new Article(ele);
  });
};

// This function will retrieve the data from either a local or remote source,
// and process it, then hand off control to the View.

// TODO: Refactor the Article.fetchAll method, and provide it with a parameter of a callback
// function (for now just a placeholder, but to be referenced at call-time as a "view" function)
// that will execute once the loading of articles is done. We do this because we might want
// to call other view functions, and not just the initIndexPage() that we are replacing.
// Now, instead of calling articleView.initIndexPage(), we can just run our callback.
Article.fetchAll = function(callback) {
  if (localStorage.hackerIpsum) {
    $.ajax({
      type: 'HEAD',
      url: '/data/hackerIpsum.json',
      success: function(data, message, xhr) {
        var eTag = xhr.getResponseHeader('eTag');
        if (!localStorage.eTag || eTag !== localStorage.eTag) {
          localStorage.eTag = eTag;
          Article.getAll();
        } else {
          Article.loadAll(JSON.parse(localStorage.hackerIpsum));
          callback();
        }
      }
    });
  } else {
    Article.getAll();
  }
};

Article.getAll = function() {
  $.getJSON('/data/hackerIpsum.json', function(responseData) {
    Article.loadAll(responseData);
    localStorage.hackerIpsum = JSON.stringify(responseData);
    articleView.initIndexPage();
  });
};

// DONE: Chain together a `map` and a `reduce` call to get a rough count of all words in all articles.
Article.numWordsAll = function() {
  return Article.all.map(function(article) {
    return article.body.match(/\b\w+/g).length; // Grab the words from the `article` `body` (hint: lookup String.prototype.match() and regexp!).
  })
  .reduce(function(a, b) {
    return a + b;// Sum up all the values!
  });
};

// TODO: Chain together a `map` and a `reduce` call to produce an array of unique author names.
Article.allAuthors = function() {
  return Article.all.map(function(article) {
    return article.author;
  })    // map our collection
     // return just the author names
    .filter(function removeDuplicate(value, index, array) {
      return array.indexOf(value) == index;
    });
    // For our `reduce` that we'll chain here -- since we are trying to return an array, we'll need to specify an accumulator type...
    // what data type should this accumulator be and where is it placed?
};

Article.numWordsByAuthor = function() {
  // TODO: Transform each element into an object with 2 properties: One for
  // the author's name, and one for the total number of words across the matching articles
  // written by the specified author.
  return Article.allAuthors().map(function(author) {
     var chris = {
      // name:
      name: author,
      // numWords: someCollection.filter(function(curArticle) {
      numWords: Article.all.filter(function(curArticle) {

        if (curArticle.author == author) {
          return curArticle;
        }
      }).map(function(curArticle) {
          return curArticle.body.match(/\b\w+/g).length;
        })
          .reduce(function(a, b) {
           return  a + b;
           })
      }
      console.log(chris);
      return chris;
    });
      //  what do we return here to check for matching authors?
      // })
      // .map(...) // use .map to return the author's word count for each article (hint: regexp!).
      // .reduce(...) // squash this array of numbers into one big number!
    };

module.Article = Article;

}) (window);
