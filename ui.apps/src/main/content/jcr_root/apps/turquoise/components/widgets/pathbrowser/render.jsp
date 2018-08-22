<%--
    ORIGINAL FILE: /libs/granite/ui/components/foundation/form/pathbrowser/
  ADOBE CONFIDENTIAL

  Copyright 2013 Adobe Systems Incorporated
  All Rights Reserved.

  NOTICE:  All information contained herein is, and remains
  the property of Adobe Systems Incorporated and its suppliers,
  if any.  The intellectual and technical concepts contained
  herein are proprietary to Adobe Systems Incorporated and its
  suppliers and may be covered by U.S. and Foreign Patents,
  patents in process, and are protected by trade secret or copyright law.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe Systems Incorporated.
--%><%@page import="com.usgb.core.drm.utils.DrmUtils"%>
<%@page import="org.apache.sling.commons.json.JSONObject"%>
<%
%><%@include file="/libs/granite/ui/global.jsp" %><%
%><%@page session="false"
          import="org.apache.jackrabbit.util.Text,
                  com.adobe.granite.ui.components.AttrBuilder,
                  com.adobe.granite.ui.components.Config,
                  com.adobe.granite.ui.components.Field,
                  com.adobe.granite.ui.components.Tag" %><%

    Config cfg = cmp.getConfig();
    ValueMap vm = (ValueMap) request.getAttribute(Field.class.getName());

    Field field = new Field(cfg);
    boolean mixed = field.isMixed(cmp.getValue());

    boolean disabled = cfg.get("disabled", false);
    String predicate = cfg.get("predicate", "hierarchyNotFile"); // 'folder', 'hierarchy', 'hierarchyNotFile' or 'nosystem'
    String defaultOptionLoader = "granite.ui.pathBrowser.pages." + predicate;
    Tag tag = cmp.consumeTag();
    String rootPath = cmp.getExpressionHelper().getString(cfg.get("rootPath", "/"));
    
    
    
    //usgb code
    String customRoot = null;
    String pageUri = request.getRequestURI().toString();
    JSONObject projectProp = DrmUtils.getDamProjectProperties(resourceResolver);
    boolean isDrmProjectEnabled = projectProp.optBoolean(DrmUtils.PROJECT_ENABLED);
    if(isDrmProjectEnabled){
    	JSONObject countryConfigJsonObj =  DrmUtils.getCountryConfigBasedOnContentPath(resourceResolver, pageUri, true);
        if(countryConfigJsonObj != null){
        	String damFolderRoot = countryConfigJsonObj.optString("countryDamFolder");
        	if(damFolderRoot != null && damFolderRoot.trim() != ""){
        		customRoot = damFolderRoot;
        	}
        }
    }
    if(customRoot != null){
    	rootPath = customRoot;
    }
    
    
    
    
    AttrBuilder attrs = tag.getAttrs();

    attrs.add("id", cfg.get("id", String.class));
    attrs.addClass(cfg.get("class", String.class));
    attrs.addRel(cfg.get("rel", String.class));
    attrs.add("title", i18n.getVar(cfg.get("title", String.class)));
    
    attrs.addClass("coral-PathBrowser");
    attrs.add("data-init", "pathbrowser");
    attrs.add("data-root-path", rootPath);
    attrs.add("data-option-loader", cfg.get("optionLoader", defaultOptionLoader));
    attrs.add("data-option-loader-root", cfg.get("optionLoaderRoot", String.class));
    attrs.add("data-option-value-reader", cfg.get("optionValueReader", String.class));
    attrs.add("data-option-title-reader", cfg.get("optionTitleReader", String.class));
    attrs.add("data-option-renderer", cfg.get("optionRenderer", String.class));
	attrs.add("data-autocomplete-callback", cfg.get("autocompleteCallback", String.class));

    if (disabled) {
        attrs.add("data-disabled", disabled);
    }

    String defaultPickerSrc = "/libs/wcm/core/content/common/pathbrowser/column.html" + Text.escapePath(rootPath) + "?predicate=" + Text.escape(predicate);
    String pickerSrc = cfg.get("pickerSrc", defaultPickerSrc);
    Resource rootResource = resourceResolver.getResource(rootPath);
    String crumbRoot = i18n.getVar("Home");
    if (rootResource != null) {
        crumbRoot = rootResource.getValueMap().get("jcr:title", rootResource.getName());
    }
    String icon = cfg.get("icon", "icon-folderSearch");

    attrs.add("data-picker-src", pickerSrc);
    attrs.add("data-picker-title", i18n.getVar(cfg.get("pickerTitle", String.class)));
    attrs.add("data-picker-value-key", cfg.get("pickerValueKey", String.class));
    attrs.add("data-picker-id-key", cfg.get("pickerIdKey", String.class));
    attrs.add("data-crumb-root", cfg.get("crumbRoot", crumbRoot));
    attrs.add("data-picker-multiselect", cfg.get("pickerMultiselect", false));

    if (mixed) {
        attrs.addClass("foundation-field-mixed");
    }

    attrs.addOthers(cfg.getProperties(), "id", "class", "rel", "title", "name", "value", "emptyText", "disabled", "rootPath", "optionLoader", "optionLoaderRoot", "optionValueReader", "optionTitleReader", "optionRenderer", "renderReadOnly", "fieldLabel", "fieldDescription", "required", "icon");

    AttrBuilder inputAttrs = new AttrBuilder(request, xssAPI);
    inputAttrs.addClass("coral-InputGroup-input coral-Textfield");
    inputAttrs.addClass("js-coral-pathbrowser-input");
    inputAttrs.add("type", "text");
    inputAttrs.add("name", cfg.get("name", String.class));
    inputAttrs.add("autocomplete", "off");
    inputAttrs.addDisabled(disabled);

    if (mixed) {
        inputAttrs.add("placeholder", i18n.get("<Mixed Entries>"));
    } else {
        inputAttrs.add("value", vm.get("value", String.class));
        inputAttrs.add("placeholder", i18n.getVar(cfg.get("emptyText", String.class)));
    }

    if (cfg.get("required", false)) {
        inputAttrs.add("aria-required", true);
    }

%><span <%= attrs.build() %>><%
    %><span class="coral-InputGroup coral-InputGroup--block"><%
        %><input <%= inputAttrs.build() %>><%
        %><span class="coral-InputGroup-button"><%
            %><button class="coral-Button coral-Button--square js-coral-pathbrowser-button" type="button" title="<%= xssAPI.encodeForHTMLAttr(i18n.get("Browse")) %>"><%
                %><i class="coral-Icon coral-Icon--sizeS <%= cmp.getIconClass(icon) %>"></i><%
            %></button><%
        %></span><%
    %></span><%
%></span>