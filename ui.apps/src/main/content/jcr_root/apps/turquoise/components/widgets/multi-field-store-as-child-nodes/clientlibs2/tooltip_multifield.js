(function () {
    var DATA_EAEM_NESTED = "data-eaem-nested";
    var MULTIFIELD_ATTR = 'cq-multifield';
    var CFFW = ".coral-Form-fieldwrapper, input[type='hidden']";

    //reads multifield data from server, creates the nested composite multifields and fills them
    function addDataInFields() {
        function getMultiFieldNames($multifields){
            var mNames = {}, mName;

            $multifields.each(function (i, multifield) {
                mName = $(multifield).children("[name$='@Delete']").attr("name");

                mName = mName.substring(0, mName.indexOf("@"));
 
                mName = mName.substring(2);

                mNames[mName] = $(multifield);
            });
 
            return mNames;
        }
 
        function buildMultiField(data, $multifield, mName){
            if(_.isEmpty(mName) || _.isEmpty(data)){
                return;
            }
 
            // loop MultiField items
            _.each(data, function(item, key){
                if(key == "jcr:primaryType"){
                    return;
                }
 
                $multifield.find(".js-coral-Multifield-add").click();
 
                _.each(item, setValue);
                
                
                function setValue(fValue, fKey){
                    
                    var fieldName = [];
                    if( typeof(this.parentName) == "string" ){
                        fieldName.push(this.parentName);
                    }
                    fieldName.push(fKey);
                    
                    
                    if(fKey == "jcr:primaryType"){
                        return;
                    }else if( typeof(fValue) == "object" && fValue["jcr:primaryType"] == "nt:unstructured"  ){
                        _.each(fValue, setValue, { parentName: fieldName.join("/") });
                    }
                    

                    var $field = $multifield.find("[name='./" + fieldName.join("/") + "']").last();

                    if(_.isEmpty($field)){
                        return;
                    }
                    
                    // Dectect the field type and use different program logic
                    var $coralField = $field.parents(".coral-Form-fieldwrapper")
                        .first().find(".coral-Form-field");
	                	                	
	                if( $coralField.data("colorpicker") ){
	                	$coralField.data("colorpicker")._setColor(fValue);
	                }else if( $coralField.hasClass("coral-RichText") ){
	                    	                    
	                	$field.val(fValue);
	                	var rteCont = $coralField.parents(".richtext-container").first();
	                	
                        var html = rteCont.find("input.coral-Form-field.coral-Textfield").val();
                        rteCont.find(".editable, .coral-RichText-editable").empty().append(html);
                        
	                }else if( $coralField.data("init") == "select" ){
	                    $coralField.data("select").setValue(fValue);
	                }else{
	                	$field.val(fValue);
	                }
                }
            });
            
            $multifield.find("input[type='checkbox']").each(function(i,_checkbox){
                $(_checkbox).attr("checked", eval($(_checkbox).val()));
            });

            $multifield.trigger('foundation-contentloaded');

        }

        function populateDialog() {
            var $multifields = $("[" + DATA_EAEM_NESTED + "]");
            $multifields.find("input[type='checkbox']").each(function(i, _checkbox){
                $(_checkbox).attr("checked", $(_checkbox).val());}
            );

            if(_.isEmpty($multifields)){
                return;
            }

            var mNames = getMultiFieldNames($multifields),
                $form = $("#propertiesform, .foundation-layout-form-mode-edit"),
                actionUrl = $form.attr("action") + ".infinity.json";

            $.ajax(actionUrl).done(postProcess);
 
            function postProcess(data){
                _.each(mNames, function($multifield, mName){
                    buildMultiField(data[mName], $multifield, mName);
                });
            }
        }

        if($("#propertiesform, .foundation-layout-form-mode-edit").length > 0)
            populateDialog();
//        $(document).on('foundation-contentloaded', populateDialog);
    }

    //collect data from widgets in multifield and POST them to CRX
    function collectDataFromFields(){
        function fillValue($form, fieldSetName, $field, counter){
            var name = $field.attr("name");

            if (!name) {
                return;
            }

            //strip ./
            if (name.indexOf("./") == 0) {
                name = name.substring(2);
            }

            //remove the field, so that individual values are not POSTed
            //$field.remove();

            if($field.attr("type") == "checkbox") {
                $field.val($field.is(":checked"));
            }

            input = $('<input />').attr('type', 'hidden')
                .attr('name', fieldSetName + "/" + counter + "/" + name)
                .attr('value', $field.val())
            	.attr(MULTIFIELD_ATTR,'')
                .appendTo($form);
        }
        // Tooltip
        function submitDialog() {
            if($("[data-tooltip-nested]").length > 0) {
                 var $multifields = $("[" + DATA_EAEM_NESTED + "]");

                 if(_.isEmpty($multifields)){
                     return;
                 }

                 var $form = $("#propertiesform, .foundation-layout-form-mode-edit"),
                     $fieldSets, $fields;

                 $form.find('['+MULTIFIELD_ATTR+']').remove();

                 $multifields.each(function(i, multifield){
                     $fieldSets = $(multifield).find("[class='coral-Form-fieldset']");

                     $fieldSets.each(function (counter, fieldSet) {
                         $fields = $(fieldSet).find("div > .coral-Form-fieldwrapper:has([name='./tooltiptext']), div > input[type='hidden']:has([name='./tooltiptext'])");

                         $fields.each(function (j, field) {
                             var fieldParent = $(field).parent();
                             $fields2 = fieldParent.find(CFFW);
                             var fieldNodeName = encodeURIComponent(fieldParent.find("[name='./tooltiptext']").val());

                             $fields2.each(function (k, field2) {
                                 var fieldNameTag = $(field2)
                                 if( fieldNameTag.attr('type') != 'hidden' || (fieldNameTag.attr('type') == 'hidden' && fieldNameTag.hasClass('coral-Textfield')) ){
                                     fieldNameTag = fieldNameTag.find('[name]');
                                 }
                                 fillValue($form, $(fieldSet).data("name"), fieldNameTag, fieldNodeName);
                             });
                         });
                     });
                 });
             }
         }
        $(document).on("click", ".foundation-layout-form-mode-edit button.cq-dialog-submit", submitDialog);
        $("button[type='submit'][form='propertiesform']").bind("click", submitDialog);
    }

    $(document).ready(function () {
        addDataInFields();
        collectDataFromFields();
    });
})();