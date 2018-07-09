// ----------------------------------------------------------------------
// where to buy
// ----------------------------------------------------------------------
(function () {
    "use strict";

    if($('#filter-list-controller')){
        var map;
        var infoWindow;
        var markersData = [];
        var markers = [];
        var filterForm = $('#filter-list-controller');
        var jsonDataToCall = {};
        var filterData = {};
        var currLocation = null;
        var executedGeo = false;
        var curLocationMarker;
        var circleOnMap = [];
        var markerCluster;

        $(document).ready(function(){

            initialize();

            $(document).on('click','.wtb-search-bar .option', function(e){
                e.preventDefault();
                //console.log('text');
                
                $('.wtb-search-bar').addClass('add-bg');
                $('.search-bar-toggle-button').addClass('open');
                $('#input-search-location').val(this.innerHTML); 
                $(this).closest('.dropdown').remove('open');
                
                
                resetFilter();
                // if ($('.state-wrap').hasClass('open')){
                //     $('.filter-list-item').removeClass('open')
                // }
        
                loadStoreListResult();
            });
        
            $(document).on('change keyup','#input-search-location', function(e){
                e.preventDefault();
                if ($(this).val()) {
                    $('.wtb-search-bar').addClass('add-bg');
                } else { 
                    $('.wtb-search-bar').removeClass('add-bg').removeClass('open');
                    $('.state-wrap').removeClass('open');
                    $('.search-bar-toggle-button').removeClass('open');
                    $('.filter-list-item').removeClass('open');
                    
                }
            });

            $(document).on('change keyup','#filter-list-controller .checkbox, #filter-list-controller .radio', function(e){
                e.preventDefault();
                var dataFiltered = [];
                var radius = null;

                //clear circle
                console.log(circleOnMap);

                filterData = JSON.parse(JSON.stringify($(filterForm).serializeObject()));
                dataFiltered = multiFilter(markersData, filterData);
                console.log(dataFiltered);
                displayMarkers(dataFiltered);
                if(dataFiltered.length > 0){
                    var templateSource = $("#infoTemplate").html();
                    var template = Handlebars.compile(templateSource);
                    $('.search-detail-group').html(template(dataFiltered));
                } else {
                    $('.search-detail-group').html('<div class="p-3xl"><h5>Sorry</h5><p><i>No result has been found.</i></p></div>');
                }


                console.log($(this).val() == 15);

                switch (Number($(this).val())) {
                    case 15:
                        radius = 15000;
                        break; 
                    case 25:
                        radius = 25000;
                        break;
                    case 35:
                        radius = 35000;
                }
                if($(this).attr('name') == "distance"){
                    if(circleOnMap.length>0){
                        circleOnMap[0].setMap(null);
                        circleOnMap = [];
                    }

                    if($(this).val() !== "all"){
                        var circle = new google.maps.Circle({
                            map: map,
                            radius: radius,    // 15km
                            fillColor: '#009b3a',
                            strokeOpacity: 0.35,
                            strokeWeight: 0,
                        });
                        circleOnMap.push(circle);
                        circle.bindTo('center', curLocationMarker, 'position');
                    }
                    
                }
                
                
            });
        
            $(document).on('click','.search-bar-toggle-button', function(e){
                e.preventDefault();
                $('.search-detail-wrap').toggleClass('search-detail-wrap-collapse');
                $('.fa-angle-left').toggleClass('arrow-on-off');
                $('.wtb-search-bar').toggleClass('open');
                if($('.filter-back-btn').hasClass('open') || $('.filter-list-item').hasClass('open')){
                    $('.filter-back-btn').removeClass('open');
                    $('.filter-list-item').removeClass('open');
                }
            });
            
            $(document).on('click','.btn-filter', function(e){
                e.preventDefault();
                if(!$(this).hasClass('disabled')){
                    $('.filter-list-item').addClass('open');
                    $('.wtb-search-bar').addClass('add-bg');
                    $('.search-bar-toggle-button').addClass('open');
                    $('.filter-back-btn').addClass('open');
                }
            });
        
            $(document).on('click','.filter-back-btn', function(e){
                e.preventDefault();
                $('.filter-back-btn').removeClass('open');
                $('.filter-list-item').removeClass('open');
            })
        
            $(document).on('click', '#search-controller .btn-search', function(e){
                // jsonDataToCall = JSON.parse(JSON.stringify($(form).serializeObject()));
                resetFilter();
                loadStoreListResult();
            });
            
            $(document).on('click', '.accordion-wrap .btn-accordion', function(e){
                $(this).next().slideToggle('fast').toggleClass('a-collapse');
                $(this).parent().toggleClass('a-collapse');
        
                //Hide the other panels
                $(".content-accordion").not($(this).next()).slideUp('fast').removeClass('a-collapse');
            });

            $('#input-search-location').keyup(function(event) {
                var target = $(event.currentTarget);
                var currentValue = target.val();
                var placeholderValue = $('#input-search-location').attr('placeholder');
                
                if (event.keyCode === 13) {
                    // enter pressed
                    if (!currentValue || currentValue === placeholderValue) return;
                
                } else {
                    if (!currentValue || currentValue === placeholderValue || currentValue.length === 1) {
                        $('.inputSearch-myLocation').removeClass('hidden');
                    } else {
                        $('.inputSearch-myLocation').addClass('hidden');
                    }
                }
                
            });
            
            $('#input-search-location').on('focus', function(event) {
                var target = $(event.currentTarget);
                var currentValue = target.val();
                var placeholderValue = $('#input-search-location').attr('placeholder');
                
                if (!currentValue || currentValue === placeholderValue || currentValue.length === 1) {
                    $('.inputSearch-myLocation').removeClass('hidden');
                } else {
                    $('.inputSearch-myLocation').addClass('hidden');
                }
            });
            
            $('#input-search-location').on('blur', function(event) {
                var to = setTimeout(function() {
                    clearTimeout(to);
                    $('.inputSearch-myLocation').addClass('hidden');
                }, 200);
            });
            
            $('.inputSearch-myLocation').on('click', function(event) {
                $('.wtb-search-bar').addClass('add-bg');
                $('.inputSearch-myLocation').addClass('hidden');
                $('#input-search-location').val('Use My Location');
                loadStoreListResult();
            });

            $(document).on('click', '.cta-search-detail-off', function(event) {
                event.preventDefault();
                $(this).closest('.search-detail-wrap').find('.state-wrap').removeClass('open');
            });

            $(document).on('click', '.cta-search-detail-on', function(event) {
                event.preventDefault();
                $('.state-wrap').addClass('open');
            });

            if($("#input-search-location").length){
                $.ajax({
                    url: "/json/autocomplete.json",
                    data: "",
                    type: "GET",
                    cache: false,
                    success: function (response) {
                        var data = response.Items;
                        var autocompleteData = data;
                        var values = Object.keys(autocompleteData).map(function(e) {
                            return autocompleteData[e].address1 || autocompleteData[e].companyName || autocompleteData[e].city || autocompleteData[e].state || autocompleteData[e].zip || autocompleteData[e].en_locationPage;
                        });
                        console.log(values);
                        new autoComplete({
                            selector: '#input-search-location',
                            minChars: 1,
                            source: function(term, suggest){
                                term = term.toLowerCase();
                                var choices = values;
                                var matches = [];
                                for (var i=0; i<choices.length; i++)
                                    if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
                                suggest(matches);
                            }
                        });
                    },
                    beforeSend: function () {
                        //$('.loader').fadeIn("fast");
                    },
                    complete: function () {
                        //$('.loader').fadeOut("slow");
                    }
                });
            }
        });

        function resetFilter(){
            $('#filter-list-controller .checkbox, #filter-list-controller .radio').prop('checked', false);
        }

        
        function multiFilter(arr, filters){
            const filterKeys = Object.keys(filters);
            return arr.filter(eachObj => {
                return filterKeys.every(eachKey => {
                    if (!filters[eachKey].length) {
                        return true; // passing an empty filter means that filter is ignored.
                    } else if(eachKey == "distance"){
                        if(filters[eachKey] == "all"){
                            return eachObj;
                        } else {
                            return eachObj[eachKey] <= Number(filters[eachKey]);
                        }
                        
                    }

                    return eachObj[eachKey].indexOf(filters[eachKey]) >= 0;
                });
            });
        };


        function initialize() {
            var mapOptions = {
                center: new google.maps.LatLng(3.283038, 108.0),
                zoom: 4,
                mapTypeId: 'roadmap',
            };
            

            infoWindow = new google.maps.InfoWindow;
        
            map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        
            // a new Info Window is created
            infoWindow = new google.maps.InfoWindow();
        
            // Event that closes the Info Window with a click on the map
            // google.maps.event.addListener(map, 'click', function() {
            // infoWindow.close();
            // });
            // Finally displayMarkers() function is called to begin the markers creation
            if(markersData.length > 0){
                displayMarkers(markersData);
            }
        }

        
        google.maps.event.addDomListener(window, 'load', initialize);
        
        
        // This function will iterate over markersData array
        // creating markers with createMarker function
        function displayMarkers(data){
            clearOverlays();
            //markerCluster.clearMarkers();
            console.log(data);
            // this variable sets the map bounds according to markers position
            var bounds = new google.maps.LatLngBounds();
            
            // for loop traverses data array calling createMarker function for each marker 
            for (var i = 0; i < data.length; i++){
                var latlng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
                var companyName = data[i].companyName;
                var address1 = data[i].address1;
                var address2 = data[i].address2;
                var phoneNumber = data[i].phoneNumber;
                var email = data[i].email;
                var directionUrl = data[i].directionUrl;
            
                createMarker(latlng, companyName, address1, address2, phoneNumber, email, directionUrl);
            
                // marker position is added to bounds variable
                bounds.extend(latlng);  
            }

            if(markerCluster) markerCluster.clearMarkers();

            markerCluster = new MarkerClusterer(map, markers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
            
        
            // Finally the bounds variable is used to set the map bounds
            // with fitBounds() function
            map.fitBounds(bounds);
            map.setZoom(8);
        }
        
        // This function creates each marker and it sets their Info Window content
        function createMarker(latlng, companyName, address1, address2, phoneNumber, email, directionUrl){
            var var_pin = 'images/marker.png';
            var marker = new google.maps.Marker({
                map: map,
                position: latlng,
                icon: var_pin,
                title: name
            });

            markers.push(marker);

           

            // This event expects a click on a marker
            // When this event is fired the Info Window content is created
            // and the Info Window is opened.

            // click: function (markers, j) {
            //     map.removeMarkers();
            //     populateMarkers();
            //     for (var j = 0; j < markers.length; j++) {
            //         console.log(markers[j]);
            //         markers[j].setIcon('images/marker-active.png');
            //         //alert(markers[j])
            //     }
            //     // setTimeout(() => {
            //     // 	this.setIcon('marker.png'); 
            //     // }, 3000);

            //     // marker.setIcon("marker-active.png");   
            //     // marker.setIcon('https://www.google.com/mapfiles/marker_green.png');

            //     map.setZoom(3);
            //     map.setCenter(lat, lng);
            //     populateInfo(key);

            // }

            google.maps.event.addListener(marker, 'click', function () {
                // Creating the content to be inserted in the infowindow
                var iwContent =
                    '<div id="iw_container">' +
                    '<div class="iw_title">' + companyName + '</div>' +
                    '<div class="iw_content">' +
                    address1 + '<br />' +
                    address2 + '<br /><br />' +
                    '<div class="fa fa-phone icon-size-xs p-right-m"></div>' + phoneNumber + '<br /><br />' +
                    '<div class="fa fa-envelope icon-size-xs p-right-m"></div>' + email + '<br /><br />' +
                    '<a href="' + directionUrl + '" target="_blank"> <div class="rounded-corners bg-primary-green p-s text-center color-white bold"> Get Direction </div></a>' + '</div></div>';

                // pan to clicked marker
                var divHeightOfTheMap = document.getElementById('map-canvas').clientHeight;
                var offSetFromBottom = 50;
                map.setCenter(marker.getPosition());
                map.panBy(0, -(divHeightOfTheMap / 2 - offSetFromBottom));

                // including content to the Info Window.
                infoWindow.setContent(iwContent);
                
                // opening the Info Window in the current map and at the current marker location.
                infoWindow.open(map, marker);
                marker.setIcon('images/marker-active.png');
            });

            google.maps.event.addListener(map, 'click', function () {
                infoWindow.close();
                //Change the marker icon
                marker.setIcon('images/marker.png');
            });

            google.maps.event.addListener(infoWindow, 'closeclick', function () {
                infoWindow.close();
                // then, remove the infowindows name from the array
                marker.setIcon('images/marker.png');
            });
            
        }

        function clearOverlays() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers.length = 0;
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }

        function loadStoreListResult(){
            console.log("jsonDataToCall", jsonDataToCall);
            $.ajax({
                url: "/json/storelist.json",
                data:   (jsonDataToCall.search_text? "search_text=" + JSON.stringify(jsonDataToCall.search_text) : "")
                        + (jsonDataToCall.storetype? "&storetype=" + JSON.stringify(jsonDataToCall.storetype) : "")
                        + (jsonDataToCall.distance? "&distance=" + JSON.stringify(jsonDataToCall.distance) : "")
                        + (jsonDataToCall.product_cat? "&product_cat=" + JSON.stringify(jsonDataToCall.product_cat) : ""),
                type: "GET",
                cache: false,
                success: function (response) {
                    // 1. data come in
                    markersData = function(){ 
                        return response.MatchItems || response.SimilarItems || response.ProximityItems;
                    }();

                    geolocation(function (pos) {
                        if(pos.lat !== null){
                            checkDuoLocation();
                            addDistanceToData();
                            var templateSource = $("#infoTemplate").html();
                            var template = Handlebars.compile(templateSource);
                            $('.search-detail-group').html(template(markersData));
                        }
                    });

                    checkDuoLocation();
                    addDistanceToData();

                    markers = [];

                    if(markersData.length > 0){
                        // 2. load map with getted data
                        initialize();
                        console.log(markersData);
                        // 3. load location info with getted data
                        var templateSource = $("#infoTemplate").html();
                        var template = Handlebars.compile(templateSource);
                        $('.search-detail-group').html(template(markersData));
                        $('.cta-search-detail-on').addClass('active');
                        $('.btn-filter').removeClass('disabled');

                        if (window.matchMedia("(min-width: 768px)").matches) {
                            $('.state-wrap').addClass('open');
                        }

                        // bind external cta event
                        var extLocationCta = $('#filter-list-controller .cta-location');
                        $(extLocationCta).off('click').on( "click", function() {
                            //console.log($(extLocationCta).index(this));
                            triggerClick($(extLocationCta).index(this));
                        });

                    } else {
                        $('.cta-search-detail-on').removeClass('active');
                        $('.btn-filter').addClass('disabled');
                    }
                    
                },
                beforeSend: function () {
                    $('.loader').fadeIn("fast");
                },
                complete: function () {
                    $('.loader').fadeOut("slow");
                }
            });
        }

        $.fn.serializeObject = function(){
            var o = {};
            var a = this.serializeArray();
            $.each(a, function() {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };

        function triggerClick(index) {
            console.log(markers[index]);
            google.maps.event.trigger(markers[index], 'click');
        }

        function geolocation(callback){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var var_pin = 'images/storeLocator/icon_marker_red.png';
                    curLocationMarker = new google.maps.Marker({
                        map: map,
                        icon: var_pin
                    });
                    var pos = {
                        long: null,
                        lat: null
                    };

                    pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    
                    currLocation = pos;

                    curLocationMarker.setPosition(pos);
                    map.setCenter(pos);

                    

                    return callback(pos);
                }, function() {
                    if(!executedGeo){
                        handleLocationError(true, infoWindow, map.getCenter());
                        executedGeo = true;
                    }
                    
                });
            } else {
                // Browser doesn't support Geolocation
                if(!executedGeo){
                    handleLocationError(false, infoWindow, map.getCenter());
                    executedGeo = true;
                }
            }
        }
    }

    function addDistanceToData(){
        if(currLocation !== null){
            $('.state-detail--distance').removeClass('hidden');
            markersData.sort(function(a, b) {
                var distanceA = calculateDistance(currLocation.lat, currLocation.lng, Number(a.latitude), Number(a.longitude) , "K");
                var distanceB = calculateDistance(currLocation.lat, currLocation.lng, Number(b.latitude), Number(b.longitude) , "K");
                return distanceA - distanceB;
            });

            // Add distance to all object
            for ( var i = 0; i < markersData.length; i++) {
                markersData[i]["distance"] = Number(calculateDistance(currLocation.lat, currLocation.lng, markersData[i]["latitude"], markersData[i]["longitude"],"K").toFixed(3));
            }

            console.log(markersData);
        }
    }

    function checkDuoLocation() {
        // if have the first location for calculate distance
        if(currLocation !== null){
            $('.state-detail--distance').removeClass('hidden');
        } else {
            $('.state-detail--distance').addClass('hidden');
        }
    }

    function calculateDistance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var radlon1 = Math.PI * lon1/180;
        var radlon2 = Math.PI * lon2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344; }
        if (unit=="N") { dist = dist * 0.8684; }
        return dist;
    }
    
})();

