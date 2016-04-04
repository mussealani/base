(function($) {

    /**
     * API Documentation:
     * http://v2.wp-api.org/reference/
     *
     * API URLs:
     */

    var baseHref = $('head base').attr('href'),
        // api available after saving permalinks settings
        apiBase = baseHref + 'wp-json/wp/v2/',
        // the add-on menu plugin has a different base
        menuApiBase = baseHref + 'wp-json/wp-api-menus/v2/';


    // create object to hold our RESTapi routes
    var resources = [
        {route: apiBase + "users", className: "User", list: "users"},
        {route: apiBase + "posts", className: "Post", list: "posts"},
        {route: apiBase + "comments", className: "Cemment", list: "comments"},
        {route: apiBase + "pages", className: "Page", list: "pages"},
        {route: apiBase + "media", className: "Media", list: "media"},
        {route: apiBase + "categories", className: "Category", list: "categories"},
        {route: apiBase + "tags", className: "Tag", list: "tags"},
        {route: menuApiBase + "menus", className: "Menu", list: "menus"}
    ];

    var memory = {}, countLoadedResources = 0;
    /*
    * ajax function is the main function that hold jQuery
    * ajax method. this function give us the opportunity
    * to use HTTP methods for RESTfull services like
    * POST, GET, PUT, PATCH and DELETE
    */
    function ajax(url, type, data) {
        // define the default HTTP method
        type = type || 'GET';
        var res = $.ajax({
            url: url,
            type: type,
            data: data
        });

        // if the request success will call the callback function
        res.success(function(data) {
          resources.forEach(function(resource) {
            memory[resource.list] = data;
            countLoadedResources++;

            if (countLoadedResources == resources.length) {

               classify();
            }


          });
        });
        // if failed dispaly the error details
        res.fail(function(err) {
          console.error('response err', err.status);
        });
    }



    function classify() {
        for(var listName in memory) {

            var list = memory[listName];
            var className;
            resources.forEach(function(resource) {
                if (listName == resource.list) {
                    className = resource.className;
                }
            });


          var classObj = classMemory[className];

          // A map loop through the array of objects
          // and replace with "classified" objects
          // (i.e. objects that have a certain prototype)
          // Replace the old list with the new one in the
          // memory variable
          memory[listName] = list.map(function(listItem){
            // return classObj.extend(listItem);

          });
        }
    }
    resources.forEach(function(resource) {

      ajax(resource.route, null, null);

    });


})(jQuery);




    //  // get the data from REST routes and store it in memory object
    //  var memory = {}, countLoadedResources = 0;


    // initApi.resources.forEach(function(resource) {
    //     initApi.ajax(resource.route, null, null, function(data) {
    //         memory[resource.list] = data;
    //         countLoadedResources++;
    //         if (countLoadedResources == initApi.resources.length) {

    //            classify();
    //         }
    //     });
    // });



    // function classify() {
    //     for(listName in memory) {

    //         var list = memory[listName];
    //         var className;
    //         initApi.resources.forEach(function(resource) {
    //             if (listName == resource.list) {
    //                 className = resource.className;
    //             }
    //         });


    //       var classObj = classMemory[className];

    //       // A map loop through the array of objects
    //       // and replace with "classified" objects
    //       // (i.e. objects that have a certain prototype)
    //       // Replace the old list with the new one in the
    //       // memory variable
    //       memory[listName] = list.map(function(listItem){
    //         return classObj.extend(listItem);

    //       });
    //     }
    // }











