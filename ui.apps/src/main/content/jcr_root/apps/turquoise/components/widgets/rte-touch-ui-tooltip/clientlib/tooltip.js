(function(){
    var ExperienceAEM = {
        TCP_UI_SETTING: "touchuitooltip#touchuitooltip",
        TCP_FEATURE: "touchuitooltip"
    };

    ExperienceAEM.CuiToolbarBuilder = new Class({
        toString: "EAEMCuiToolbarBuilder",

        extend: CUI.rte.ui.cui.CuiToolbarBuilder,

        _getUISettings: function(options) {
            var uiSettings = this.superClass._getUISettings(options);

            var items = uiSettings["inline"]["popovers"]["format"].items;

            if(items.indexOf(ExperienceAEM.TCP_UI_SETTING) == -1){
                items.push(ExperienceAEM.TCP_UI_SETTING);
            }

            items = uiSettings["fullscreen"]["toolbar"];

            if(items.indexOf(ExperienceAEM.TCP_UI_SETTING) == -1){
                items.splice(3, 0, ExperienceAEM.TCP_UI_SETTING);
            }

            if(!this._getClassesForCommand(ExperienceAEM.TCP_UI_SETTING)){
                this.registerAdditionalClasses(ExperienceAEM.TCP_UI_SETTING, "coral-Icon eaem-touchui-tooltip");
            }

            return uiSettings;
        }
    });

    ExperienceAEM.ToolkitImpl = new Class({
        toString: "EAEMCuiToolbarBuilder",

        extend: CUI.rte.ui.cui.ToolkitImpl,

        createToolbarBuilder: function() {
            return new ExperienceAEM.CuiToolbarBuilder();
        }
    });

    CUI.rte.ui.ToolkitRegistry.register("cui", ExperienceAEM.ToolkitImpl);

    //the color picker plugin for touch ui
    ExperienceAEM.TouchUITooltipPlugin = new Class({
        toString: "TouchUITooltipPlugin",

        extend: CUI.rte.plugins.Plugin,

        pickerUI: null,

        getFeatures: function() {
            return [ ExperienceAEM.TCP_FEATURE ];
        },

        initializeUI: function(tbGenerator) {
            var plg = CUI.rte.plugins;

            if (this.isFeatureEnabled(ExperienceAEM.TCP_FEATURE)) {
                this.pickerUI = tbGenerator.createElement(ExperienceAEM.TCP_FEATURE, this, true, "Tooltip");
                tbGenerator.addElement("format", plg.Plugin.SORT_FORMAT, this.pickerUI, 140);
            }
        },

        execute: function(id, value, envOptions) {
            this.editorKernel.relayCmd(id);
        },

        updateState: function(selDef) {
            var hasTooltip = this.editorKernel.queryState(ExperienceAEM.TCP_FEATURE, selDef);

            if (this.pickerUI != null) {
                this.pickerUI.setSelected(hasTooltip);
            }
        }
    });

    CUI.rte.plugins.PluginRegistry.register(ExperienceAEM.TCP_FEATURE,
                                                ExperienceAEM.TouchUITooltipPlugin);

    //the command for making text colored
    ExperienceAEM.TooltipCmd = new Class({
        toString: "TooltipCmd",

        extend: CUI.rte.commands.Command,

        isCommand: function(cmdStr) {
            return (cmdStr.toLowerCase() == ExperienceAEM.TCP_FEATURE);
        },

        getProcessingOptions: function() {
            var cmd = CUI.rte.commands.Command;
            return cmd.PO_SELECTION | cmd.PO_BOOKMARK | cmd.PO_NODELIST;
        },

        _getTagObject: function() {
            return {
                "tag": "a",
                "attributes": {
                    "class" : "lk2",
                    "role" : "button",
                    "data-toggle" : "popover",
                    "tabindex" : "0"
                }
            };
        },

        execute: function(execDef) {
            var selection = execDef.selection;

            if (!selection) {
                return;
            }

            var nodeList = execDef.nodeList;

            if (!nodeList) {
                return;
            }

            var common = CUI.rte.Common;
            var context = execDef.editContext;

            var tagObj = this._getTagObject();

            var tags = common.getTagInPath(context, selection.startNode, tagObj.tag, tagObj.attributes);

            if (tags == null) {
            	var tooltipList = nodeList.surround(execDef.editContext, tagObj.tag, tagObj.attributes);
            	var tooltipString = "";
            	for(var _i=0;_i<tooltipList.length;_i++) {
            		if(tooltipString != "")
            			tooltipString += " ";
            		tooltipString += tooltipList[_i].innerText.trim();
            	}
            	var tooltipDataId = tooltipString.split(" ").join("-");
            	for(var _i=0;_i<tooltipList.length;_i++) {
            		tooltipList[_i].setAttribute("data-string", tooltipString);
            		tooltipList[_i].setAttribute("data-target", "popover-"+tooltipDataId);
            	}
            } else {
                nodeList.removeNodesByTag(execDef.editContext, tagObj.tag, tagObj.attributes, true);
            }
        },

        queryState: function(selectionDef, cmd) {
            var common = CUI.rte.Common;
            var context = selectionDef.editContext;

            var selection = selectionDef.selection;
            var tagObj = this._getTagObject();

            return (common.getTagInPath(context, selection.startNode, tagObj.tag, tagObj.attributes) != null);
        }
    });

    CUI.rte.commands.CommandRegistry.register(ExperienceAEM.TCP_FEATURE, ExperienceAEM.TooltipCmd);

    //returns the picker dialog html
    //Handlebars doesn't do anything useful here, but the framework expects a template
    var cpTemplate = function(){
        CUI.rte.Templates["dlg-" + ExperienceAEM.TCP_DIALOG] =
            Handlebars.compile('<div data-rte-dialog="' + ExperienceAEM.TCP_DIALOG + '" class="coral--dark coral-Popover coral-RichText-dialog">'
                + '<div class="coral-RichText-dialog-columnContainer">'
                    + '<div class="coral-RichText-dialog-column">'
                    +   '<label class="coral-Form-fieldlabel">Select color </label>'
                    + '</div>'
                    + '<div class="coral-RichText-dialog-column">'
                        + '<span  class="coral-Form-field coral-ColorPicker">'
                            + '<button class="coral-ColorPicker-button coral-MinimalButton" type="button"></button>'
                        + '</span>'
                    + '</div>'
                    + '<div class="coral-RichText-dialog-column">'
                        + '<button data-type="apply" class="coral-RichText-dialogButton coral-Icon coral-Icon--check coral-Icon--sizeS coral-RichText--white coral-Button--primary"></button>'
                    + '</div>'
                    + '<div class="coral-RichText-dialog-column">'
                        + '<button data-type="cancel" class="coral-RichText-dialogButton coral-Icon coral-Icon--close coral-Icon--sizeS coral-RichText--white"></button>'
                    + '</div>'
                    + '<div class="coral-RichText-dialog-column">'
                        + '<button data-type="delete" class="coral-RichText-dialogButton coral-Icon coral-Icon--delete coral-Icon--sizeS coral-RichText--white coral-Button--warning"></button>'
                    + '</div>'
                + '</div>'
            + '</div>');
    };

    cpTemplate();
})();
