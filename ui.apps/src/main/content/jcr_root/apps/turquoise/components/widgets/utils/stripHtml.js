"use strict";
use(['/apps/usgb/components/widgets/utils/utils.js'],function(utils){

    var text = this.text;

    text = utils.stripHtml(text);
    
    return {
        text:text
    };
});