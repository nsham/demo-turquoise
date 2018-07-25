// ----------------------------------------------------------------------
// Order Sample listing
// ----------------------------------------------------------------------
(function(){

    //Check if the Local storage for Sample Orders list is set
    var sampleOrderList = {};
    if(typeof(Storage) !== "undefined") {
        if (localStorage.sampleOrdersList) {
            sampleOrderList = JSON.parse(localStorage.getItem('sampleOrdersList'));
        }
    }

    $(document).ready(function () {

        var stepWrapper = $(".order-steps-wrapper .steps-inner-wrapper");
        var stepOrderSelectWrapper = $(".order-steps-wrapper .step-1-select-wrapper");
        var stepShippingDetailsWrapper = $(".order-steps-wrapper .step-2-shipping-wrapper");
        var stepOrderSummaryWrapper = $(".order-steps-wrapper .step-3-order-summary-wrapper");

        var stepHeaderWrapper = $(".steps-header .steps");
        var stepHeaderSelectOrder = $(".steps-header .step-1-select");
        var stepHeaderShippingDetails = $(".steps-header .step-2-select");
        var stepHeaderOrderSummary = $(".steps-header .step-3-select");

        var sampleQuantityCtrlSub = $(".sample-quantity .quantity-ctrl.dec-quantity");
        var sampleQuantityCtrlAdd = $(".sample-quantity .quantity-ctrl.inc-quantity");
        var sampleRemoveBtn = $(".sample-remove .remove-selected-sample");


        //Get all Sample orders product details and pass to Template
        getAllSampleOrdersData(sampleOrderList).done(function(results) {
            console.log(results);

            var html = $('#sampleOrderTemplate').html();
            var template = Handlebars.compile(html);
            $('.sample-orders-container').html(template(results));

        });


        //Add or subtract Sample quantity
        sampleQuantityCtrlSub.on("click", function(event){

            event.preventDefault();
            var quantityObject = $(this).next();
            var quantityObjectValue = parseInt(quantityObject.val());

            if(quantityObjectValue > 1){
                quantityObjectValue = quantityObjectValue-1;
                quantityObject.val(quantityObjectValue);
            }

        });

        //Add or subtract Sample quantity
        sampleQuantityCtrlAdd.on("click", function(event){

            event.preventDefault();
            var quantityObject = $(this).prev();
            var quantityObjectValue = parseInt(quantityObject.val());
            quantityObjectValue = quantityObjectValue+1;
            quantityObject.val(quantityObjectValue);

        });

        //Remove Order sample
        sampleRemoveBtn.on("click", function(event){
            
            event.preventDefault();

            var itemRowObject = ($(this).parent()).parent();
            itemRowObject.remove();

        });

        //Order select step button
        var orderSelectBtn = $(".order-steps-wrapper .order-sample-btn");

        //Go to step 2 Shipping details Form
        orderSelectBtn.on("click", function(event){
            
            //Hide all steps
            stepWrapper.removeClass("step-active");
            stepHeaderWrapper.removeClass("current-step");

            //Show next step Shipping details
            stepShippingDetailsWrapper.addClass("step-active");
            stepHeaderShippingDetails.addClass("active");
            stepHeaderShippingDetails.addClass("current-step");

        });


        //Back to Step 1 Order select Button
        var backToOrderSelectBtn = $(".order-steps-wrapper .back-to-order-select");

        backToOrderSelectBtn.on("click", function(event){
            
            //Hide all steps
            stepWrapper.removeClass("step-active");
            stepHeaderShippingDetails.removeClass("active");

            //Show next step Shipping details
            stepOrderSelectWrapper.addClass("step-active");
        });



        //Step 2 Shipping Details Form
        $("#sampleOrderShippingForm").validate();

        $('#sampleOrderShippingFormSubmit').click(function (e) {
            
            if ($("#sampleOrderShippingForm").valid()) {
               
                //Hide all steps
                stepWrapper.removeClass("step-active");
                stepHeaderWrapper.removeClass("current-step");

                //Show next step Shipping details
                stepOrderSummaryWrapper.addClass("step-active");
                stepHeaderOrderSummary.addClass("active");
                stepHeaderOrderSummary.addClass("current-step");
                
            }

            e.preventDefault();
        });

    });


    //To get all the sample order products list json data.
    //Function param is the local storage json parsed object
    function getAllSampleOrdersData(sampleOrdersList) {
        
        var sampleProductsDetails = $.Deferred();
        var tempSampleProductDetails = [];
        var arrayCount = 0;

        sampleOrderList.forEach(function(sampleProduct, index, array){

            $.get(sampleProduct.productUrl, function(){})
            .done(function(data){
                data.quantity = sampleProduct.quantity;
                tempSampleProductDetails.push(data);
            }).always(function(){
                arrayCount++;
                if(arrayCount === array.length){
                    sampleProductsDetails.resolve(tempSampleProductDetails);
                }
            });

        });

        return sampleProductsDetails.promise();
        
    }

})();