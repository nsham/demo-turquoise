// ----------------------------------------------------------------------
// Order Sample History
// ----------------------------------------------------------------------
(function(){

    $(document).ready(function () {

        //Check user SSO Login
        if(!$.ssoManager.isLogin){
                
            $('.pre-login-nav a').click();

        } else {

            if ( typeof $.ssoManager.sso.userInfo() !== 'undefined' &&
                 typeof $.ssoManager.sso.userInfo().responseJSON !== 'undefined' && 
                 ($.ssoManager.sso.userInfo().responseJSON).hasOwnProperty('id')) {

                    var userInfo = $.ssoManager.sso.userInfo().responseJSON;
                    var userInfoCustom = {
                        "user_info": {
                            "user_id": userInfo.id,
                            "display_name": userInfo.profile.display_name,
                            "country": userInfo.profile.country,
                            "first_name": userInfo.profile.first_name,
                            "last_name": userInfo.profile.last_name,
                            "email": userInfo.email.address
                        }
                    }

                    getSampleOrdersHistory(userInfoCustom).done(function(result){

                    });


                    var dropdownSortOrdersOptions = $(".sample-orders-cart-sort .dropdown-menu a");

                    dropdownSortOrdersOptions.on("click", function(event){

                        console.log($(this).data("sortby"));

                    });

                 }

        }

    });

    //Function to get user Sample orders history
    function getSampleOrdersHistory(userInfoJson){
        
        var productsDetails = $.Deferred();
        var tempProductsDetails = [];
        var arrayCount = 0;

        $.ajax({
            url: "/bin/sso/osRetrieveHistory",
            data: JSON.stringify(userInfoJson),
            dataType: 'json',
            contentType: "application/json",
            type: "POST",
            cache: false,
            success: function (response) {
                console.log(response);
            },
            beforeSend: function () {
                //$('.loader').fadeIn("fast");
            },
            complete: function () {
                //$('.loader').fadeOut("slow");
            }
        });

        return productsDetails.promise();
    }
     
})();