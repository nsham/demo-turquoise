(function ($, $document) {
    var FOUNDATION_CONTENT_LOADED = "foundation-contentloaded",
        FOUNDATION_MODE_CHANGE = "foundation-mode-change",
        FOUNDATION_COLUMN_CHANGE = "coral-columnview-item",
        LAYOUT_LIST_VIEW = "list",
        LAYOUT_CARD_VIEW = "card",
        LAYOUT_COLUMN_VIEW = "column",
        TITLE_COLUMN = "Title",
        ASC = "ascending",
        DAM_ADMIN_CHILD_PAGES = ".cq-damadmin-admin-childpages";

    $document.click(FOUNDATION_COLUMN_CHANGE, startSortColumn);
	$document.on(FOUNDATION_MODE_CHANGE, sortListItems);
    $document.on(FOUNDATION_MODE_CHANGE, sortListItems2);
    //$document.on(FOUNDATION_CONTENT_LOADED, sortListItems2);


    var sortCard = function($articles, isColumn){
        $articles.sort(function(a, b) {
            a = $(a).find($("coral-card-title")).text().toLowerCase();
            b = $(b).find($("coral-card-title")).text().toLowerCase();
            //this piece was copied from underscore.js sortBy
            if (a > b || a === void 0){
                return 1;
            }else if (a < b || b === void 0){
                return -1;
            }

            return 1;
        });

        return $articles;
    };

    var sortColumn= function($articles, isColumn){
        $articles.sort(function(a, b) {
            //console.log( "sortColumn : " + " --> " + $(a).html() + " --- " + $(b).html());
            a = $(a).find($(".foundation-collection-item-title")).text().toLowerCase() + "_" + $(a).find($(".foundation-layout-util-subtletext")).text().toLowerCase();
            b = $(b).find($(".foundation-collection-item-title")).text().toLowerCase() + "_" + $(b).find($(".foundation-layout-util-subtletext")).text().toLowerCase();
            //this piece was copied from underscore.js sortBy
            //console.log( "sortColumn : " + " --> " + a + " --- " + b);
            if (a > b || a === void 0){
                return 1;
            }else if (a < b || b === void 0){
                return -1;
            }

            return 1;
        });

        return $articles;
    };

    function sortListItems(event){
        var $childPage = $(DAM_ADMIN_CHILD_PAGES),
            foundationLayout = $childPage.data("foundation-layout");

        if(_.isEmpty(foundationLayout)){
            return;
        }

        var layoutId = foundationLayout.layoutId;
        if(layoutId == LAYOUT_CARD_VIEW) {
			sortCardView($childPage);
        }else if(layoutId == LAYOUT_COLUMN_VIEW) {
			startSortColumn();
        }else{
			return;
        }
    }


    function sortListItems2(event){
        var $childPage = $(DAM_ADMIN_CHILD_PAGES),
            foundationLayout = $childPage.data("foundation-layout");

        if(_.isEmpty(foundationLayout)){
            return;
        }

        var layoutId = foundationLayout.layoutId;
        if(layoutId == LAYOUT_LIST_VIEW){
			sortListView($childPage);
        }else{
			return;
        }
    }



    function startSortColumn(){

		setTimeout(function() {

            $childPage = $(DAM_ADMIN_CHILD_PAGES);
            sortColumnView($childPage);
        }, 300);
    }

    function sortListView(object){
		var $listViewHead = object.find("thead");

        var $colSpan = $listViewHead.find("coral-table-headercell-content:contains('" + TITLE_COLUMN + "')").filter(function(){
            return ($(this).text() === TITLE_COLUMN);
        });

        var $colSpan2 = $listViewHead.find("th:contains('" + TITLE_COLUMN + "')").filter(function(){
            return ($(this).text() === TITLE_COLUMN);
        });

        if($colSpan2.attr("sortabledirection") != ASC) {
			//console.log("run sorting");
            $colSpan2.closest("th").click();
        }
        //$colSpan.closest("th").click();

         


    }

    function sortCardView(object){
        var $items = object.find("coral-masonry-item");

        if($items.length == 0){
            return;
        }
        $("coral-masonry").append(sortCard($items));
    }

    function sortColumnView(object){
		var $listColumnMasory = object.find("coral-columnview-column");
        //var $listColumnMasoryItem = $listColumnMasory.find("coral-columnview-item");
        //var $listColumnMasoryItem = $listColumnMasory.find("coral-columnview-item");
		//console.log("listColumnMasory " + $listColumnMasory.length);
        if($listColumnMasory.length == 0){
            return;
        }
         $.each( $listColumnMasory, function( keyA, valueA ) {
          var $test = $(valueA).find("coral-columnview-column-content");
              //console.log("test " + keyA + " - " + $test.length + " coral-columnview-column-content");
              //console.log("test " + keyA + " - " + $test.html());
              $finalColumn = sortColumn($test);
              $.each( $test, function( keyB, valueB ) {
              var $testing = $(valueB).find("coral-columnview-item");
              //console.log("testing " + keyB + " - " + $testing.length + " item(s)");
              //console.log("testing " + keyB + " - " + $testing.html());
              var $finalColumn = sortColumn($testing);
                 //console.log("finalColumn " + keyB + " - " + $finalColumn.html());
                 if($testing.length > 0){
					$test.html($finalColumn);
                 }else{
					setTimeout(function() {

						var $childPage = $(DAM_ADMIN_CHILD_PAGES);
						sortColumnView($childPage);
						return false;
                    }, 500);
                     return false;

                 }

            });



        });
        //$("coral-masonry").html(sortCard($("coral-masonry-item")));
    }

    function simpleStringify (object){
        var simpleObject = {};
        for (var prop in object ){
            if (!object.hasOwnProperty(prop)){
                continue;
            }
            if (typeof(object[prop]) == 'object'){
                continue;
            }
            if (typeof(object[prop]) == 'function'){
                continue;
            }
            simpleObject[prop] = object[prop];
        }
        return JSON.stringify(simpleObject); // returns cleaned up JSON
    };

})(jQuery, $(document));