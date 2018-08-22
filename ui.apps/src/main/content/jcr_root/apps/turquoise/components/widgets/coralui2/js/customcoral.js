var allLanguage = [];
var currentCountry = "";
var currentUrl = window.location.href;
retrieveCountry();
identifyCountry(currentUrl);

function retrieveCountry(){
	$.getJSON("/etc/usgbCountryList.2.json").done(function(data){

        var langCountries = data;
        var allObject = []
        for(var key in langCountries) {
            if(Object.prototype.toString.call(langCountries[key]) == "[object Object]"){
                allObject.push(langCountries[key]);
            }
        }
        allLanguage = allObject;
        return allLanguage;
    });
}


function identifyCountry(url){


    if(allLanguage == null){
		allLanguage = retrieveCountry();
    }

    for(var i = 0; i < allLanguage.length; i++){

        if( currentUrl.indexOf(allLanguage[i]["countryCode"]) > -1){
			currentCountry = allLanguage[i]["countryId"];
        }
    }console.log(url)
    console.log(currentCountry)
	return currentCountry;
}

function seperateCountryOL(currentOL){

    var vanityDiv = "<div class='coral-vanityDiv' >[country]/</div>";

    if(currentOL.length > 0){

        for(var col = 0; col < currentOL.length; col++){
			var newAllChild = [];
			var allChild = currentOL[col].children;

            if(allChild.length > 0){
    
                for(var i = 0; i < allChild.length; i++ ){

                    var inner = allChild[i].innerHTML;
                    if($(inner).val().split("/").length == 1) {
						var countryId = identifyCountry(window.location.href);

                        newInner = vanityDiv.replace("[country]", countryId);
                        newInner = newInner + inner;

                        allChild[i].innerHTML = newInner;

                        newAllChild.push(allChild[i]);

                    } else {
                        //var inner = window.location.href;
                        var newInner = "";
                        var pageCountry = "";
                        var countryCheck = false;
                        var countryIndex = -1;
    
                        for(var c = 0; c < allLanguage.length; c++){
                            var countryId = allLanguage[c]["countryId"] + "/";
                            var countryCode = allLanguage[c]["countryCode"] + "/";
    
                            //if(inner.indexOf(countryId) > 0 || inner.indexOf(countryCode) > 0){
                            if(inner.indexOf('value="' + countryId) > 0){
                                if(inner.indexOf(countryCode) > -1){
                                    countryIndex = inner.indexOf(countryCode);
                                }else{
                                    countryIndex = inner.indexOf(countryId);
                                }
    
                                pageCountry = countryId.replace(/\//g, '');;
                                countryCheck = true;
                                break;
                            }
                        }
    
                        if(countryCheck && countryIndex > 0){
    
                            newInner = vanityDiv.replace("[country]", pageCountry);
                            newInner = newInner + inner.substring(0, countryIndex);
                            newInner = newInner + inner.substring(countryIndex + pageCountry.length + 1);
    
                            allChild[i].innerHTML = newInner;
    
                            newAllChild.push(allChild[i]);
                        }
                	}
                }
            }

            currentOL[col].children = newAllChild;
        }


        return currentOL;
    }


}