// ----------------------------------------------------------------------
	// contact us
	// ----------------------------------------------------------------------
	
(function () {
    "use strict";


    $(document).ready(function () {
        if($('.floating-type-form').length > 0){
            $(document).on('change', '.floating-type-form .drop-down-select', function (e) {
                var labelDropDown = $(this).closest('.float-label').find('label');
                if ($(this).val() == "") {
                    $(labelDropDown).removeClass('open');
                } else {
                    $(labelDropDown).addClass('open');
                }
            });
    
            $(".form-validate").validate({
            rules: {
                dropdownselect: "required",
                name: "required",
                email: {
                    required: true,
                    email: true
                },
                contact: {
                    required: true,
                    digits: true
                },
                message: "required",
                agree: "required",
                i_work_with: "required",
                i_am_interested: "required"
            },
            messages: {
                dropdownselect: "Please select one",
                name: "Please enter your name",
                email: "Please enter a valid email address",
                message: "Please enter a valid message",
                agree: "Please accept our policy",
                i_work_with: "Please select one",
                i_am_interested: "Please select one"
            },
            errorElement: "em",
            errorPlacement: function (error, element) {
                // Add the `help-block` class to the error element
                error.addClass("help-block");

                if (element.prop("type") === "checkbox") {
                    error.insertAfter(element.closest('.checkbox'));
                } else if (element.prop("tagName").toLowerCase() === "select") {
                    error.insertAfter(element);
                } else {
                    error.insertAfter(element.parent().find('label'));
                }
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents(".respond-msg").addClass("has-error").removeClass("has-success");
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents(".respond-msg").addClass("has-success").removeClass("has-error");
            }
        });

        }
    });

    function windowOpenPage() {
        windowObjectReference = window.open(
            "https://myaccount.usgboral.com/dialog/#/?client=USG%20Boral&lang=en&state=Y3HBHe7hS11wzHhb2diIkw&bu=MY",
            "WWildlifeOrgWindowName",
            "outerWidth=600,width=500,innerWidth=400,height=700,resizable,scrollbars,status"
        );
    }

})();