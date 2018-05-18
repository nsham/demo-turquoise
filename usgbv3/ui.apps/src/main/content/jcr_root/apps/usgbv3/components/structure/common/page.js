"use strict"
use(function(){
    var page = currentPage.getAbsoluteParent(2);
    var vm = page.getProperties();
    lang = vm.get("jcr:language","");

    if (lang=='') {
		lang = page.getName();
    }

    lang = lang.replace("_","-");

    if(lang == "zh-tw") {
    	lang = "zh-Hant-TW";
    } else if (lang == "zh-hk") {
    	lang = "zh-Hant-HK";
    } else if (lang == "zh-cn") {
		lang = "zh-Hans-CN";
    }

    var brandPage = currentPage.getAbsoluteParent(1);
    var rootVm = brandPage.getProperties();

    var goToContentLabel = null;
    if(page.getContentResource("topnav") != null) {
        goToContentLabel = findFromCountry();
    }
    else if(goToContentLabel == null && brandPage.getContentResource("topnav") != null) {
        goToContentLabel = findFromRoot();
    }
    else {
        goToContentLabel = findFromPage();
    }

    function findFromCountry() {
        return granite.resource.resolve(page.getPath()+"/jcr:content/topnav").then(function(res){
            if(res.properties['gotocontent'] != null)
                return res.properties['gotocontent'];
            else
                return findFromRoot();
        });
    }

    function findFromRoot() {
         return granite.resource.resolve(brandPage.getPath()+"/jcr:content/topnav").then(function(res){
            if(res.properties['gotocontent'] != null)
                return res.properties['gotocontent'];
            else {
                return findFromPage();
            }
        });
    }

    function findFromPage() {
        if(vm.containsKey("gotocontent")) {
            return vm.get("gotocontent", String.class);
        } else if(rootVm.containsKey("gotocontent")) {
            return rootVm.get("gotocontent", String.class);
        } else {
            return "Skip to main content";
        }
    }

    return {
        lang: lang,
        gotocontent: goToContentLabel
    }
});

