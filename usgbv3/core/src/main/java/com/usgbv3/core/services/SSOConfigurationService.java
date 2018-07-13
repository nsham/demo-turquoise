package com.usgbv3.core.services;

import java.util.Map;

public interface SSOConfigurationService {	
	public Map<String, String> getConfig(String hostname);
}