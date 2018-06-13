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


            // var mobileWidth = window.matchMedia("(max-width: 768px)").matches;
            // var target = $('.hero-banner-wrapper');
            // for( var i=0, len = target.length; i<len; i++ ){
            //     var src = $(target[i]).data('img-mobile');
            //     if( mobileWidth && src.replace(/\s/g,"") != "" ){
            //         $(target[i]).attr('style', src);
            //     } 
            // }
       
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

        
        function detectVideo(){
              theVideo.play(); 
        }
        if($('.hero-banner-wrapper video').length)detectVideo();
  


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

            if($('.hero-banner-wrapper video').length)detectVideo();

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
// Header Scroll Function
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){

        var lastScrollY = 0;
        var $floater = $('.header .wrapper');

        $(window).scroll(scrollStatus);

        function scrollStatus()
        {

            var currScroll = $(this).scrollTop();
            
            //scroll 
            //scroll down && scroll down more than 100px && activate when 768px and higher
            if ( (currScroll > lastScrollY) && (currScroll > 100) && (viewport().width >= 768) )
            {
                //scroll down 
                //console.log('down');

                $floater.removeClass('scroll-up').removeClass('desktop-slide-down');
                $floater.addClass('scroll-down').addClass('desktop-slide-up');

            }else if( currScroll < lastScrollY )
                {
                    //scroll up
                    //console.log('up');
                    $floater.removeClass('scroll-down').removeClass('desktop-slide-up');
                    $floater.addClass('scroll-up').addClass('desktop-slide-down');

                }

            lastScrollY = currScroll;
            //end scroll 

        }



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


            $this.addClass('open').find($('.mega-dropdown-menu')).css({"z-index": calc()});

            //provide a decent scrollbar when mega menu out of screen
            //setTimeout(delay, 1000);

    

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
              //$this.addClass('open').find($('.mega-dropdown-menu')).css({"z-index": calc() });
             $('.mega-dropdown-menu').css({"overflow": 'auto'}); 
            }

                
            }).on("mouseleave", function(){

                var $this = $(this);

                
                $all.removeClass('open');

                //clear all inline style
               // setTimeout(delayClear, 1000);
               
                //$('.mega-dropdown-menu').css({"overflow": 'hidden'}); 

                function delayClear(){
                 $('.mega-dropdown-menu').attr('style',''); 
                }

            });

        }


        if ( $(".mega-menu-wrapper .nav-dropdown-wrapper").length )megadropdownfc();


    });
})();

// ----------------------------------------------------------------------
// Hamburger menu
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
        $(".header .hamburger").on( "click",  function() {         
            var $hamburgerContent = $('.hamburger-content');

            if( $hamburgerContent.hasClass('hidden') ){
                $hamburgerContent.removeClass('hidden');
            }else
            {
                $hamburgerContent.addClass('hidden');
            }
        });
    });
})();


// ----------------------------------------------------------------------
// Mobile navigation link to function (level 1, 2 & 3)
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){

        //when click on [data-link-to] urls
        $("[data-link-to]").on( "click",  function() {         
            
            var $this = $(this);
            
            var $allSections = $('.hamburger-content>.section');

            var $thisAttrVal = $this.attr('data-link-to');
            var $thisAttrValReplace = $this.attr('data-link-to').replace(/\s/g,'');

            var $allContents = $("[data-link-to-content]");
            //var allContentsAttrValue = $allContents.attr('data-link-to-content');

            function getAllAttrValue(){

                var arr = [];

                $allContents.each(function( index ) {
                  //console.log( index + ": " + $( this ).text() );
                  var $eachContent = $(this);
                  var eachContentAttrValue = $eachContent.attr('data-link-to-content').replace(/\s/g,'');
                  //console.log(eachContentAttrValue);

                  arr.push(eachContentAttrValue);
                });

                return arr;
            }


            if( $.inArray($thisAttrValReplace, getAllAttrValue() ) !== -1){
                console.log( getAllAttrValue() );
                console.log( $thisAttrValReplace );

                //hide/reset all levels
                $allSections.addClass('hidden');
                
                //show content
               $('.hamburger-content>.section[data-link-to-content="'+$thisAttrVal+'"]').removeClass('hidden');
            }

            //console.log(compareAttrValue.eachContentAttrValue);
            
            //console.log("This attr: " + $thisAttrVal);
            //console.log("All attr: " + $allAttrVal);

            //if($thisAttrVal === $allContentsAttrValue){
                //console.log('match');
                //$allSections.addClass('hidden');
                //$("[data-link-to]").removeClass('hidden');
                //console.log($this);
            //}

            //console.log($thisAttrVal);
        });


        //when click on [data-link-back-to] urls
        $("[data-link-back-to]").on( "click",  function() { 
           
            console.log('link back to');
            
            var $this = $(this);

            var $allSections = $('.hamburger-content>.section');


            //if has parent associated, revert to level 2, level 3 ......
            if( $this.attr('data-parent') )
            {

                var $thisParentAttrVal = $this.attr('data-parent');

                 //hide/reset all levels
                 $allSections.addClass('hidden');
                 
                 //show content
                $('.hamburger-content>.section[data-link-to-content="'+$thisParentAttrVal+'"]').removeClass('hidden');

                //scroll to top
                $('.hamburger-content > *').scrollTop(0);

            }else
            //else all revert back to level 1
            {

                 //hide/reset all levels
                 $allSections.addClass('hidden');
                 
                 //show content
                $('.hamburger-content>.section.level-1').removeClass('hidden');

                //scroll to top
                $('.hamburger-content > *').scrollTop(0);

            }


        });


        //when click on [data-link-back-to] urls
        // $("[data-link-back-to-level-2]").on( "click",  function() { 
        //     console.log('click');
        //     var $this = $(this);

        //     var $allSections = $('.hamburger-content>.section');
        //     var $allSectionsLevel2 = $('.hamburger-content>.section.level-2');
        //     var $allSectionsLevel2AttrVal = $allSectionsLevel2.attr('data-link-back-to-level-2');

            
        //     if ($('.level-2').index($allSectionsLevel2AttrVal) >= 0){
        //         console.log('yes');
        //     }

        //     //var $thisAttrVal = $this.attr('data-link-back-to');

        //      //hide/reset all levels
        //      $allSections.addClass('hidden');
             
        //      //show content
        //     $('.hamburger-content>.section.level-2').removeClass('hidden');

        //     //scroll to top
        //     $('.hamburger-content > *').scrollTop(0);


        // });
        




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
// Search pop up
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
            $('body').on( "click", '[data-search-pop-up]', function() {

                var $searchPopUp = $('.search-pop-up');

                if( $searchPopUp.hasClass('hidden') ){

                    $searchPopUp.removeClass('hidden');
                    setTimeout(function(){ $searchPopUp.addClass('active') }, 50);

                }

            });

            $('.close-pop-up>*').on( "click", function() {
                
            var $searchPopUp = $('.search-pop-up');

            $searchPopUp.removeClass('active')
            setTimeout(function(){ $searchPopUp.addClass('hidden'); }, 600);

            });

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

        //console.log('onload');

    }


    if ($('.make-sticky').length){
        
        setTimeout(function(){ makeSticky(); }, 100); //for stupid cacat IE browser
        
    }
});


// ----------------------------------------------------------------------
// Product Sub Menu Nav [TESTING ONLY]
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){

        if ($('div[data-product-menu="start"]').length > 0) { 
           
            $(window).scroll(function(){    
                var posSub = $(".product-menu").offset().top - 120;
                var posSubEnd = $(".product-menu-end").offset().top -300;

                    if ($(this).scrollTop() > posSub) {
                        $('.product-menu-sticky').fadeIn(600).slideDown(700);
                    } else {
                        $('.product-menu-sticky').slideUp(700).fadeOut(600);
                    }

                    if ($(this).scrollTop() > posSubEnd) {
                        $('.product-menu-sticky').addClass("hidden");
                    }else{
                        $('.product-menu-sticky').removeClass("hidden");
                    }
            });
        }


    });
})();




// ----------------------------------------------------------------------
// Shaftliner Pop up content [not in use currently]
// ----------------------------------------------------------------------
// (function(){
//     "use strict";
//     $(document).ready(function(){
//       //change image and content dynamic
      
//       var img_change 
//         var img_change2 
//         var title_shaft
//         var desc_shaft  

//         function  changeContent(){
//             $('div[data-content="content-img1"] img').attr("src","images/"+img_change+ "");
//             $('div[data-content="content-img2"] img').attr("src","images/"+img_change2+ "");
//             $('div[data-content="content-text"] h2').text(title_shaft);
//             $('div[data-content="content-text"] p').text(desc_shaft);
//         }
       
//         //hide div first
//         $("div[data-shaft-content]").hide();
        
//         //close btn
//         $( "a[data-content='close-btn']" ).on( "click", function() {
//             $("div[data-shaft-content]").slideUp();
//         });


//         // click to show content
//         $( "div[data-shaft]" ).on( "click", function() {

//             var getShaft = $( this ).attr( "data-shaft" );
//             $("div[data-shaft-content]").slideDown();
     

//             if(getShaft == "content-1")
//             {
//                 img_change = "bg-banner-tile.jpg";
//                 img_change2 = "bg-banner-tile.jpg";
//                 title_shaft = "Shaftliner1 lorem ipsum";
//                 desc_shaft  = "Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consectetuer dolor sit amet, consectetuer one";       
//             }
//             if(getShaft == "content-2")
//             {
//                 img_change = "bg-banner-tile-2.jpg";
//                 img_change2 = "bg-banner-tile-2.jpg";
//                 title_shaft = "Shaftliner2 lorem ipsum";
//                 desc_shaft  = "Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consectetuer dolor sit amet, consectetuer two";
//             }
//             if(getShaft == "content-3")
//             {
//                 img_change = "bg-banner-tile-3.jpg";
//                 img_change2 = "bg-banner-tile-3.jpg";
//                 title_shaft = "Shaftliner3 lorem ipsum";
//                 desc_shaft  = "Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consectetuer dolor sit amet, consectetuer three";
//             }
//             if(getShaft == "content-4")
//             {
//                 img_change = "bg-banner-tile.jpg";
//                 img_change2 = "bg-banner-tile-2.jpg";
//                 title_shaft = "Shaftliner4 lorem ipsum";
//                 desc_shaft  = "Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consectetuer dolor sit amet, consectetuer 4";
//             }
//             if(getShaft == "content-5")
//             {
//                 img_change = "bg-banner-tile-2.jpg";
//                 img_change2 = "bg-banner-tile-3.jpg";
//                 title_shaft = "Shaftliner5 lorem ipsum";
//                 desc_shaft  = "Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consectetuer dolor sit amet, consectetuer 5";
//             }

//             changeContent();
//         });


//     });
// })();


// ----------------------------------------------------------------------
// Equal Height for contact us and thank you page
// ----------------------------------------------------------------------


// (function(){
//     "use strict";
//     $(document).ready(function(){
//         if($(window).width() > 767){
//             var highestBox = 0;
//            $('.equal-height').each(function(){  
//                if($(this).height() > highestBox){  
//                    highestBox = $(this).height();  
//                }
//            });    
//            $('.equal-height').height(highestBox);
//        }else{
//            var highestBox = 0;
//            $('.equal-height').each(function(){  
//                if($(this).height() > highestBox){  
//                    highestBox = $(this).height();  
//                }
//            });    
//        }
//     });
// })();




// ----------------------------------------------------------------------
// Match Height
// ----------------------------------------------------------------------
(function(){
    "use strict";
    $(document).ready(function(){
        $('[data-img-height="div-height"]').matchHeight();   
        $('[data-img-height="img-height"]').matchHeight();   

    });
})();



// ----------------------------------------------------------------------
//[TEST] Product details gallery slickjs thumbnail
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {


        $('.product-gallery-wrapper').slick({
            customPaging: function (slick, index) {
                var image_title = slick.$slides.eq(index).find('img').attr('src') || '';
                return '<img src=' + image_title + '> </img>';
            },
        });


        $('.product-gallery-wrapper').slickLightbox({
            closeOnBackdropClick: true,
            slick: function ($e) {

                $e.find('.slick-lightbox-slick-iframe').each(function () {
                    $(this)
                        .attr('data-src', $(this).attr('src'))
                        .attr('src', '')
                })

                function clearIframe(slick, index) {
                    var $iframe = $(slick.$slides.get(index)).find('.slick-lightbox-slick-iframe')
                    if ($iframe.length) {
                        setTimeout(function () {
                            $iframe.attr('src', '')
                        }, slick.options.speed)
                    }
                }

                function loadIframe(slick, index) {
                    var $iframe = $(slick.$slides.get(index)).find('.slick-lightbox-slick-iframe')
                    if ($iframe.length) $iframe.attr('src', $iframe.attr('data-src'))
                }

            
                 //Return slick instance
                return $e.find('.slick-lightbox-slick')
                    .on('init', function (event, slick) {
                        loadIframe(slick, slick.currentSlide)
                    })
                    .on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                        clearIframe(slick, currentSlide)
                        loadIframe(slick, nextSlide)
                    })
                    .slick()
            }
        }); //lightbox end

    });
})();


// ----------------------------------------------------------------------
// Checkbox Count
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        var countCheck = 0;
        $(".popup-content").hide()

        // detect change for checkbox
        $('.listing-search-content div input[type="checkbox"]').change(function () {

            var numberOfChecked = $('.listing-search-content div input:checkbox:checked').length;
            $(".popup-content").show();

            if (numberOfChecked > 3) {
                $(this).prop('checked', false);
                console.log("reached max 3")
            }

            if (numberOfChecked == 0) {
                $(".popup-content").hide();
            }

        });


    });
})();




// ----------------------------------------------------------------------
// test video
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        var player;

        function onYouTubeIframeAPIReady() {
            player = new YT.Player('video-placeholder', {
                width: 600,
                height: 400,
                videoId: 'Xa0Q0J5tOP0',
                playerVars: {
                    color: 'white',
                    playlist: 'taJ60kskkns,FG0fTKAqZ5g'
                },
                events: {
                    onReady: initialize
                }
            });
        }

        function initialize(){

            // Update the controls on load
            updateTimerDisplay();
            updateProgressBar();
        
            // Clear any old interval.
            clearInterval(time_update_interval);
        
            // Start interval to update elapsed time display and
            // the elapsed part of the progress bar every second.
            time_update_interval = setInterval(function () {
                updateTimerDisplay();
                updateProgressBar();
            }, 1000)
        
        }


        $('#play').on('click', function () {
            player.playVideo();
        });
        
        $('#pause').on('click', function () {
            player.pauseVideo();
        });
 


    });
})();







// ----------------------------------------------------------------------
// test homebanner video
// ----------------------------------------------------------------------

(function () {
    "use strict";
    $(document).ready(function () {
 

            var slideWrapper = $(".main-slider"),
            iframes = slideWrapper.find('.embed-player'),
            lazyImages = slideWrapper.find('.slide-image'),
            lazyCounter = 0;

            // POST commands to YouTube or Vimeo API
            function postMessageToPlayer(player, command){
            if (player == null || command == null) return;
            player.contentWindow.postMessage(JSON.stringify(command), "*");
            }

            // When the slide is changing
            function playPauseVideo(slick, control){
            var currentSlide, slideType, startTime, player, video;

            currentSlide = slick.find(".slick-current");
            slideType = currentSlide.attr("class").split(" ")[1];
            player = currentSlide.find("iframe").get(0);
            startTime = currentSlide.data("video-start");

            if (slideType === "vimeo") {
            switch (control) {
            case "play":
            if ((startTime != null && startTime > 0 ) && !currentSlide.hasClass('started')) {
                currentSlide.addClass('started');
                postMessageToPlayer(player, {
                "method": "setCurrentTime",
                "value" : startTime
                });
            }
            postMessageToPlayer(player, {
                "method": "play",
                "value" : 1
            });
            break;
            case "pause":
            postMessageToPlayer(player, {
                "method": "pause",
                "value": 1
            });
            break;
            }
            } else if (slideType === "youtube") {
            switch (control) {
            case "play":
            postMessageToPlayer(player, {
                "event": "command",
                "func": "mute"
            });
            postMessageToPlayer(player, {
                "event": "command",
                "func": "playVideo"
            });
            break;
            case "pause":
            postMessageToPlayer(player, {
                "event": "command",
                "func": "pauseVideo"
            });
            break;
            }
            } else if (slideType === "video") {
            video = currentSlide.children("video").get(0);
            if (video != null) {
            if (control === "play"){
            video.play();
            } else {
            video.pause();
            }
            }
            }
            }

            // Resize player
            function resizePlayer(iframes, ratio) {
            if (!iframes[0]) return;
            var win = $(".main-slider"),
            width = win.width(),
            playerWidth,
            height = win.height(),
            playerHeight,
            ratio = ratio || 16/9;

            iframes.each(function(){
            var current = $(this);
            if (width / ratio < height) {
            playerWidth = Math.ceil(height * ratio);
            current.width(playerWidth).height(height).css({
            left: (width - playerWidth) / 2,
                top: 0
            });
            } else {
            playerHeight = Math.ceil(width / ratio);
            current.width(width).height(playerHeight).css({
            left: 0,
            top: (height - playerHeight) / 2
            });
            }
            });
            }

            // DOM Ready
            $(function() {
            // Initialize
            slideWrapper.on("init", function(slick){
            slick = $(slick.currentTarget);
            setTimeout(function(){
            playPauseVideo(slick,"play");
            }, 1000);
            resizePlayer(iframes, 16/9);
            });
            slideWrapper.on("beforeChange", function(event, slick) {
            slick = $(slick.$slider);
            playPauseVideo(slick,"pause");
            });
            slideWrapper.on("afterChange", function(event, slick) {
            slick = $(slick.$slider);
            playPauseVideo(slick,"play");
            });
            slideWrapper.on("lazyLoaded", function(event, slick, image, imageSource) {
            lazyCounter++;
            if (lazyCounter === lazyImages.length){
            lazyImages.addClass('show');
            // slideWrapper.slick("slickPlay");
            }
            });

            //start the slider
            slideWrapper.slick({
            // fade:true,
            autoplaySpeed:4000,
            lazyLoad:"progressive",
            speed:600,
            arrows:false,
            dots:true,
            cssEase:"cubic-bezier(0.87, 0.03, 0.41, 0.9)"
            });
            });

            // Resize event
            $(window).on("resize.slickVideoPlayer", function(){  
            resizePlayer(iframes, 16/9);
            });



    });
})();


