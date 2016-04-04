var appBuilder = (function($) {

    // cache dom
    var $section = $('<section/>');



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

    classMemory.Post = classMemory.BaseWP.extend({});


    classMemory.Page = classMemory.Post.extend({});

    classMemory.Menu = classMemory.BaseWP.extend({});




    return {
        classMemory: classMemory,

    }

})(jQuery);
