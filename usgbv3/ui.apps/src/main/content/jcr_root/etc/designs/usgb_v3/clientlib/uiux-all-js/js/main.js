// ----------------------------------------------------------------------
//Default reusable functions
// ----------------------------------------------------------------------

/*viewport width====================*/
function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width: e[a + 'Width'], height: e[a + 'Height'] };
}
/*end viewport width====================*/

/*defaultScrollUpdate====================*/
function defaultScrollUpdate(element) {

    var mobileExpandStateMonitor = setInterval(function () {
        //if hidden show scrollbar
        if ($(element).hasClass('hidden')) {

            $('html, body').removeClass('disable-scroll');

        } else {
            //else hide scrollbar
            $('html, body').addClass('disable-scroll');
        }
    }, 200);

    //stop after running for 1 sec, prevent running in background
    setTimeout(function () {
        clearInterval(mobileExpandStateMonitor);
    }, 1000);

};
/*end defaultScrollUpdate====================*/

/*load script before body====================*/
function hookHeadScript(url, async, defer, callback) {

    if (document.getElementsByTagName('html')[0].innerHTML.indexOf(url) === -1) {
        var script = document.createElement("script")
        script.type = "text/javascript";
        script.onload = callback;
        script.src = url;
        if (async === true) {
            script.setAttribute("async", "");
        }
        if (defer === true) {
            script.setAttribute("defer", "");
        }
        document.getElementsByTagName("head")[0].appendChild(script);
    }
}
/*end load script before body====================*/

// ----------------------------------------------------------------------
//END Default reusable functions
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// Load inline youtube video(s) in background
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {


        //load youtube api
        hookHeadScript("//www.youtube.com/iframe_api", true, false, function ()
        {

            //console.log('youtbe iframe api loaded');

            //add youtube video

            $( ".YouTubeVideoPlayer" ).each(function( index ) {
              var youtubeID = $(this).attr('id');
              var youtubeVideoID = $(this).attr('data-youtubeid');

              //console.log(youtubeVideoID);

              //load all youtube videos in background when page load
              onYouTubeIframeAPIReady(youtubeID, youtubeVideoID);
              
            });


            function onYouTubeIframeAPIReady(name, id) {

                //The callback is fired once the api script has been loaded but not necessarily executed.
                if( (typeof YT !== "undefined") && YT && YT.Player )
                {

                    //console.log('not ready');
                    var player;

                    player = new YT.Player(name,
                        {
                            videoId: id,
                            width: 560,
                            height: 316,
                            playerVars:
                            {
                                autoplay: 0,
                                controls: 1,
                                showinfo: 1,
                                modestbranding: 1,
                                loop: 0,
                                fs: 1,
                                cc_load_policy: 0,
                                autohide: 0
                            },
                            events:
                            {
                                onReady: function (e) {
                                    //e.target.mute();//chrome need to set to mute to autoplay
                                    //e.target.playVideo();
                                  
                                    //bind play buttons to each player
                                    var playButton = $("#"+name).parent().prev('button');
                                    playButton.on('click', function() {
                                      player.playVideo();
                                    });

                                }
                            }
                        });

                }else
                {
                    //console.log('ready');
                    setTimeout(function(){ onYouTubeIframeAPIReady(name, id); }, 100);
                }

            }


        });


    });

})();

// ----------------------------------------------------------------------
// Component: Hero Banner
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {


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
// Social media buttons
// ----------------------------------------------------------------------
(function () {
    "use strict";

    $('.social-media-pop-up').click(function (e) {
        e.preventDefault();
        window.open($(this).attr('href'), 'shareWindow', 'height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
        return false;
    });

})();

// ----------------------------------------------------------------------
// Component: CTA Video Popup
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {
        if ($('.cta-video-popup').length > 0) {
            $('.cta-video-popup').on('click', function () {
                switch ($(this).data('video-type')) {
                    case "youtube":
                        togglePopupYoutubeVideo('show', this);
                        $(this).parent().find('.modal').attr('data-video', 'youtube');
                        break;

                    case "html5":
                        togglePopupVideo();
                        $(this).parent().find('.modal').attr('data-video', 'html5');
                        break;
                }
            });


            $('.modal-video-popup .close').on('click', function (e) {
                switch ($(this).closest('.modal').data('video')) {
                    case "youtube":
                        togglePopupYoutubeVideo('hide', this);
                        break;

                    case "html5":
                        togglePopupVideo('hide');
                        break;
                }
            });
        }
    });

    function togglePopupVideo(state) {
        // if state == 'hide', hide. Else: show video
        if (state == "hide") {
            $('video.modal-video-elem')[0].pause();
        } else {
            $('video.modal-video-elem')[0].play();
        }
    }

    function togglePopupYoutubeVideo(state, element) {

        //autoplay video not supported unless set to mute by default
        //if state == 'hide', hide. Else: show video

        if (state == "hide") {

            var youtubevideo = $(element).next().find($('.modal-video-elem'));

            //pause/stop videos using iframe only, for more customization use youtube api instead
            $('iframe.modal-video-elem').each(function () {
                this.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
            });

        }

        // if state == 'hide', hide. Else: show video
        // var func;
        // var div = document.getElementById("modal-video");
        // var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
        // div.style.display = state == 'hide' ? 'none' : '';
        // func = state == 'hide' ? 'pauseVideo' : 'playVideo';
        // iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
    }

})();

// ----------------------------------------------------------------------
// Inline videos
// ----------------------------------------------------------------------
(function () {
    "use strict";

    $(document).ready(function () {

        //   if($('.inline-video').length)playVideoPlayer()

        // function playVideoPlayer(){

        $('.inline-video').on("click", function () {

            var $this = $(this);
            var thumbs = $this.children('.cta-video-inline');
            var video = $this.find('video');

            if ($this.data('video') === "html5") {

                //retain image for video responsiveness
                thumbs.css({ "z-index": -1 });
                video.css({ "z-index": 1 });
                video[0].play();

            } else if ($this.data('video') === "youtube") {

                var videoWrapper = $this.find('.video');
                var video = $this.find('.YouTubeVideoPlayer');
                //YT.Player name parameter must be an ID not class
                var videoIdName = video.attr('id');
                var videoId = video.attr('data-youtubeId');


               /* load youtube api with video based on click

                //load youtube api
                hookHeadScript("//www.youtube.com/iframe_api", true, false, function ()
                {

                    console.log('youtbe iframe api loaded');



                    //add youtube video
                    onYouTubeIframeAPIReady('ranID', 'aqz-KE-bpKQ');

                    function onYouTubeIframeAPIReady(name, id) {

                        //The callback is fired once the api script has been loaded but not necessarily executed.
                        if( (typeof YT !== "undefined") && YT && YT.Player )
                        {

                            //console.log('not ready');
                            var player;

                            player = new YT.Player(name,
                                {
                                    videoId: id,
                                    width: 560,
                                    height: 316,
                                    playerVars:
                                    {
                                        autoplay: 0,
                                        controls: 1,
                                        showinfo: 1,
                                        modestbranding: 1,
                                        loop: 0,
                                        fs: 1,
                                        cc_load_policy: 0,
                                        autohide: 0
                                    },
                                    events:
                                    {
                                        onReady: function (e) {
                                            //e.target.mute();//chrome need to set to mute to autoplay
                                            e.target.playVideo();
                                        }
                                    }
                                });

                        }else
                        {
                            //console.log('ready');
                            setTimeout(function(){ onYouTubeIframeAPIReady(name, id); }, 100);
                        }

                    }


                });

                */


                //retain image for video responsiveness
                thumbs.css({ "z-index": -1 });
                video.css({ "z-index": 1 });
            }
        });


        //}





        // <script async src="https://www.youtube.com/iframe_api"></script>
        // <script>
        //  function onYouTubeIframeAPIReady() {
        //   var player;
        //   player = new YT.Player('muteYouTubeVideoPlayer', {
        //     videoId: '5DEdR5lqnDE', // YouTube Video ID
        //     width: 560,               // Player width (in px)
        //     height: 316,              // Player height (in px)
        //     playerVars: {
        //       //playlist: '5DEdR5lqnDE', //must be included for autoplay to work
        //       //list:'5DEdR5lqnDE', //id of listType
        //       //listType:'search', // search, user upload and playlist base on the list's id
        //       autoplay: 0,        // Auto-play the video on load
        //       controls: 1,        // Show pause/play buttons in player
        //       showinfo: 1,        // Hide the video title
        //       modestbranding: 1,  // Hide the Youtube Logo
        //       loop: 0,            // Run the video in a loop
        //       fs: 1,              // fullscreen
        //       cc_load_policy: 0, // Hide closed captions
        //       autohide: 0         // Hide video controls when playing
        //     },
        //     events: {
        //       onReady: function(e) {
        //         //e.target.mute();//chrome need to set to mute to autoplay
        //         //e.target.playVideo();





        //           // bind events
        //   var playButton = document.getElementById("vv");
        //   playButton.addEventListener("click", function() {
        //     player.playVideo();
        //   });





        //       }
        //     }
        //   });
        //  } 

        //  // Written by @labnol 
        // </script>



    })

})();

// ----------------------------------------------------------------------
// CTA Hover Slideup Tile
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {
        var target = $('.cta-hover-slideup-tile-label');
        for (var i = 0, len = target.length; i < len; i++) {
            console.log($(target[i]));
            var content = $(target[i]).find('div');
            var divh = $(target[i]).height();
            while (content.outerHeight() > divh) {
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
(function () {
    "use strict";
    $(document).ready(function () {
        var target = $('.carousel-featured-item');
        var mobileWidth = window.matchMedia("(max-width: 992px)").matches;
        var desktopWidth = window.matchMedia("(min-width: 992px)").matches;
        for (var i = 0, len = target.length; i < len; i++) {
            if (mobileWidth && $(target[i]).find('.featured-item-card-group').length > 1) {
                $(target[i]).slick();
            } else if (mobileWidth && $(target[i]).find('.featured-item-card-group').length <= 1) {
                $(target[i]).css('display', 'flex').css('justify-content', 'center');
            } else if (desktopWidth && $(target[i]).find('.featured-item-card-group').length > 4) {
                $(target[i]).slick();
            } else if (desktopWidth && $(target[i]).find('.featured-item-card-group').length <= 4) {
                $(target[i]).css('display', 'flex').css('justify-content', 'center');
            }
            $(target[i]).find('.featured-item-card-group').matchHeight();
        }
    });
})();


// ----------------------------------------------------------------------
// Floating Component
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {
        var target = $('.floating-component-group');
        var mobileWidth = window.matchMedia("(max-width: 992px)").matches;
        var desktopWidth = window.matchMedia("(min-width: 992px)").matches;

        $(window).scroll(function () {
            var winPos = $(window).scrollTop();
            var pageHalfPos = $(window).height() / 2;
            if (winPos > pageHalfPos && sessionStorage.closeFloatingComponent == undefined) {
                $(target).fadeIn('slow');
            } else {
                $(target).fadeOut('slow');
            }
        });

        $('.floating-component-group .close, .floating-component-group .btn').on('click', function (e) {
            //e.preventDefault();
            $(this).closest(target).hide();
            sessionStorage.setItem("closeFloatingComponent", 'true');
        });

    });
})();




// ----------------------------------------------------------------------
// Carousel Home Banner
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        $(".carousel-home-banner").slick();


        function detectVideo() {
            //theVideo.play();
        }
        if ($('.hero-banner-wrapper video').length) detectVideo();



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
        $(".carousel-home-banner").on('beforeChange', function (event, slick, currentSlide, nextSlide) {

            if ($('.hero-banner-wrapper video').length) detectVideo();

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
(function () {
    "use strict";
    $(document).ready(function () {
        $(".carousel-feature-card").slick();
    });
})();


// ----------------------------------------------------------------------
// Header Scroll Function
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        var lastScrollY = 0;
        var $floater = $('.header .wrapper');

        $(window).scroll(scrollStatus);

        function scrollStatus() {

            var currScroll = $(this).scrollTop();

            //scroll 
            //scroll down && scroll down more than 100px && activate when 768px and higher
            //if ( (currScroll > lastScrollY) && (currScroll > 100) && (viewport().width >= 768) )
            if ((currScroll > lastScrollY) && (currScroll >= 100)) {
                //scroll down 
                //console.log('down');
                $floater.removeClass('notransition');
                $floater.removeClass('scroll-up').removeClass('desktop-mobile-slide-down');
                $floater.addClass('scroll-down').addClass('desktop-mobile-slide-up');

            } else if ((currScroll < lastScrollY)) {
                //scroll up
                //console.log('up');
                $floater.removeClass('notransition');
                if (currScroll < 100) {
                    $floater.addClass('notransition');
                }

                $floater.removeClass('scroll-down').removeClass('desktop-mobile-slide-up');
                $floater.addClass('scroll-up').addClass('desktop-mobile-slide-down');


            }

            lastScrollY = currScroll;
            //end scroll 

        }


        // html, body {
        //     overflow: hidden;
        // }





    });
})();

// ----------------------------------------------------------------------
// Mega Menu Hover
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        function megadropdownfc() {

            //public
            var $all = $(".mega-menu-wrapper .nav-dropdown-wrapper");
            var i = 0;




            $(".mega-menu-wrapper .nav-dropdown-wrapper").on("mouseenter", function () {

                var $this = $(this);


                $this.addClass('open').find($('.mega-dropdown-menu')).css({ "z-index": calc() });

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
                function calc() {
                    i++;
                    return i;
                }

                function delay() {
                    //$this.addClass('open').find($('.mega-dropdown-menu')).css({"z-index": calc() });
                    $('.mega-dropdown-menu').css({ "overflow": 'auto' });
                }


            }).on("mouseleave", function () {

                var $this = $(this);


                $all.removeClass('open');

                //clear all inline style
                // setTimeout(delayClear, 1000);

                //$('.mega-dropdown-menu').css({"overflow": 'hidden'}); 

                function delayClear() {
                    $('.mega-dropdown-menu').attr('style', '');
                }

            });

        }


        if ($(".mega-menu-wrapper .nav-dropdown-wrapper").length) megadropdownfc();


    });
})();

// ----------------------------------------------------------------------
// Floater with share slide
// ----------------------------------------------------------------------
(function () {
    "use strict";

    $(document).ready(function () {

        function shareExpander() {


            var $floatTitleShare = $('.float-title-share');
            var $shareIcon = $('.share-icon');
            var $closeShare = $('.close-share');
            var $slideContent = $('.slide-content');

            var $floatTitleSharePlaceholder = $('.float-title-share-placeholder');
            //var $floatTitleSharePlaceholderYpos = $floatTitleSharePlaceholder.position().top;

            $floatTitleShare.removeClass('hidden');

            //console.log($floatTitleSharePlaceholderYpos);

            $shareIcon.on('click', function () {
                $slideContent.addClass('active');
            });

            $closeShare.on('click', function () {
                $slideContent.removeClass('active');
            });


            var trigger = new Waypoint({
                element: $floatTitleSharePlaceholder,
                handler: function (direction) {
                    //console.log(direction);

                    //if down (scroll beyond placeholder)
                    if (direction === "down") {
                        $floatTitleShare.addClass('floater-slide-in');
                    }

                    //if down (scroll above placeholder)
                    if (direction === "up") {
                        $floatTitleShare.removeClass('floater-slide-in');
                    }


                }
            });


        }

        //only show when floater (in template) and placeholder (in content) exist.
        if ($('.float-title-share').length && $('.float-title-share-placeholder').length) shareExpander();

    });

})();

// ----------------------------------------------------------------------
// Filter content (mobile filter menu with slide in & out)
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {


        var $fmc = $('.filter-mobile-content');
        var $child = $fmc.children();

        $(".filter-icon").on("click", function () {


            $fmc.removeClass('hidden');


            $fmc.addClass('animateIn');
            $child.addClass('animateIn');


            var mobileExpandStateMonitor = setInterval(function () {
                //if hidden show scrollbar
                if ($fmc.hasClass('hidden')) {

                    $('html, body').removeClass('disable-scroll');
                    //$('html, body').css({ "overflow":"visible" });


                } else {
                    //else hide scrollbar
                    $('html, body').addClass('disable-scroll');
                    //$('html, body').css({ "overflow":"hidden" });

                }
            }, 50);

            //stop after running for 1 sec, prevent running in background
            setTimeout(function () {
                clearInterval(mobileExpandStateMonitor);
            }, 2000);


        });

        $(".close-filter-mobile-content").on("click", function () {


            $fmc.removeClass('animateIn');
            $child.removeClass('animateIn');

            $fmc.addClass('animateOut');
            $child.addClass('animateOut');

            //reset to normal
            setTimeout(function () {
                $fmc.addClass('hidden');
                $fmc.removeClass('animateIn').removeClass('animateOut');
                $child.removeClass('animateIn').removeClass('animateOut');
            }, 800);


            var mobileExpandStateMonitor = setInterval(function () {
                //if hidden show scrollbar
                if ($fmc.hasClass('hidden')) {

                    $('html, body').removeClass('disable-scroll');
                    //$('html, body').css({ "overflow":"visible" });

 
                } else {
                    //else hide scrollbar
                    $('html, body').addClass('disable-scroll');
                    //$('html, body').css({ "overflow":"hidden" });

                }
            }, 50);

            //stop after running for 1 sec, prevent running in background
            setTimeout(function () {
                clearInterval(mobileExpandStateMonitor);
            }, 2000);

        });


        $('[type="checkbox"]').each(iterate);//run once when page ready

        //everytime when click on any of the checkbox
        $(document).on("click", ".container-checkbox.mobile", function () {
            //iterate through 'all' instead of one just to be save
            $('.container-checkbox.mobile input[type="checkbox"]').each(iterate);
        });



        function iterate(index, value) {
            //console.log(index);
            //console.log(this);
            //console.log(value);
            var $ele = $(this);
            var $parent = $ele.parent();

            //limit to mobile checkbox only
            if ($parent.hasClass('mobile')) {

                //if check
                if ($ele.is(':checked')) {
                    $parent.addClass('checked');
                }

                //if not check
                if (!$ele.is(':checked')) {
                    $parent.removeClass('checked');
                }

            }



        }




    });
})();



// ----------------------------------------------------------------------
// Hamburger menu
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        $(".header .hamburger").on("click", function () {
            var $hamburgerContent = $('.hamburger-content');

            if ($hamburgerContent.hasClass('hidden')) {
                $hamburgerContent.removeClass('hidden');
            } else {
                $hamburgerContent.addClass('hidden');
            }

            defaultScrollUpdate(".hamburger-content");

        });

    });

})();


// ----------------------------------------------------------------------
// Mobile navigation link to function (level 1, 2 & 3)
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        //when click on [data-link-to] urls
        $("[data-link-to]").on("click", function () {

            var $this = $(this);

            var $allSections = $('.hamburger-content>.section');

            var $thisAttrVal = $this.attr('data-link-to');
            var $thisAttrValReplace = $this.attr('data-link-to').replace(/\s/g, '');

            var $allContents = $("[data-link-to-content]");
            //var allContentsAttrValue = $allContents.attr('data-link-to-content');

            function getAllAttrValue() {

                var arr = [];

                $allContents.each(function (index) {
                    //console.log( index + ": " + $( this ).text() );
                    var $eachContent = $(this);
                    var eachContentAttrValue = $eachContent.attr('data-link-to-content').replace(/\s/g, '');
                    //console.log(eachContentAttrValue);

                    arr.push(eachContentAttrValue);
                });

                return arr;
            }


            if ($.inArray($thisAttrValReplace, getAllAttrValue()) !== -1) {
                console.log(getAllAttrValue());
                console.log($thisAttrValReplace);

                //hide/reset all levels
                $allSections.addClass('hidden');

                //show content
                $('.hamburger-content>.section[data-link-to-content="' + $thisAttrVal + '"]').removeClass('hidden');
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
        $("[data-link-back-to]").on("click", function () {

            console.log('link back to');

            var $this = $(this);

            var $allSections = $('.hamburger-content>.section');


            //if has parent associated, revert to level 2, level 3 ......
            if ($this.attr('data-parent')) {

                var $thisParentAttrVal = $this.attr('data-parent');

                //hide/reset all levels
                $allSections.addClass('hidden');

                //show content
                $('.hamburger-content>.section[data-link-to-content="' + $thisParentAttrVal + '"]').removeClass('hidden');

                //scroll to top
                $('.hamburger-content > *').scrollTop(0);

            } else
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
(function () {
    "use strict";
    $(document).ready(function () {
        $(".header-side-nav .nav-dropdown-wrapper").hover(
            function () {
                $('.dropdown-show', this).not('.in dropdown-show').stop(true, true).slideDown("400");
                $(this).toggleClass('open');
            },
            function () {
                $('.dropdown-show', this).not('.in dropdown-show').stop(true, true).slideUp("400");
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
(function () {
    "use strict";
    $(document).ready(function () {
        //  This data attribute will do the magic, data-scroll-reveal="wait 0.2s, then enter over 500ms after 0.3s"
        if (!(/msie [6|7|8|9]/i.test(navigator.userAgent))) {
            (function () {
                window.scrollReveal = new scrollReveal({ reset: false });
            })();
        };
    });
})();

// ----------------------------------------------------------------------
// Search pop up
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {
        $('body').on("click", '[data-search-pop-up]', function () {

            var $searchPopUp = $('.search-pop-up');

            if ($searchPopUp.hasClass('hidden')) {

                $searchPopUp.removeClass('hidden');
                setTimeout(function () { $searchPopUp.addClass('active') }, 50);

                defaultScrollUpdate(".search-pop-up");

            }

        });

        $('.search-pop-up .close-pop-up>*').on("click", function () {

            var $searchPopUp = $('.search-pop-up');

            $searchPopUp.removeClass('active')
            setTimeout(function () { $searchPopUp.addClass('hidden'); }, 600);

            defaultScrollUpdate(".search-pop-up");

        });

    });
})();


// ----------------------------------------------------------------------
// countries pop up
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {
        $('body').on("click", '[data-countries-pop-up]', function (e) {

            e.preventDefault();

            var $searchPopUp = $('.countries-pop-up');

            if ($searchPopUp.hasClass('hidden')) {

                $searchPopUp.removeClass('hidden');
                setTimeout(function () { $searchPopUp.addClass('active') }, 50);

            }


            defaultScrollUpdate(".countries-pop-up");

        });

        $('.countries-pop-up .close-pop-up>*').on("click", function () {

            var $searchPopUp = $('.countries-pop-up');

            $searchPopUp.removeClass('active')
            setTimeout(function () { $searchPopUp.addClass('hidden'); }, 600);

            defaultScrollUpdate(".countries-pop-up");

        });

    });
})();

// ----------------------------------------------------------------------
// Sticky icons
// ----------------------------------------------------------------------
(function () {
    "use strict";

    $(document).ready(function () {

        $('.sticky-icons-button a, .sticky-icons-expander .close-pop-up').on("click", function (e) {
            e.preventDefault();

            var $stickyIconsExpander = $('.sticky-icons-expander');

            if ($stickyIconsExpander.hasClass('hidden')) {
                $stickyIconsExpander.removeClass('hidden');
                setTimeout(function () { $stickyIconsExpander.addClass('active') }, 50);
            } else {
                $stickyIconsExpander.removeClass('active')
                setTimeout(function () { $stickyIconsExpander.addClass('hidden'); }, 600);
            }

            defaultScrollUpdate(".sticky-icons-expander");

        });

    })

})();


// ----------------------------------------------------------------------
// Custom dropdown submission
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {
        $('.dp-form').on("click", '.dp-list a', function () {

            var dataVal = $(this).data("val");
            var dataHtml = $(this).html();
            var $dpText = $(this).parent().parent().prev().find($('.dp-text'));
            var $hiddenField = $dpText.next();

            $dpText.html(dataHtml);
            $hiddenField.val(dataHtml);

            //console.log(dataVal);
            // console.log($(this).parent().parent().prev().find($('.dp-text')));


        });
    });
})();


// ----------------------------------------------------------------------
// Default movile dropdown submission (syn with desktop)
// ----------------------------------------------------------------------
(function () {
    "use strict";

    $(document).ready(function () {

        $('.dp-form-mobile select').change(unniversalSelectSync);

        function unniversalSelectSync() {

            $(this).each(function () {
                if ($(this).val()) {
                    $(this).parent().prev().find($("input[type=hidden]")).val($(this).html());
                }
            });

        }



        // $('.dp-form-mobile').on( "click", '.dp-list a', function() {


        //     var dataVal = $(this).data("val");
        //     var $dpText = $(this).parent().parent().prev().find($('.dp-text'));
        //     var $hiddenField = $dpText.next(); 

        //     $dpText.html(dataVal);
        //     $hiddenField.val(dataVal);


        // });



    });
})();




// ----------------------------------------------------------------------
// Sticky tool
// ----------------------------------------------------------------------

$(window).on('load', function () {

    function makeSticky() {

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


    if ($('.make-sticky').length) {

        setTimeout(function () { makeSticky(); }, 100); //for stupid cacat IE browser

    }
});


// ----------------------------------------------------------------------
// Product Sub Menu Nav [KY]
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        if ($('div[data-product-menu="start"]').length > 0) {

            $(window).scroll(function () {
                var posSub = $(".data-scroll-wrapper .product-menu-start").offset().top - 125;
                var posSubEnd = $(".data-scroll-wrapper .product-menu-end").offset().top - 200;
                var posEqual = $(".data-scroll-wrapper .product-menu-start").offset().bottom + 50;

                if ($(this).scrollTop() > posSub) {
                    $('.product-menu-sticky').fadeIn(600).slideDown(700);
                    $('.product-menu-desktop').delay(100).css({ 'visibility': 'hidden' });
                } else {
                    $('.product-menu-sticky').slideUp(10).fadeOut(10);
                    $('.product-menu-desktop').css({ 'visibility': 'visible' });
                }

                if ($(this).scrollTop() > posSubEnd) {
                    $('.product-menu-sticky').addClass("hidden");
                } else {
                    $('.product-menu-sticky').removeClass("hidden");
                }

                if ($(this).scrollTop() == posEqual) {
                    $('.product-menu-sticky').fadeOut(10);
                    $('.product-menu-desktop').css({ 'visibility': 'visible' });
                }

            });
        }


    });
})();


// ----------------------------------------------------------------------
// Product-Sub Menu scroll [KY]
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        function detectSection() {

            // Click To Sections
            var getValue = "product-information";
            //mobile
            $('#mobile-sub-dropdown').change(function () {
                getValue = $(this).val();
                scrollToSection();
            });

            function scrollToSection() {
                var scrollToDiv = "div[data-scroll=" + getValue + "]"
                var offset = 120;
                $('html, body').animate({
                    scrollTop: $(scrollToDiv).offset().top - offset,
                }, 900, callback);

                function callback() {
                    //hide header when section is click to avoid overlaps 
                    $('.header .wrapper').removeClass('desktop-mobile-slide-down').addClass('desktop-mobile-slide-up');
                }
            }


            $(document).on("scroll", onScroll);
            //smoothscroll
            $('.desktop-list-inline li').on('click', function (e) {
                getValue = $(this).attr("data-product-list");
                scrollToSection();
                $(window).on("scroll", onScroll);
            });

            function onScroll(event) {
                var scrollPos = $(document).scrollTop();
                $('.desktop-list-inline li').each(function () {
                    var currLink = $(this);
                    var getText = $(this).text();

                    var refElement = $(this).attr("data-product-list");
                    var divName = '[data-scroll=' + refElement + ']';
                    var getTopPos = $(divName).position().top - 120;
                    var getHeightPos = $("[data-scroll=" + refElement + "]").height();

                    if (getTopPos <= scrollPos && getTopPos + getHeightPos > scrollPos) {
                        $(".mobile-list-inline li").text(getText);
                        currLink.addClass("arrow-up");
                    }
                    else {
                        currLink.removeClass("arrow-up");
                    }
                });
            }

        }
        if ($('[data-product-menu=start]').length) detectSection();



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
(function () {
    "use strict";
    $(document).ready(function () {
        $('[data-img-height="div-height"]').matchHeight();
        $('[data-img-height="img-height"]').matchHeight();

    });
})();


// ----------------------------------------------------------------------
// Product details gallery slickjs mix media 
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        // $(".test-slider-for").slick();
        // $(".test-slider-nav").slick();

        $('[data-fancybox]').fancybox({
            loop : true
        });
        
        $('.gallery-slider-for').slick({
            // slidesToShow: 1,
            // slidesToScroll: 1,
            // arrows: true,
            // fade: true,
            asNavFor: '.gallery-slider-nav'
        });
        $('.gallery-slider-nav').slick({
            // slidesToShow: 3,
            // slidesToScroll: 1,
            asNavFor: '.gallery-slider-for'
            // dots: false,
            // centerMode: true,
            // focusOnSelect: true
        });


        ///  MIX MEDIA  GALLERY/// 
        if ($(".mix-media-gallery-wrapper").length) {
            console.log("test")
            // videoType();


            $(".mix-media-gallery-wrapper .slick-arrow").click(function () {
                //   videoType();
                console.log("test1")
                $(".modal-video-elem").get(0).pause();
                if ($(".mix-media-gallery-wrapper .slick-slide .video #ranID").hasClass('YouTubeVideoPlayer')) {
                    console.log("bb")
                    $('.YouTubeVideoPlayer')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
                }
            });
            function videoType() {

                if ($(".mix-media-gallery-wrapper .slick-current .video").prev().hasClass('modal-video-elem')) {
                    console.log("aaa")
                    $(".modal-video-elem").get(0).pause();
                }
                if ($(".mix-media-gallery-wrapper .slick-current .video").prev().hasClass('YouTubeVideoPlayer')) {
                    console.log("bb")
                    $('.YouTubeVideoPlayer')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
                }
            }
        }
        ///  MIX MEDIA  GALLERY///

    });
})();


// ----------------------------------------------------------------------
// Checkbox Count (product listing)
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        function productListingFeatures() {
            // readjust sticky side bar
            var stickySidebar = new StickySidebar('.make-sticky', {
                topSpacing: 105,
                bottomSpacing: 0,
                containerSelector: '.make-sticky_limit',
                innerWrapperSelector: '.make-sticky_inner',
                resizeSensor: true,
                stickyClass: 'is-affixed',
                minWidth: 0
            });

            //////COMPARE POPUP start//////
            $(".popup-content").hide()
            $(".popup-content .content-wrapper").hide();
            $(".compare-popup .btn-compare").hide();
            $(".compare-popup .btn-menu-down").hide();

            var getCard
            var inputVal
            var numberOfChecked
            // detect change for cardcheckbox
            $('.listing-search-content .container-checkbox input[type="checkbox"]').change(function () {
                //data-title-value is card wrapper val
                //data-input-value is checkbox input val
                //data-content-title is popup content title
                //data-content-value is content of title 
                getCard = $(this);
                //get html data-text-value from input
                inputVal = getCard.data("input-value");
                //console.log("CURRinputVal = " + inputVal)
                var getIMG = $("[data-title-value=" + inputVal + "]  img").attr("src");
                var getTitle = $("[data-title-value=" + inputVal + "]  .title").text();

                if ($('.listing-search-content .container-checkbox input[data-input-value=' + inputVal + ']').is(':checked')) {
                    //append  to popup
                    $(".popup-content").append("<div class='each content-wrapper' data-content-title=" + inputVal + "><div class='left img-content'><img src=" + getIMG + "></div><div class='right title-content'data-content-value=" + inputVal + ">" + getTitle + "</div><button class='close-btn-box'><span class='bold'>x</span></button><hr class='col-xs-12 m-no m-top-m'></div>")

                    if ($(".compare-popup .title").hasClass("selected")) {
                        $(".compare-popup .title").removeClass("selected");
                    }
                }
                else {
                    //check popup if has the value
                    if ($("[data-content-title=" + inputVal + "]").has("[data-content-value=" + inputVal + "]")) {
                        $("[data-content-title=" + inputVal + "]").remove();
                    }
                }
                checkNumberOfCheckbox();
            });

            // close btn on popup to remove content
            $('body').on("click", ".close-btn-box", function () {
                inputVal = $("[data-content-title]").data("content-title");
                $("[data-content-title=" + inputVal + "]").remove();
                $("[data-input-value =" + inputVal + "]").attr('checked', false);
                checkNumberOfCheckbox()
            });

            //hide show popup
            $(".compare-popup .btn-menu-down").click(function () {
                $(".popup-content").toggle();
                $(".compare-popup .btn-compare").toggle();
                $(".compare-popup .title").toggleClass("selected")
                //check to toggle compare-btn
                if (numberOfChecked <= 1) {
                    $(".compare-popup .btn-compare").toggle();
                }
            });

            function checkNumberOfCheckbox() {
                numberOfChecked = $('.listing-search-content div input:checkbox:checked').length;
                $(".popup-content").show();
                if (numberOfChecked >= 4) {
                    $("[data-input-value =" + inputVal + "]").attr('checked', false);
                    $("[data-content-title=" + inputVal + "]").remove();
                }
                if (numberOfChecked > 1) {
                    $(".compare-popup .btn-compare").show();
                    $(".compare-popup .btn-menu-down").show();
                } else {
                    $(".compare-popup .btn-compare").hide();
                }
                if (numberOfChecked == 0) {
                    $(".popup-content").hide();
                    $(".compare-popup .btn-menu-down").hide();
                    $(".compare-popup .btn-compare").hide();
                }
            }

            //////COMPARE POPUP END//////



            ////// REFINE SEARCH  FEATURE start //////
            var dataSearchVal
            var checkname
            var countCheckboxSelect
            var checkboxName
            var currentData
            var countButton
            var MobilecurrentData
            var MobileCountButton

            // hide html divs desktop and mobile
            $(".checkbox-wrapper").hide();
            $('.checkbox-button-wrapper').hide();
            $('[data-checkbutton]').hide();

            // REFINE SEARCH DESKTOP//
            // get value of ul dropdown click function wraps all functions
            $('.refine-search').on("click", '.refine-list a', function () {
                stickySidebar.updateSticky();

                $('.checkbox-button-wrapper').show();
                // get value of dropdown ul
                dataSearchVal = $(this).data("search-val");

                // target different dropdown
                if (dataSearchVal = dataSearchVal) {
                    $(".checkbox-wrapper").hide();
                    $("." + dataSearchVal + "-wrapper").show();
                } else {
                    $(".checkbox-wrapper").hide();
                }
                // function get data and check data changes in checkbox to button 
                $('.' + dataSearchVal + '-wrapper div input[type="checkbox"]').change(function () {
                    stickySidebar.updateSticky();

                    // update wrapper to currentDATA
                    dataSearchVal = $('.' + dataSearchVal + '-wrapper').data("checkbox-wrapper");
                    //get checkbox name to pass to text
                    checkboxName = $(this).attr("name");
                    // checkname of the checkbox to pass to button
                    checkname = $(this).data("checkname");
                    //count how many checkbox is checked
                    countCheckboxSelect = $('.' + dataSearchVal + '-wrapper div input:checkbox:checked').length;
                    appendCheckboxToButton();
                });
            });
            //desktop dropown ul end

            // append checkbox to button  [desktop]
            function appendCheckboxToButton() {
                // pass checked to button
                if ($('.' + dataSearchVal + '-wrapper  input[data-checkname=' + checkname + ']').is(':checked')) {
                    $('[data-checkbutton=' + dataSearchVal + ']').append("<div data-selection=" + checkname + " class='bg-grey m-xs bold btn btn-xs'>" + checkboxName + "<span class='btn-close fs-1 p-left-s'>&times;</span></div>");
                    // remove duplicates
                    if ($('[data-selection=' + checkname + ']').length > 1) {
                        $('[data-selection=' + checkname + ']').last().remove();
                    }
                }
                else {
                    if ($('[data-checkbutton=' + dataSearchVal + ']').has('[data-selection =' + checkname + ']')) {
                        $('[data-selection=' + checkname + ']').remove();
                        $('.' + dataSearchVal + '-wrapper input[data-checkname=' + checkname + ']').attr('checked', false)
                    }
                }
                // hide/show title
                if (countCheckboxSelect < 1) {
                    $('[data-checkbutton=' + dataSearchVal + ']').hide();
                } else {
                    $('[data-checkbutton=' + dataSearchVal + ']').show();
                }
            }
            // REFINE SEARCH  DESKTOP FEATURE end//



            //REFINE SEARCH MOBILE//
            $('#refine-search-mobile').change(function () {
                $('.mobile-checkbox-button-wrapper').show();
                //get mobile option val
                dataSearchVal = $(this).val();
                // target different dropdown
                if (dataSearchVal = dataSearchVal) {
                    $(".checkbox-wrapper").hide();
                    $(".mobile-" + dataSearchVal + "-wrapper").show();
                } else {
                    $(".checkbox-wrapper").hide();
                }

                // mobile function get data and check data changes in checkbox to button 
                $('.mobile-' + dataSearchVal + '-wrapper label input[type="checkbox"]').change(function () {
                    stickySidebar.updateSticky();

                    // update wrapper to currentDATA
                    dataSearchVal = $('.mobile-' + dataSearchVal + '-wrapper').data("checkbox-wrapper");

                    checkboxName = $(this).attr("name");
                    // checkname of the checkbox to pass to button
                    checkname = $(this).data("checkname");
                    //count how many checkbox is checked
                    countCheckboxSelect = $('.mobile-' + dataSearchVal + '-wrapper label input:checkbox:checked').length;
                    $(".mobile-checkbox-button-wrapper >[data-checkbutton=" + dataSearchVal + "]").show();

                    MobileAppendCheckboxToButton();
                });
            });

            // mobile append checkbox to button 
            function MobileAppendCheckboxToButton() {

                if ($('.mobile-' + dataSearchVal + '-wrapper label input[data-checkname=' + checkname + ']').is(':checked')) {

                    $('.mobile-checkbox-button-wrapper > [data-checkbutton=' + dataSearchVal + ']').append("<div data-selection=" + checkname + " class='bg-grey m-xs bold btn btn-xs'>" + checkboxName + "<span class='btn-close fs-1 p-left-s'>&times;</span></div>");
                    //remove duplicates
                    if ($('[data-selection=' + checkname + ']').length > 1) {
                        $('[data-selection=' + checkname + ']').last().remove();
                    }
                } else {
                    if ($('.mobile-checkbox-button-wrapper > [data-checkbutton=' + dataSearchVal + ']').has('[data-selection =' + checkname + ']')) {
                        $('[data-selection=' + checkname + ']').remove();
                        $('.mobile-' + dataSearchVal + '-wrapper >[data-checkname=' + checkname + ']').parent().removeClass('checked');
                    }
                }
                // hide/show title
                if (countCheckboxSelect < 1) {
                    $('[data-checkbutton=' + dataSearchVal + ']').hide();
                } else {
                    $('[data-checkbutton=' + dataSearchVal + ']').show();
                }
            }
            /////REFINE SEARCH MOBILE END//////


            // function share between desktop and mobile//

            //target selected buttons to remove and uncheck checkbox
            $('body').on("click", "[data-selection]", function () {
                stickySidebar.updateSticky();

                //get current data-selection button  
                checkname = $(this).data("selection")
                //uncheck the checkbox (desktop)
                $("[data-checkname=" + checkname + "]").attr('checked', false);
                //remove class for Mobile
                $('label >[data-checkname=' + checkname + ']').parent().removeClass('checked');
                //get current wrapper data when button click
                currentData = $('[data-checkbutton]>[data-selection=' + checkname + ']').parent().data('checkbutton')
                MobilecurrentData = $('.mobile-checkbox-button-wrapper > [data-checkbutton] > [data-selection=' + checkname + '] ').parent().data('checkbutton')
                //remove target button
                $('[data-selection=' + checkname + ']').remove();
                //count how many buttons remaning in selected wrapper
                countButton = $('[data-checkbutton=' + currentData + ']>[data-selection]').length
                MobileCountButton = $('.mobile-checkbox-button-wrapper >[data-checkbutton=' + currentData + ']>[data-selection]').length
                countSelection();

            });

            function countSelection() {
                if (countButton < 1) {
                    $('[data-checkbutton=' + currentData + ']').hide();
                } else {
                    $('[data-checkbutton=' + currentData + ']').show();
                }
                if (MobileCountButton < 1) {
                    $('.mobile-checkbox-button-wrapper > [data-checkbutton=' + MobilecurrentData + ']').hide("p");
                } else {
                    $('.mobile-checkbox-button-wrapper >[data-checkbutton=' + MobilecurrentData + ']').show();
                }
            }
            // function share between desktop and mobile end//

        }


        if ($('.page-product-listing section').length) productListingFeatures();



    });
})();



// ----------------------------------------------------------------------
// Left Circle Tile
// ----------------------------------------------------------------------
(function () {

    "use strict";
    $(document).ready(function () {


        $(".left-circle-tile").slick(
            {
                "dots": true,
                "infinite": false,
                "speed": 300,
                "slidesToShow": 3,
                "slidesToScroll": 1,
                "responsive": [
                    {
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




// ----------------------------------------------------------------------
// Component Tab tiles  (filter) [ky]
// ----------------------------------------------------------------------
(function () {
    "use strict";
    $(document).ready(function () {

        var getID = "all";
        var dataCategory

        loadAllDiv();
        function loadAllDiv() {
            $('[data-category]').fadeOut(500);
            $('[data-category]').slice(0, 12).fadeIn(500);

            if ($(".all:hidden").length != 0) {
                $("#loadMore").show();
                $('.content-wrapper').addClass('crop-height');
                $(".btn-scroll-top").fadeIn(500);
            }
            if ($('[data-category]').length < 4) {
                $(".btn-scroll-top").fadeOut(500);
            }

            $('[data-category]').matchHeight();


        }

        function loadMoreBtn() {
            $("#loadMore").fadeIn(500);
            $(".fade-bg").fadeIn(500);
            $('.content-wrapper').css('height', '780px');
        }
        function completeLoadMore() {
            $("#loadMore").fadeOut(500);
            $(".fade-bg").fadeOut(500);
            $('.content-wrapper').css('height', '100%');
        }

        //when load more btn is click
        function loadMoreContent() {
            $("#loadMore").fadeIn(500);
            $(".fade-bg").fadeIn(500);
            var getDivHeight = $(".content-wrapper").height();
            var newDivHeight = getDivHeight + 380;
            $('.content-wrapper').css('height', newDivHeight);
        }


        // get data content to filter
        $('.tab-tiles-wrapper ul li').click(function () {
            getID = $(this).attr('data-btn-category');
            dataCategory = $('[data-category=' + getID + ']')
            checkFilterData();
            //btn add active class
            $(this).parent().find('li.active').removeClass('active');
            $(this).addClass('active');

        });

        function checkFilterData() {

            if (getID == "all") {
                if ($('[data-category]').length > 12) {
                    loadAllDiv();
                    loadMoreBtn();
                } else {
                    loadAllDiv();
                    completeLoadMore();
                }

            } else {
                //hide all divs and load according to category
                $('.content-wrapper [data-category]').fadeOut(500);
                //  $('.content-wrapper [data-category]').not(dataCategory).fadeOut(500);
                if (dataCategory.length > 12) {
                    loadMoreBtn();
                    dataCategory.slice(0, 12).fadeIn(900);
                } else {
                    completeLoadMore();
                    dataCategory.slice(0, 12).fadeIn(900);

                }
                //hide show scroll top btn
                if (dataCategory.length < 4) {
                    $(".btn-scroll-top").fadeOut();
                } else {
                    $(".btn-scroll-top").fadeIn();
                }


            }
        }


        $("#loadMore").on('click', function (e) {
            e.preventDefault();
            //detect category to load hidden div by 4
            var dataCategory2 = '[data-category=' + getID + ']'

            if (getID == "all") {
                $('[data-category]' + ":hidden").slice(0, 4).fadeIn(600).slideDown(900);
                if ($('[data-category]' + ":hidden").length == 0) {
                    completeLoadMore();
                }
                if ($('[data-category]' + ":hidden").length != 0) {
                    loadMoreContent();
                }
            } else {
                $(dataCategory2 + ":hidden").slice(0, 4).fadeIn(600).slideDown(900);
                if ($(dataCategory2 + ":hidden").length == 0) {
                    completeLoadMore();
                }
                if ($(dataCategory2 + ":hidden").length != 0) {
                    loadMoreContent();
                }
            }

        });


        $(".btn-scroll-top").on('click', function (e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $(".tab-tiles-title").offset().top - 110,
            }, 600);
        });




    });
})();


