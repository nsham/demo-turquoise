package com.usgbv3.core.services;

import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.ResourceResolver;

public interface StoreLocatorService {
    String getAllStates(String countryCode, ResourceResolver resourceResolver);

    String getAutoSearch(String pageURL, String text, ResourceResolver resourceResolver);

    String getStoreSearch(RequestParameter pageURLParameter, RequestParameter textParameter, RequestParameter countryParameter, RequestParameter currentLocationParameter, ResourceResolver resourceResolver);
}
