// ----------------------------------------------------------------------
// Carousel Home Banner
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
       $(".carousel-home-banner").slick({
                                            "dots": true,
                                            "infinite": true,
                                            "speed": 300,
                                            "slidesToShow": 1,
                                            "slidesToScroll": 1,
                                            "responsive": [
                                                {
                                                    "breakpoint": 992,
                                                    "settings": {
                                                        "slidesToShow": 1
                                                    }
                                                }
                                            ]
                                        });


    });

	function detectVideo() {
		theVideo.play();
	}

	if ($('.hero-banner-wrapper video').length){
    	detectVideo();
    }

	// On before slide change
	$(".carousel-home-banner").on('beforeChange', function (event, slick, currentSlide, nextSlide) {

		if ($('.hero-banner-wrapper video').length){
        	detectVideo();
        }
	});

    $('.carousel-home-banner').on('init', function(ev, el){ 
            $('video').each(function () {
                this.play();
            });
        }); 
})();