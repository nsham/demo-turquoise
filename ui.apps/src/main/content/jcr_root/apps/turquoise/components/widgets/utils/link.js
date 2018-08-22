"use strict";
use(['/apps/usgb/components/widgets/utils/utils.js'],function(utils){

    var link = this.link;

    link = utils.getFormattedLink(link);
    
    return {
        link:link
    };
});