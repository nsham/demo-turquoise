"use strict";
use(['/apps/usgbv3/widgets/utils/utils.js', '/apps/usgbv3/widgets/utils/ColorPickerUtil.js'], function (utils, ColorPickerUtil) {
    var modalVideo = {};
    // generating a dynamic id for user to override css if they need it
	modalVideo.divID = utils.getHashCode(granite.resource.path);

    var CONST = {
        PROP_VIDEO_TITLE: "videotitle",
        PROP_FONT_COLOR_TITLE: "fontColortitle",
        COLOR_MAPPING_TITLE: "/cq:dialog/content/items/tabs/items/basic/items/column/items/titlefont-color/mappings",
        PROP_VIDEO_TYPE: "videoType",
        PROP_VIDEO_PATH: "videopath",
        PROP_VIDEO_URL: "url",
        PROP_VIDEO_BGIMAGE: "videobgimage"
        
    };
     
    var props = granite.resource.properties, fontColorTitle = props[CONST.PROP_FONT_COLOR_TITLE];
    
    // getting the header color class using colorpickerutils
    modalVideo.fontColorTitle = ColorPickerUtil.getFontColor(component.getPath() + CONST.COLOR_MAPPING_TITLE, fontColorTitle);
    //log.info("fontColorDescription final::"+fullopacityhovertileproperties.fontColorDescription);
    
    // populating video type
    var videoType = props[CONST.PROP_VIDEO_TYPE];
    if(videoType != null){
        if("internal".equals(videoType)){
            // it is an internal video
            modalVideo.isInternal="true";

            modalVideo.videoPath = props[CONST.PROP_VIDEO_PATH];
           
            if(modalVideo.videoPath == null){
                modalVideo.errMsg="Please enter Video Path";
            }
        }else{
             // it is an internal video
            var videoString = props[CONST.PROP_VIDEO_URL];
            
            if(videoString == null){
                modalVideo.errMsg="Please enter Video URL";
            }else{
                 modalVideo.videoURL = "https://www.youtube.com/embed/"+videoString+"?rel=0&enablejsapi=1";
            }
        }
    }


    
    return modalVideo; 
});  