var initApi = (function($) {
    /*
    * ------------------------------------------------
    * LAST VERSION
    * **********************************************
    */

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
        //{route: apiBase + "users", className: "User", list: "users"},
        { route: apiBase + "posts", className: "Post", list: "posts" },
        { route: apiBase + "comments", className: "Comment", list: "comments" },
        { route: apiBase + "pages", className: "Page", list: "pages" },
        { route: apiBase + "media", className: "Media", list: "media" },
        { route: apiBase + "categories", className: "Category", list: "categories" },
        { route: apiBase + "tags", className: "Tag", list: "tags" },
        { route: menuApiBase + "menus", className: "Menu", list: "menus" }
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

    // return ajax method and resources property to be available "global"
    return {
        ajax: ajax,
        resources: resources,
        homeUrl: baseHref
    }

})(jQuery);









(function($) {
    $(function() {


        // bootstrap navbar
        var $blog = $('.blog'),
            // $header = $('<header/>'),
            // $nav = $('<nav class="main-nav navbar navbar-inverse"/>'),
            // $navContainer = $('<div class="container"/>'),
            // $navUlList = $('<ul class="navItems"/>'),
            // $navItems = $('<li><a class="go-back-link active"><h1>wpREST</h1</a></li>' + '<li class="go-back-link"><a>HOME</a></li>'),

            // cache dom
            $container = $('.content'),
            $contentHolder = $('<ul/>'),
            $thisLinks = $container.find('.click'),
            $linkAttr = $(this).attr('data-id');

        // attach site header to the dom
        // var mainHeader = $header.append($nav);
        //     $nav.append($navContainer);
        //       mainHeader.prependTo('.home');
        //     $navContainer.prepend($navUlList);
        //     $navUlList.append($navItems);


        // eventHandler
        $container.delegate('.click', 'click', singlePost);
        $blog.delegate('.single-page', 'click', singlePage);
        $blog.delegate('.go-back-link', 'click', homePage);
        $blog.delegate('.dropdown-submenu a', 'click', findMenu);
        // $blog.delegate('.dropdown-menu .single-page', 'click', singlePage);

        // navbar click events
        function homePage() {
            window.location.href = initApi.homeUrl;
            //location.reload();
        }

        // get the data from REST routes and store it in memory object
        var memory = {},
            countLoadedResources = 0;

        // loop through resources
        initApi.resources.forEach(function(resource) {
            // call ajax method
            initApi.ajax(resource.route, null, null, function(data) {
                memory[resource.list] = data;
                countLoadedResources++;
                if (countLoadedResources == initApi.resources.length) {
                    //  call classify method
                    classify();
                    // call renderPosts method
                    renderPosts();
                    // call categories method
                    categories();
                    // call mediaLocStorage method
                    mediaLocStorage();
                    // call renderPages method
                    renderPages();
                    // call renderMenu method
                    renderMenu();
                    // call renderTags method
                    renderTags();
                }
            });
        });



        function classify() {
            for (listName in memory) {
                var list = memory[listName];
                var className;
                initApi.resources.forEach(function(resource) {
                    if (listName == resource.list) {
                        className = resource.className;
                    }
                });


                var classObj = appBuilder.classMemory[className];

                // A map loop through the array of objects
                // and replace with "classified" objects
                // (i.e. objects that have a certain prototype)
                // Replace the old list with the new one in the
                // memory variable
                memory[listName] = list.map(function(listItem) {
                    return classObj.extend(listItem);

                });
            }
        };


        /*
         * --------------------------------------------------------------------
         * RENDER APPLICATION'S CONTENT
         * --------------------------------------------------------------------
         */
        // call post render method
        function renderPosts() {
            // assign posts object to a variable
            var posts = memory.posts;
            // loop through posts object
            for (var i = 0; i < posts.length; i++) {
                // call render method
                memory.posts[i].render();
            };
        }

        // call displaySinglePost() method to dispaly full post
        function singlePost() {
            // get post id from data-id attr
            var dataId = $(this).attr('data-id');
            // assign posts object to a variable
            var posts = memory.posts;
            // loop through posts object
            for (var i = 0; i < posts.length; i++) {
                // get post id:s from posts object
                var postId = memory.posts[i].id;
                // check if we have the same post id that came form data-id attr
                if (dataId == postId) {
                    // call displaySinglePost method
                    memory.posts[i].dispalySinglePost();
                }
            }
        };

        // call categories render method
        function categories() {
            // assign categories object to a variable
            var categories = memory.categories;
            // loop through categories
            for (category in categories) {
                // call categories render method
                memory.categories[category].render();
                //console.log(memory);
            }
        };

        // save post id and posts image url to LocalStorage
        function mediaLocStorage() {
            // assign media object to a variable
            var mediaObj = memory.media,
                // create an empty object
                mediaLinks = {};
            // loop through media object
            for (var i = 0; i < mediaObj.length; i++) {

                if (mediaLinks[mediaObj[i].post] == mediaObj.post) {
                    // assign object keys and values
                    // "the key will be the post id, and the value will be the image link"
                    mediaLinks[mediaObj[i].post] = mediaObj[i].source_url;
                }
            }
            // save the object in local storage
            storage.write('postImg', mediaLinks);
        };

        function renderPages() {
            var pages = memory.pages;
            for (page in pages) {
                // call page render method
                memory.pages[page].render();
            }
        };

        function singlePage() {
            // get page id from data-id attr
            var dataId = $(this).attr('data-id');
            // assign pages object to a variable
            var pages = memory.pages;
            // loop through pages object
            for (var i = 0; i < pages.length; i++) {
                // get page id:s from pages object
                var postId = memory.pages[i].id;
                // check if we have the same page id that came form data-id attr
                if (dataId == postId) {
                    // call displayPage method
                    memory.pages[i].dispalyPage();
                }
            }
        };

        function renderMenu() {
            memory.menus.forEach(function(names) {
                names.render();
            });
        };

        function renderTags() {
            var tags = memory.tags;
            for (var i = 0; i < tags.length; i++) {
                memory.tags[i].render();
            }
        };

        function findMenu(event) {
            event.preventDefault();
            event.stopPropagation();
            // $(this).parent().siblings().removeClass('open');

            var $thisLink = $(this).closest('li').find('.dropdown-menu');

            // if (event.type == 'mouseover') {
            if ($thisLink.find('li').length < 1) {

                //console.log('this is data-url' + $(this).attr('data-url'));
                var $menueUrl = $(this).attr('data-url');
                initApi.ajax($menueUrl, null, null, function(menu) {

                    $thisLink.closest('.dropdown-submenu').find('span').attr('class', 'triangle glyphicon glyphicon-triangle-bottom');
                    var items = menu.items;

                    for (i in items) {
                        //console.log(items[item].title);
                        $thisLink.append('<li><a class="single-page" data-id="' + items[i].object_id + '">' + items[i].title + '</a></li>');
                        // console.log($thisLink.find('li').length);
                    }
                });

                $thisLink.css({
                    position: 'absolut',
                    left: '100px'
                });
            }
            $(this).parent().siblings().removeClass('open');
            $(this).parent().toggleClass('open');
        }
    });
})(jQuery)
