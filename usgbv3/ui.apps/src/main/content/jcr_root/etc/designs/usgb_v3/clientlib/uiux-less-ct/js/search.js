// ----------------------------------------------------------------------
// search
// ----------------------------------------------------------------------

(function () {
    "use strict";

    var resultData;
    var currCategory = "content";

    $(document).ready(function(){
        if($('.search-form').length > 0){
            $(document).on('click', '.sub-search-section a', function(e){
                e.preventDefault();
                var val = "";
                var parent = $(this).closest('.sub-search-section');
                $(parent).find('li').removeClass('active');
                $(this).closest('li').addClass('active');
                val = $(this).attr('data-category');
                currCategory = val;
                getResult();
            });

            $(document).on('click', '#search-form button[type="submit"]', function(e){
                e.preventDefault();
                // var val = $(this).closest('form').find('input').val();
                // console.log(val);
                getResult();
                
            });
        }
    });

    function getResult(){
        $.ajax({
            url: "/etc/designs/usgb_v3/clientlib/uiux-less-ct/js/json/search-content-result.json",
            type: "GET",
            cache: false,
            success: function(response) {
                resultData = response;
                
                $('.result-caption').removeClass('hidden');
                $('.result-caption .num').html(resultData.num_result);
                $('.result-caption .keyword').html(resultData.searched_text);

                if(response.result){
                    $('.search-category-controller-container').removeClass('hidden');
                    $('.no-search-result-container').addClass('hidden');
                    $('.search-result-container').removeClass('hidden');

                    //populate main result
                    //var mainResulthtml = $('#templSearchResult').html();
                    // var temptMainResulthtml = Handlebars.compile(mainResulthtml);
                    // $('.main-search-result-wrapper .inner').html(temptMainResulthtml(resultData[currCategory]));

                    $('#pagination-container').pagination({
                        dataSource: resultData[currCategory],
                        callback: function(data, pagination) {
                            var mainResulthtml = $('#templSearchResult').html();
                            var temptMainResulthtml = Handlebars.compile(mainResulthtml);
                            $('.main-search-result-wrapper .inner').html(temptMainResulthtml(data));
                        }
                    });


                    //populate filter listing for mobile
                    var filterMobHtml = $('#templSearchFilterMobile').html();
                    var temptFilterMobHtml = Handlebars.compile(filterMobHtml);
                    $('.filter-mobile-content .search-filter .middle').html(temptFilterMobHtml(resultData.filter_listing));

                    //populate filter listing for desktop
                    var filterDeskHtml = $('#templSearchFilterDesktop').html();
                    var temptFilterDeskHtml = Handlebars.compile(filterDeskHtml);
                    $('.search-result-container .search-filter .middle').html(temptFilterDeskHtml(resultData.filter_listing));

                    //populate search related listing
                    var relatedHtml = $('#templSearchRelated').html();
                    var temptRelatedHtml = Handlebars.compile(relatedHtml);
                    $('.related-search').html(temptRelatedHtml(resultData));


                    switch (currCategory) {
                        case "content":
                            // if search in content, doc finder is the sub search result
                            var subResultDocFinderHtml = $('#templSubSearchResult_docFinder').html();
                            var temptSubResultDocFinderHtml = Handlebars.compile(subResultDocFinderHtml);
                            $($('.sub-search-result-wrapper')[0]).html(temptSubResultDocFinderHtml(resultData));
                            break; 
                        case "docFinder":
                            // if search in doc finder, content is the sub search result
                            var subResultContentHtml = $('#templSubSearchResult_content').html();
                            var temptSubResultContentHtml = Handlebars.compile(subResultContentHtml);
                            $($('.sub-search-result-wrapper')[0]).html(temptSubResultContentHtml(resultData));
                            break;
                        case "cad":
                            text = "No required yet!";
                            break; 
                    }

                    

                }else{
                    $('.search-category-controller-container').addClass('hidden');
                    $('.search-result-container').addClass('hidden');
                    $('.no-search-result-container').removeClass('hidden');
                }
            },
            beforeSend: function() {
            },
            complete: function() {
            }
        });
    }

    // Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    //     return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    // });

    
})();
