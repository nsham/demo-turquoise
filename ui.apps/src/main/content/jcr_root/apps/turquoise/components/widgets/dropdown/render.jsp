<%--
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
--%><%
%><%@include file="/libs/granite/ui/global.jsp" %><%
%><%@page session="false"
          import="java.util.Arrays,
                  java.util.Iterator,
                  java.util.List,
                  com.day.cq.wcm.api.Page,
                  com.adobe.granite.ui.components.AttrBuilder,
                  com.adobe.granite.ui.components.Config,
                  com.adobe.granite.ui.components.Field,
                  com.adobe.granite.ui.components.Tag"%><%

log.warn("@deprecated /libs/granite/ui/components/foundation/form/dropdown; please use /libs/granite/ui/components/foundation/form/select instead.");

Config cfg = cmp.getConfig();
ValueMap vm = (ValueMap) request.getAttribute(Field.class.getName());

String type = cfg.get("type", String.class);
List<String> values = Arrays.asList(vm.get("value", new String[0]));

Tag tag = cmp.consumeTag();
AttrBuilder attrs = tag.getAttrs();

attrs.add("id", cfg.get("id", String.class));
attrs.addClass(cfg.get("class", String.class));
attrs.addRel(cfg.get("rel", String.class));
attrs.add("title", i18n.getVar(cfg.get("title", String.class)));

attrs.addClass("coral-Select");
attrs.add("data-init", "select");

attrs.addOthers(cfg.getProperties(), "id", "class", "rel", "title", "name", "text", "emptyText", "type", "disabled", "optionPath", "fieldLabel", "fieldDescription", "renderReadOnly", "ignoreData");

AttrBuilder buttonAttrs = new AttrBuilder(request, xssAPI);
buttonAttrs.add("type", "button");
buttonAttrs.addDisabled(cfg.get("disabled", false));
buttonAttrs.addClass("coral-Select-button coral-MinimalButton");

AttrBuilder selectAttrs = new AttrBuilder(request, xssAPI);
selectAttrs.add("name", cfg.get("name", String.class));
selectAttrs.addDisabled(cfg.get("disabled", false));
selectAttrs.addClass("coral-Select-select");

if ("multiple".equals(type)) {
    selectAttrs.addMultiple(true);
} else if ("editable".equals(type)) {
    log.warn("@deprecated /libs/granite/ui/components/foundation/form/dropdown; type=editable is no longer supported.");
}

Iterator<Resource> items = cfg.getItems();

String optionPath = cfg.get("optionPath", String.class);
if (optionPath != null) {
    Resource optionResource = resourceResolver.getResource(optionPath);
    if (optionResource != null) {
        items = optionResource.listChildren();
    }
}

// To retrieve from current website
String loadFromContentPath = cfg.get("loadFromContentPath", "");

if(loadFromContentPath.equals("")) {
%><span <%= attrs.build() %>>
	<button <%= buttonAttrs.build() %>>
	    <span class="coral-Select-button-text"><%= outVar(xssAPI, i18n, cfg.get("text", "")) %></span>
	</button>
	<select <%= selectAttrs.build() %>><%
		while (items.hasNext()) {
	        Config itemConfig = new Config(items.next());

	        String value = itemConfig.get("value", "");

	        AttrBuilder optionAttrs = new AttrBuilder(request, xssAPI);
	        optionAttrs.addSelected(values.contains(value));
	        optionAttrs.add("value", value);

	        %><option <%= optionAttrs.build() %>><%
	            if (!cfg.get("doNotTranslateOptions", false)) {
	                %><%= outVar(xssAPI, i18n, itemConfig.get("text", "")) %><%
	            } else {
	                %><%= xssAPI.encodeForHTML(itemConfig.get("text", "")) %><%
	            }
	        %></option><%
	    }
	%></select>
</span><%
} else {
    String contentPath = request.getParameter("item");
    if(contentPath == null)
        contentPath = request.getPathInfo().substring(request.getPathInfo().indexOf(".html") + 5, request.getPathInfo().length());

        if(contentPath != null) {
            List<String> paths = Arrays.asList(contentPath.split("/"));
            paths = paths.subList(0, 4);
            StringBuilder sb = new StringBuilder();
            for (String s : paths)
            {
                sb.append(s);
                sb.append("/");
            }

            sb.append(loadFromContentPath);

            contentPath = sb.toString();
        }

        Resource navResource = resourceResolver.getResource(contentPath);
        Iterator<Page> pages = null;
        if(navResource != null) {
            Page navPage = navResource.adaptTo(Page.class);
            if(navPage != null) pages = navPage.listChildren();
        }
%><span <%= attrs.build() %>>
	<button <%= buttonAttrs.build() %>>
	    <span class="coral-Select-button-text"><%= outVar(xssAPI, i18n, cfg.get("text", "")) %></span>
	</button>
<select <%= selectAttrs.build() %>><option value="Default">None</option><%
	    if(pages != null) {
            while (pages.hasNext()) {
                Page item = pages.next();
                Config itemConfig = new Config(item.getContentResource());

                String value = item.getName();

                AttrBuilder optionAttrs = new AttrBuilder(request, xssAPI);
                optionAttrs.addSelected(values.contains(value));
                optionAttrs.add("value", value);

                %><option <%= optionAttrs.build() %>><%
                    if (!cfg.get("doNotTranslateOptions", false)) {
                        %><%= outVar(xssAPI, i18n, item.getTitle()) %><%
                    } else {
                        %><%= xssAPI.encodeForHTML(item.getTitle()) %><%
                    }
                %></option><%
            }
        }
	%></select>
</span><%}%>