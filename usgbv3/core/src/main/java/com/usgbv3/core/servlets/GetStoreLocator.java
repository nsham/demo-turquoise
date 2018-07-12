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
import java.io.IOException;
import java.io.PrintWriter;

@Component(service=Servlet.class,
        property={
                Constants.SERVICE_DESCRIPTION + "=Get store search Store Locator",
                "sling.servlet.methods=" + HttpConstants.METHOD_GET,
                "sling.servlet.paths="+ "/bin/usg/storeSearch"
        })
public class GetStoreLocator extends SlingSafeMethodsServlet {

    @Reference
    StoreLocatorService storeLocatorService;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws IOException {
        RequestParameter keyParameter = request.getRequestParameter(ApplicationConstants.KEY);
        RequestParameter textParameter = request.getRequestParameter(ApplicationConstants.TEXT);
        RequestParameter countryParameter = request.getRequestParameter(ApplicationConstants.COUNTRY);
        RequestParameter currentLocationParameter = request.getRequestParameter(ApplicationConstants.CURRENT_LOCATION);


        String jsonResponse = "";
        if(countryParameter != null
                && (keyParameter != null || textParameter != null || currentLocationParameter != null)){
            jsonResponse = storeLocatorService.getStoreSearch(keyParameter, textParameter, countryParameter
                    , currentLocationParameter, request.getResourceResolver());
        }

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.print(jsonResponse);
        out.flush();
    }
}
