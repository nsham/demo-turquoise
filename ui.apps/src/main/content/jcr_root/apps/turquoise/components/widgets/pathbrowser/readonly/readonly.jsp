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
          import="org.apache.jackrabbit.JcrConstants,
                  org.apache.sling.api.resource.ResourceUtil,
                  com.adobe.granite.ui.components.AttrBuilder,
                  com.adobe.granite.ui.components.Config,
                  com.adobe.granite.ui.components.Tag,
                  org.apache.jackrabbit.util.Text" %><%

    Config cfg = cmp.getConfig();
	
	Tag tag = cmp.consumeTag();
    AttrBuilder attrs = tag.getAttrs();

    String fieldLabel = cfg.get("fieldLabel", String.class);
    String value = cmp.getValue().val(cmp.getExpressionHelper().getString(cfg.get("value", "")));
    String readOnlyURITemplate = cfg.get("readOnlyURITemplate", String.class);
    String url = null;
    if (readOnlyURITemplate != null) {
        // replace occurrences of '{+value}' and '{value}' with pathbrowser value in url template
        url = readOnlyURITemplate.replaceAll("\\{\\+?value\\}", Text.escape(value));
    }

    Resource targetRes = resourceResolver.getResource(value);
    if (targetRes != null) {
        Resource targetContent = targetRes.getChild(JcrConstants.JCR_CONTENT);
        if (targetContent != null) {
            ValueMap contentVm = ResourceUtil.getValueMap(targetContent);
            String targetTitle = contentVm.get("jcr:title", String.class);
            if (targetTitle != null) {
                value = targetTitle;
            }
        }
    }

    // final encoded value to display
    String htmlValue = xssAPI.encodeForHTML(value);
    if (url != null) {
        htmlValue = "<a href=\"" + xssAPI.getValidHref(url) + "\" class=\"coral-Link\">" + htmlValue + "</a>";
    }

    if (cmp.getOptions().rootField()) {
        attrs.addClass("coral-Form-fieldwrapper");
        
        %><span <%= attrs.build() %>><%
	        if (fieldLabel != null) {
	            %><label class="coral-Form-fieldlabel"><%= outVar(xssAPI, i18n, fieldLabel) %></label><%
	        }
	        %><span class="coral-Form-field"><%= htmlValue %></span
        ></span><%
    } else {
        %><span <%= attrs.build() %>><%= htmlValue %></span><%
    }
%>