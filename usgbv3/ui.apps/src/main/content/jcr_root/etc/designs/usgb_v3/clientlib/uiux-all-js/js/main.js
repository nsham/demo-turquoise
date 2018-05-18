// ----------------------------------------------------------------------
//Default reusable functions
// ----------------------------------------------------------------------
/*viewport width====================*/
function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}   
/*end viewport width====================*/

// ----------------------------------------------------------------------
// Component: Hero Banner
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
        var mobileWidth = window.matchMedia("(max-width: 768px)").matches;
        var target = $('.hero-banner-wrapper');
        for( var i=0, len = target.length; i<len; i++ ){
            var src = $(target[i]).data('img-mobile');
            if( mobileWidth && src.replace(/\s/g,"") != "" ){
                $(target[i]).attr('style', src);
            } 
        }
    });
    
})();



// ----------------------------------------------------------------------
// Component: CTA Video Popup
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
        if( $('.cta-video-popup').length > 0 ){
            $('.cta-video-popup').on('click', function(){
                switch( $(this).data('video-type') ){
                    case "youtube":
                        togglePopupYoutubeVideo();
                        $(this).parent().find('.modal').attr('data-video','youtube');
                        break;

                    case "html5":
                        togglePopupVideo();
                        $(this).parent().find('.modal').attr('data-video','html5');
                        break;
                }
            });
        

            $('.modal-video-popup .close').on('click', function(){
                switch( $(this).closest('.modal').data('video') ){
                    case "youtube":
                        togglePopupYoutubeVideo('hide');
                        break;

                    case "html5":
                        togglePopupVideo('hide');
                        break;
                }
            });
        }
    });

    function togglePopupVideo(state){
        // if state == 'hide', hide. Else: show video
        if( state == "hide" ){
            $('video.modal-video-elem')[0].pause();
        } else {
            $('video.modal-video-elem')[0].play();
        }
    }
    
    function togglePopupYoutubeVideo(state) {
        // if state == 'hide', hide. Else: show video
        var func;
        var div = document.getElementById("modal-video");
        var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
        div.style.display = state == 'hide' ? 'none' : '';
        func = state == 'hide' ? 'pauseVideo' : 'playVideo';
        iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
    }
 
})();



// ----------------------------------------------------------------------
// CTA Hover Slideup Tile
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
        var target = $('.cta-hover-slideup-tile-label');
        for( var i=0, len=target.length; i<len; i++ ){
            console.log($(target[i]));
            var content = $(target[i]).find('div');
            var divh = $(target[i]).height();
            while( content.outerHeight()>divh ) {
                content.text(function (index, text) {
                    return text.replace(/\W*\s(\S)*$/, '...');
                });
            }
        }
    });
})();

// ----------------------------------------------------------------------
// CTA Hover Slideup Tile
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
        var target = $('.carousel-featured-item');
        var mobileWidth = window.matchMedia("(max-width: 992px)").matches;
        var desktopWidth = window.matchMedia("(min-width: 992px)").matches;
        for(var i =0, len=target.length; i<len; i++){
            if( mobileWidth && $(target[i]).find('.featured-item-card-group').length > 1 ){
                $(target[i]).slick();
            } else if( mobileWidth && $(target[i]).find('.featured-item-card-group').length <= 1 ){
                $(target[i]).css('display', 'flex').css('justify-content', 'center');
            } else if( desktopWidth && $(target[i]).find('.featured-item-card-group').length > 4 ){
                $(target[i]).slick();
            } else if( desktopWidth && $(target[i]).find('.featured-item-card-group').length <= 4 ){
                $(target[i]).css('display', 'flex').css('justify-content', 'center');
            }
            $(target[i]).find('.featured-item-card-group').matchHeight();
        }
    });
})();


// ----------------------------------------------------------------------
// Floating Component
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
        var target = $('.floating-component-group');
        var mobileWidth = window.matchMedia("(max-width: 992px)").matches;
        var desktopWidth = window.matchMedia("(min-width: 992px)").matches;

        $(window).scroll(function(){
            var winPos = $(window).scrollTop();
            var pageHalfPos = $(window).height() / 2;
            if( winPos > pageHalfPos && sessionStorage.closeFloatingComponent == undefined ){
                $(target).fadeIn('slow');
            } else {
                $(target).fadeOut('slow');
            }
        });

        $('.floating-component-group .close, .floating-component-group .btn').on('click', function(e){
            //e.preventDefault();
            $(this).closest(target).hide();
            sessionStorage.setItem("closeFloatingComponent", 'true');
        });
       
    });
})();




// ----------------------------------------------------------------------
// Carousel Home Banner
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
       $(".carousel-home-banner").slick();

       // On swipe event
       // $(".carousel-home-banner").on('swipe', function(event, slick, direction){
       //    console.log(direction);
       //    // left
       // });

        // On edge hit
        // $(".carousel-home-banner").on('edge', function(event, slick, direction){
        //   console.log('edge was hit')
        // });

        // On before slide change
        $(".carousel-home-banner").on('beforeChange', function(event, slick, currentSlide, nextSlide){
          
          // var currSlide = currentSlide;
          // var $currItem = $(".carousel-home-banner [data-slick-index="+currSlide+"]");
          // //var $currActive = $(".carousel-home-banner .slick-active");
          // var animation = $currItem.find('h2').attr("data-slick-animation");

          // //$currActive.find('[data-slick-animation]')
          // console.log(animation);
          // console.log($currItem);
          // console.log($currActive);
          // console.log(currentSlide);
          // console.log(nextSlide);
        });

    });
})();


// ----------------------------------------------------------------------
// Carousel Feature Card
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
       $(".carousel-feature-card").slick();
    });
})();




// ----------------------------------------------------------------------
// Mega Menu Hover
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){

        function megadropdownfc(){

        //public
        var $all = $(".mega-menu-wrapper .nav-dropdown-wrapper");
        var i=0;




         $(".mega-menu-wrapper .nav-dropdown-wrapper").on("mouseenter", function(){

            var $this = $(this);


            $this.addClass('open').find($('.mega-dropdown-menu')).css({"z-index": calc() });

            /*
            if( $all.hasClass('open') ){
                setTimeout(delay, 1000);
                console.log('exist');
            }else{
                $this.addClass('open').find($('.mega-dropdown-menu')).css({"z-index": calc() });
                console.log('none');
            }
            */
            function calc(){
                i++;
                return i;
            }

            function delay(){
              $this.addClass('open').find($('.mega-dropdown-menu')).css({"z-index": calc() });
            }

                
            }).on("mouseleave", function(){

                var $this = $(this);

                
                $all.removeClass('open');

            });

        }


        if ( $(".mega-menu-wrapper .nav-dropdown-wrapper").length )megadropdownfc();


    });
})();


// ----------------------------------------------------------------------
// Header dropdown
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
        $(".header-side-nav .nav-dropdown-wrapper").hover(            
            function() {
                $('.dropdown-show', this).not('.in dropdown-show').stop(true,true).slideDown("400");
                $(this).toggleClass('open');        
            },
            function() {
                $('.dropdown-show', this).not('.in dropdown-show').stop(true,true).slideUp("400");
                $(this).toggleClass('open');       
            }
        );
    });
})();

// ----------------------------------------------------------------------
// Hover (for megamenu dropdown)
// ----------------------------------------------------------------------
// (function(){
//     "use strict";
//     $(document).ready(function(){
    
//             $('.product-mega').hover(
//                 function(){ 
//                     //var getCurrent = $(this).attr("id");
//                     //console.log(getCurrent);
//                     $('#product-btn a').addClass('arrow-up');
//                 }, 
//                 function(){ 
//                     $('#product-btn a').removeClass('arrow-up')
//                  }
//             )
            
//             $('.solution-mega').hover(
//                 function(){ $('#solution-btn a').addClass('arrow-up');}, 
//                 function(){ $('#solution-btn a').removeClass('arrow-up') }
//             )
//     });
// })();


// ----------------------------------------------------------------------
// Scroll reveal
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
        //  This data attribute will do the magic, data-scroll-reveal="wait 0.2s, then enter over 500ms after 0.3s"
        if (!(/msie [6|7|8|9]/i.test(navigator.userAgent))){
            (function(){
                window.scrollReveal = new scrollReveal({reset:false});
            })();
        };
    });
})();


// ----------------------------------------------------------------------
// Accordion
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
            $('body').on( "click", '.accordionfc .heading', function() {
                
                var $contentToExpand = $(this).parent().children().next(); //content div
     

                $contentToExpand.stop().slideToggle("slow");
                /* buggy when interact to quickly, use setInterval instead
                function animate(){
                    if( $contentToExpand.hasClass('closeac') ){
                        $contentToExpand.removeClass('closeac');
                        $contentToExpand.addClass('openac');
                    } else if( $contentToExpand.hasClass('openac') ){
                        $contentToExpand.removeClass('openac');
                        $contentToExpand.addClass('closeac');
                    }
                }
                */
            });
    });
})();

// ----------------------------------------------------------------------
// Custom dropdown submission
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
            $('.dp-form').on( "click", '.dp-list a', function() {
                

                var dataVal = $(this).data("val");
                var $dpText = $(this).parent().parent().prev().find($('.dp-text'));
                var $hiddenField = $dpText.next(); 
             

                $dpText.html(dataVal);
                $hiddenField.val(dataVal);
                
                //console.log(dataVal);
                // console.log($(this).parent().parent().prev().find($('.dp-text')));
     

            });
    });
})();




// ----------------------------------------------------------------------
// Sticky tool
// ----------------------------------------------------------------------

$(window).on('load', function() {

    function makeSticky(){

        var stickySidebar = new StickySidebar('.make-sticky', {
            topSpacing: 105,
            bottomSpacing: 0,
            containerSelector: '.make-sticky_limit',
            innerWrapperSelector: '.make-sticky_inner',
            resizeSensor: true,
            stickyClass: 'is-affixed',
            minWidth: 0
        });

    }


    if ($('.make-sticky').length)makeSticky(); 

});


// ----------------------------------------------------------------------
// Product Sub Menu Nav [TESTING ONLY]
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){

        if ($('div[data-sub-menu="start"]').length > 0) { 
           
            $(window).scroll(function(){    
                var posSub = $(".product-sub-menu").offset().top -119;
                var posSubEnd = $(".product-sub-menu-end").offset().top -300;

                    if ($(this).scrollTop() > posSub) {
                        $('#sub-menu').fadeIn(600).slideDown(700);
                    } else {
                        $('#sub-menu').slideUp(700).fadeOut(600);
                    }

                    if ($(this).scrollTop() > posSubEnd) {
                        $('#sub-menu').addClass("hidden");
                    }else{
                        $('#sub-menu').removeClass("hidden");
                    }
            });
        }


    });
})();




// ----------------------------------------------------------------------
// Match Height
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
        $('[data-img-height="img-height"]').matchHeight();   

    });
})();


