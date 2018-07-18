// ----------------------------------------------------------------------
// contact us
// ----------------------------------------------------------------------

// $("#contactUsForm1").validate({
//     submitHandler: function (form) {
//         console.log("successs submit");
        
//         proceed = true; //set proceed flat to true
//         console.log("successs submit2");
//         var post_url = '/json/storelist.json'; //get form action url
//         var request_method = 'POST'; //get form GET/POST method
//         var form_data = new FormData(this); //constructs key/value pairs representing fields and values

//         console.log("post" + post_url);

//         form_data.set("fullPath", window.location.href); // adding page url data
//         form_data.set("formName", "page-content"); // adding page url data
//         //$("#easyfinishForm").css("opacity", 0.2);
//         // get current path
//         var path = window.location.pathname;
//         var index = path.lastIndexOf("/");
//         if (index != -1) {
//             var currentPath = path.substring(0, index);
//             index = currentPath.lastIndexOf("/");
//             currentPath = currentPath.substring(0, index);
//             form_data.append("path", currentPath);
//         }
//         console.log(currentPath);

//         $.ajax({ //ajax form submit
//             url: post_url,
//             type: request_method,
//             data: form_data,
//             dataType: "json",
//             contentType: false,
//             cache: false,
//             processData: false
//         }).done(function (data) { //fetch server "json" messages when done
//             console.log("successs submit3");

//             $('#contactUsForm1').hide();
//             $('#contactUsForm2').removeClass('hidden');
//         });
       
//     }
// });



function recaptchaCallback() {
    $('#hiddenRecaptcha').valid();
};


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

            $('.chooseFile').bind('change', function () {
                var filename = $(".chooseFile").val();
                if (/^\s*$/.test(filename)) {
                    $(".file-select-name").text("");
                } else {
                    $(".file-select-name").text(filename.replace("C:\\fakepath\\", ""));
                }
            });
            
            $(document).on('change', '.chooseFile', function (e) {
                var labelChooseFile = $(this).closest('.float-label').find('label');
                if ($(this).val() == "") {
                    $(labelChooseFile).removeClass('open');
                } else {
                    $(labelChooseFile).addClass('open');
                }
            });
    
            // $(document).on('click', '.login-yes', function (e) {
            //     e.preventDefault();
            //     windowOpenPage();
            // });

            $("#contactUsForm1").validate({
                ignore: ".ignore",
                rules: {
                    dropdownselect: "required",
                    countryselect: "required",
                    locationselect: "required",
                    departmentselect: "required",
                    occupationselect: "required",
                    resume: "required",
                    name: "required",
                    chooseFile: "required",
                    email: {
                        required: true,
                    },
                    contact: {
                        required: true,
                        digits: true
                    },
                    hiddenRecaptcha: {
                        required: function () {
                            if (grecaptcha.getResponse() == '') {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    message: "required",
                    agree: "required",
                    i_work_with: "required",
                    i_am_interested: "required"
                },
                messages: {
                    dropdownselect: "Please select one",
                    countryselect: "Please select your country",
                    locationselect: "Please select your location",
                    departmentselect: "Please select your department",
                    occupationselect: "Please select your occupation",
                    chooseFile: "Please attach your resume",
                    name: "Please enter your name",
                    email: "Please enter a valid email address",
                    message: "Please enter a valid message",
                    contact: "Please fill in your contact number",
                    agree: "Please accept our policy",
                    i_work_with: "Please select one",
                    i_am_interested: "Please select one",
                    hiddenRecaptcha: "Please complete the Captcha"
                },
                errorElement: "span",
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
                },

                submitHandler: function(form) {
                    console.log("successs submit");
            
                    $.ajax({ //ajax form submit
                        url: '/json/formvalidate.json',
                        type: 'POST',
                        data: $("form").serialize(),
                        dataType: 'json',
                        contentType: false,
                        cache: false,
                        processData: false
                    }).done(function (data) { //fetch server "json" messages when done
                        console.log("successs submit3");
            
                        $('#contactUsForm1').hide();
                        $('#contactUsForm2').removeClass('hidden');
                    });
                   
                }// end submit handler
            }); //contactUsForm1



            $("#contactUsForm2").validate({
                ignore: ".ignore",
                rules: {
                    occupationselect: "required",
                    contact: {
                        required: true,
                        digits: true
                    },
                    i_work_with: "required",
                    i_am_interested: "required"
                },
                messages: {
                    occupationselect: "Please select one",
                    contact: "Please fill in your contact number",
                    i_work_with: "Please select one",
                    i_am_interested: "Please select one"
                },
                errorElement: "span",
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
                },

                submitHandler: function(form) {
                    console.log("successs submit");
            
                    $.ajax({ //ajax form submit
                        url: '/json/formvalidate.json',
                        type: 'POST',
                        data: $("form").serialize(),
                        dataType: 'json',
                        contentType: false,
                        cache: false,
                        processData: false
                    }).done(function (data) { //fetch server "json" messages when done
                        console.log("successs submit3");
            
                        $('#contactUsForm1').hide();
                        $('#contactUsForm2').removeClass('hidden');
                    });
                   
                }// end submit handler
            }); //contactUsForm2

            // $("#contactUsForm3").validate({
            //     ignore: ".ignore",
            //     rules: {
            //         dropdownselect: "required",
            //         countryselect: "required",
            //         locationselect: "required",
            //         departmentselect: "required",
            //         occupationselect: "required",
            //         resume: "required",
            //         name: "required",
            //         chooseFile: "required",
            //         email: {
            //             required: true,
            //         },
            //         contact: {
            //             required: true,
            //             digits: true
            //         },
            //         hiddenRecaptcha: {
            //             required: function () {
            //                 if (grecaptcha.getResponse() == '') {
            //                     return true;
            //                 } else {
            //                     return false;
            //                 }
            //             }
            //         },
            //         message: "required",
            //         agree: "required",
            //         i_work_with: "required",
            //         i_am_interested: "required"
            //     },
            //     messages: {
            //         dropdownselect: "Please select one",
            //         countryselect: "Please select your country",
            //         locationselect: "Please select your location",
            //         departmentselect: "Please select your department",
            //         occupationselect: "Please select your occupation",
            //         chooseFile: "Please attach your resume",
            //         name: "Please enter your name",
            //         email: "Please enter a valid email address",
            //         message: "Please enter a valid message",
            //         contact: "Please fill in your contact number",
            //         agree: "Please accept our policy",
            //         i_work_with: "Please select one",
            //         i_am_interested: "Please select one",
            //         hiddenRecaptcha: "Please complete the Captcha"
            //     },
            //     errorElement: "span",
            //     errorPlacement: function (error, element) {
            //         // Add the `help-block` class to the error element
            //         error.addClass("help-block");

            //         if (element.prop("type") === "checkbox") {
            //             error.insertAfter(element.closest('.checkbox'));
            //         } else if (element.prop("tagName").toLowerCase() === "select") {
            //             error.insertAfter(element);
            //         } else {
            //             error.insertAfter(element.parent().find('label'));
            //         }
            //     },
            //     highlight: function (element, errorClass, validClass) {
            //         $(element).parents(".respond-msg").addClass("has-error").removeClass("has-success");
            //     },
            //     unhighlight: function (element, errorClass, validClass) {
            //         $(element).parents(".respond-msg").addClass("has-success").removeClass("has-error");
            //     },

            //     submitHandler: function(form) {
            //         console.log("successs submit");
            
            //         $.ajax({ //ajax form submit
            //             url: '/json/formvalidate.json',
            //             type: 'POST',
            //             data: $("form").serialize(),
            //             dataType: 'json',
            //             contentType: false,
            //             cache: false,
            //             processData: false
            //         }).done(function (data) { //fetch server "json" messages when done
            //             console.log("successs submit3");
            
            //             $('#contactUsForm1').hide();
            //             $('#contactUsForm2').removeClass('hidden');
            //         });
                   
            //     }// end submit handler
            // }); //contactUsForm3

        }
    });

    // function windowOpenPage() {
    //     windowObjectReference = window.open(
    //         "https://myaccount.usgboral.com/dialog/#/?client=USG%20Boral&lang=en&state=Y3HBHe7hS11wzHhb2diIkw&bu=MY",
    //         "WWildlifeOrgWindowName",
    //         "outerWidth=600,width=500,innerWidth=400,height=700,resizable,scrollbars,status"
    //     );
    // }

    
})();
    