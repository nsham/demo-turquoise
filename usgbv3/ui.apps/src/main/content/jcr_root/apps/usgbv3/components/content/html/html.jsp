<%--

  HTML component.


--%>
<%
%><%@include file="/apps/usgb/global/global.jsp"%><%
%>
<%-- <%@include file="/src/main/content/jcr_root/apps/usgb/global/global.jsp"%> --%>
<%
%><%@page session="false"%>

<c:if test="<%=WCMMode.fromRequest(request) == WCMMode.EDIT || WCMMode.fromRequest(request) == WCMMode.DESIGN %>">
	<% Resource compRes = resource.getResourceResolver().getResource(resource.getResourceType().toString()); 
		Node nodeD = compRes.adaptTo(Node.class);
	%>
	<p><%=compRes.getValueMap().get("jcr:title")%></p>
</c:if>

<cq:text property="html"/>

    

