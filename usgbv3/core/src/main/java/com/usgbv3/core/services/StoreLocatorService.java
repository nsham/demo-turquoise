package com.usgbv3.core.services;

import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;

import java.util.Map;

public interface StoreLocatorService {
    String getAllStates(String countryCode, ResourceResolver resourceResolver);

    String getAutoSearch(String pageURL, String text, ResourceResolver resourceResolver);

    String getStoreSearch(RequestParameter pageURLParameter, RequestParameter textParameter, RequestParameter countryParameter, RequestParameter currentLocationParameter, ResourceResolver resourceResolver);
    Map<String, Object> getStoreFilter(ValueMap storeLocatorFilterProperties);
}
