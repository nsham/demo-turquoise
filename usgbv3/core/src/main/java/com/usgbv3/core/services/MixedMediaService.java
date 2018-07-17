package com.usgbv3.core.services;

import org.apache.sling.api.resource.ResourceResolver;

public interface MixedMediaService {
    int getMixedMediaCountInPage(String pagePath, ResourceResolver resourceResolver);
}
