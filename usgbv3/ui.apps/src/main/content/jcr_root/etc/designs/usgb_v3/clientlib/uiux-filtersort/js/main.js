// ----------------------------------------------------------------------
// Custom Filter for System Content Component
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        $(document).on("click", '.system-content-filter .dp-form .dp-list a', function () {

            var dataVal = $(this).data("val");
            //console.log("dataVal : " + dataVal);
            //console.log("system-content-box : " + $('.system-content-box[data-system-category="'+dataVal+'"]').length);

            if($('.system-content-box[data-system-category="'+dataVal+'"]').length > 0) {
           	 	$('.system-content-box').fadeOut()
            	$('.system-content-box[data-system-category="'+dataVal+'"]').fadeIn()
            } else {
				$('.system-content-box').fadeIn();
            }

            var $dpText = $(this).parent().parent().prev().find($('.dp-text'));
			$dpText.html(dataVal);

        });

        $(document).on("change", '.system-content-filter .dp-form-mobile select', function () {

            var dataVal = $(this).find(":selected").text();

            if($('.system-content-box[data-system-category="'+dataVal+'"]').length > 0) {
           	 	$('.system-content-box').fadeOut()
            	$('.system-content-box[data-system-category="'+dataVal+'"]').fadeIn()
            } else {
				$('.system-content-box').fadeIn();
            }

        });

    });
})();



// ----------------------------------------------------------------------
// Custom Filter for Resources Component
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        $(document).on("click", '.resources-filter .dp-form .dp-list a', function () {

            var dataVal = $(this).data("val");
            console.log("dataVal : " + $(this).html());
            console.log("resources-content-box : " + $('.resources-content-box[data-resource-category="'+dataVal+'"]').length);

            if($('.resources-content-box[data-resource-category="'+dataVal+'"]').length > 0) {
           	 	$('.resources-content-box').fadeOut()
            	$('.resources-content-box[data-resource-category="'+dataVal+'"]').fadeIn()
            } else {
				$('.resources-content-box').fadeIn();
            }

            if($('.accordion-item[data-resource-category="'+dataVal+'"]').length > 0) {
           	 	$('.accordion-item').fadeOut()
            	$('.accordion-item[data-resource-category="'+dataVal+'"]').fadeIn()
            } else {
				$('.accordion-item').fadeIn();
            }

            var $dpText = $(this).parent().parent().prev().find($('.dp-text'));
			$dpText.html($(this).html());

        });

        $(document).on("change", '.system-content-filter .dp-form-mobile select', function () {

            var dataVal = $(this).find(":selected").text();

            if($('.system-content-box[data-system-category="'+dataVal+'"]').length > 0) {
           	 	$('.system-content-box').fadeOut()
            	$('.system-content-box[data-system-category="'+dataVal+'"]').fadeIn()
            } else {
				$('.system-content-box').fadeIn();
            }

        });

    });
})();