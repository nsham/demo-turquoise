var SlingSettingsService = Packages.org.apache.sling.settings.SlingSettingsService;
var Jsoup = Packages.org.jsoup.Jsoup;

"use strict";
use(function(){

    var 
    	
        getSVGId = function(pngPath) {
			
			if(!pngPath) return '';
			
			var startPos = pngPath.lastIndexOf('/') + 1,
            	endPos = pngPath.indexOf('.');

            return (startPos<endPos?pngPath.substring(startPos,endPos):'');
        },

        hashCode = function(s){
          return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
        },

        getPaddingClasses = function(d,t,m) {
            var padding = [];
            if(d) {
				padding.push('no-padding-md');
            }
            if(t) {
				padding.push('no-padding-sm');
            }
            if(m) {
				padding.push('no-padding-xs');
            }
            return padding.join(' ');
        },
        getMappedPath = function(path){
			var runmodesObj = {};
            var runmodesSet = sling.getService(SlingSettingsService).getRunModes();
            var iterator = runmodesSet.iterator();

            while (iterator.hasNext()) {
                runmodesObj[iterator.next()] = true;
            }

            mappedPath = path;
            if(runmodesObj['publish'] && path) {
				mappedPath = path.replace(/^\/content\/[^\/]+/,"");
            }
            return mappedPath;
        },
        getFormattedLink = function(link){
            if (link&&link.indexOf('/')==0&&link.indexOf('.')<0) {
                link+='.html';
            }
            return link
        },
        getProductTitle = function(resource) {
            var title = resource.properties['jcr:title'];
            return granite.resource.resolve(resource.path+'/title').then(function(res){
                var t = res.properties['jcr:title'];
                return (t? t : title);
            }).fail(function(){
				return title;
            });
        },
        doesTitleSupportLowercase = function(resource){
			return granite.resource.resolve(resource.path+'/title').then(function(res){
                var t = res.properties['allowLowercase'];
                return (t? true : false);
            }).fail(function(){
				return false;
            });
        },
        stripHtml = function(text) {
			return Jsoup.parse(text).text();
        }

    return {
        getSVG: getSVG,
        getHashCode: hashCode,
        findCookie: findCookie,
		getPaddingClasses: getPaddingClasses,
        getMappedPath: getMappedPath,
        getFormattedLink: getFormattedLink,
        getProductTitle: getProductTitle,
        doesTitleSupportLowercase: doesTitleSupportLowercase,
        stripHtml: stripHtml
    };
});