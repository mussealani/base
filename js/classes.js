var appBuilder = (function($) {

    // cache dom
    var $section = $('<section/>'),
        $body = $('body'),
        $mainContent = $body.find('.main-content');

        // append section
        $mainContent.append($section);



    // The base object is our "inheritance engine"
    var Base = {
        extend: function(properties) {
            // create a new object with this object as its prototype
            var obj = Object.create(this);
            // add properties to the new object
            Object.assign(obj, properties);
            return obj;
        }
    };


    // // A memory for all "classes"
    var classMemory = {};

    // A base class for all things WordPressish
    classMemory.BaseWP = Base.extend({
        render: function() {}
    });

    classMemory.Post = classMemory.BaseWP.extend({
        renderHome: function() {
            var $article = $('<article class="col-md-6"/>'),
                $featuredImg = $('<figure class="col-md-6"><img src="' + this.featured_img + '" /></figure>'),
                $title = $('<h2>' + this.title.rendered + '</h2>');
                // append post content and title to main article
                $article.append([$title, this.content.rendered ]);


            $section.append([$article, $featuredImg]);
            console.log(this);
        }
    });


    classMemory.Page = classMemory.Post.extend({});

    classMemory.Menu = classMemory.BaseWP.extend({});




    return {
        classMemory: classMemory,

    }

})(jQuery);
