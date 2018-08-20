"use strict";

/**
 * 
 */
use(["/apps/turquoise/widgets/utils/MarginUtils.js",'/apps/turquoise/widgets/utils/utils.js'], function (MarginUtils, utils) {

    var padding = utils.getPaddingClasses(
        granite.resource.properties['dhidepadding'],
        granite.resource.properties['thidepadding'],
        granite.resource.properties['mhidepadding']
    ), rowpadding = utils.getRowPaddingClasses(
        granite.resource.properties['dhidepadding'],
        granite.resource.properties['thidepadding'],
        granite.resource.properties['mhidepadding'],
        false,
        false,
        false,
        false,
        false,
        false
    );

    return {
    	mgnCls: MarginUtils.mgnCls.join(" "),
        padding: padding,
        rowpadding: rowpadding
    };
    
});
/*
	Lorem Ipsum
*/