var initApi = (function($) {

    // cache dom
    var $body = $('body'),
        $container = $('<div class="container"/>'),
        $row = $('<div class="row"/>'),
        $featuredImg = $('<figure/>'),
        $next = $('<div data-dir="next"><span class="glyphicon glyphicon-menu-right"></span>Next</div>'),
        $prev = $('<div data-dir="prev"><span class="glyphicon glyphicon-menu-left"></span>Prev</div>');


    $container.prepend($row);
    $featuredImg.prependTo($body);
    $container.appendTo($body);
    var arrows = $body.find($featuredImg);
    $featuredImg.append($next);
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
        menuApiBase = baseHref + 'wp-json/wp-api-menus/v2/',
        perPage = 5,
        paged = 1;



    // create object to hold our RESTapi routes
    var resources = [
        // {
        //     route: apiBase + "users/?per_page=100",
        //     className: "User",
        //     type: "user",
        //     list: "users"
        // },
        {
            route: apiBase + 'posts?filter[posts_per_page]=' + perPage + '&filter[paged]=' + paged,
            className: "Post",
            type: "post",
            list: "posts"
        },
        // {
        //     route: apiBase + "comments",
        //     className: "Comment",
        //     type: "comment",
        //     list: "comments"
        // },
        {
            route: apiBase + "pages",
            className: "Page",
            type: "page",
            list: "pages"
        },
        // {
        //     route: apiBase + "media",
        //     className: "Media",
        //     type: "media",
        //     list: "media"
        // },
        // {
        //     route: apiBase + "categories",
        //     className: "Category",
        //     type: "category",
        //     list: "categories"
        // },
        // {
        //     route: apiBase + "tags",
        //     className: "Tag",
        //     type: "tag",
        //     list: "tags"
        // },
        {
            route: menuApiBase + "menus",
            className: "Menu",
            type: "menu",
            list: "menus"
        }
    ];




    /*
     * ajax method is the main method that hold jQuery
     * ajax method. this method give us the opportunity
     * to use HTTP methods for RESTfull services like
     * POST, GET, PUT, PATCH and DELETE
     */
    function ajax(url, type, data, callBack) {
        // define the default HTTP method
        type = type || 'GET';
        // assign jQuery ajax method to res variable
        var res = $.ajax({
            url: url,
            type: type,
            data: data
        });
        // if the request success will call the callback function
        res.success(function(data) {
            callBack(data);
        });
        // if failed dispaly the error details
        res.fail(function(err) {
            console.error('response err', err.status);
        });
    };


    // create memory object to hold all that we'll get from resources
    var memory = {},
        countLoadedResources = 0;

    resources.forEach(function(resource) {
        ajax(resource.route, null, null, function(data) {
            memory[resource.list] = data;
            countLoadedResources++;
            if (countLoadedResources == resources.length) {

                classify();
            }

        });
    });

    var resourceByType = {},
        resourcesByList = {};
    for (i in resources) {
        resourceByType[resources[i].type] = resources[i];
        resourcesByList[resources[i].list] = resources[i];
        //console.log('by type ', resourceByType , 'by list', resourcesByList);
    }

    function classify() {
        for (listName in memory) {
            var list = memory[listName];
            var className = resourcesByList[listName].className;

            var classObj = appBuilder.classMemory[className];



            // A map loop through the array of objects
            // and replace with "classified" objects
            // (i.e. objects that have a certain prototype)
            // Replace the old list with the new one in the
            // memory variable
            if (list.push) { // array, classify each item
                memory[listName] = list.map(function(listItem) {
                    return classObj.extend(listItem);
                });
            } else { // object, classify it
                memory[listName] = classObj.extend(list);
            }
            //console.log('memory.' + listName, memory[listName]);
        }
    };



    return {

        apiBase: apiBase,
        menuApiBase: menuApiBase,
        resources: resources
    }

})(jQuery);
