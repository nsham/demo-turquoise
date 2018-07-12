package com.usgbv3.core.servlets;

import com.usgbv3.core.constants.ApplicationConstants;
import com.usgbv3.core.services.StoreLocatorService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;

@Component(service=Servlet.class,
        property={
                Constants.SERVICE_DESCRIPTION + "=Get Auto Complete Store Locator",
                "sling.servlet.methods=" + HttpConstants.METHOD_GET,
                "sling.servlet.paths="+ "/bin/usg/storeAutoComplete"
        })
public class GetAutoSearchStoreSearch extends SlingSafeMethodsServlet {

    @Reference
    StoreLocatorService storeLocatorService;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws ServletException, IOException {
        RequestParameter pageURLParameter = request.getRequestParameter(ApplicationConstants.PAGE_URL);
        RequestParameter textParameter = request.getRequestParameter(ApplicationConstants.TEXT);
        String jsonResponse = "";
        if(pageURLParameter != null && textParameter != null){
            jsonResponse = storeLocatorService.getAutoSearch(pageURLParameter.getString()
                    , textParameter.getString(), request.getResourceResolver());
        }

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(jsonResponse);
        out.flush();
    }
}
