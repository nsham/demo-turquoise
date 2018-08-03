(function () {

    "use strict";
    $(document).ready(function () {


        $(".left-circle-tile").slick({
            "dots": true,
            "infinite": false,
            "speed": 300,
            "slidesToShow": 3,
            "slidesToScroll": 1,
            "responsive": [{
                    breakpoint: 950,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });

    });

})();