package com.usgbv3.core.servlets;


import com.day.cq.wcm.api.Page;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.usgbv3.core.constants.ApplicationConstants;
import com.usgbv3.core.services.CaptchaService;
import com.usgbv3.core.services.ContactUSFormService;
import com.usgbv3.core.utils.CountryUtils;
import com.usgbv3.core.utils.StringUtils;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Component(service=Servlet.class,
property={
        Constants.SERVICE_DESCRIPTION + "=Retrieve Page Properties",
        "sling.servlet.methods=" + HttpConstants.METHOD_GET,
        "sling.servlet.paths="+ "/bin/usgb/pageproperty",
        "sling.servlet.resourceTypes="+ "cq:Page",
        "sling.servlet.selectors="+ "properties",
        "sling.servlet.extensions="+ "json"
})
public class PagePropertyServlet  extends BaseAllMethodsServlet {

    /**
	 * 
	 */
	private static final long serialVersionUID = -8811236444436438274L;

	private static final Logger LOG = LoggerFactory.getLogger(ContactUSBasicServlet.class);

	private static final String JSON_KEY_PAGE_PROPERTIES_lIST = "pagePropertiesList";
	private static final String MASTERTEMPLATE3 = "mastertemplate3";
	private static final String PRODUCT_PREFIX = "/products";
	
    @Reference
    ContactUSFormService contactUSFormService;

    @Reference
    CaptchaService captchaService;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws IOException {

    	response.setCharacterEncoding("utf-8");
    	JSONObject pagePropertiesList = new JSONObject();
    	
    	 try {
    		 
    		 String pageURL = null;
	        if(request.getRequestURI() != null){
	            try {
	                String refererURI = request.getRequestURI();
	                if(refererURI != null && refererURI.endsWith(".properties.json")){
	                    pageURL = refererURI.replace(".properties.json", "");
	                }
	            } catch (Exception e) {
	                LOG.error("URI SyntaxExvception is :"+e);
	            }
	        }else{
	            RequestParameter pageURLParameter = request.getRequestParameter(ApplicationConstants.PAGE_URL);
	            if(pageURLParameter != null){
	                pageURL = pageURLParameter.getString();
	            }else {
	            	String pathListJsonArrayStr = request.getParameter("paths");
	    			
	    	        if(StringUtils.isBlank(pathListJsonArrayStr)){
	    				String resourcePath = request.getResource().getPath();
	    				pathListJsonArrayStr = StringUtils.isNotBlank(resourcePath) ?
	    						String.format("[\"%s\"]", resourcePath) : null;
	    	        }
	    						
	    	        ResourceResolver resourceResolver = request.getResourceResolver();
	    			List<String> pathList = new ArrayList<String>();
	    			JSONArray pathJsonArray = new JSONArray(pathListJsonArrayStr);
	    			
	    			for(int i=0; i < pathJsonArray.length(); i++){
	    				String path = pathJsonArray.optString(i);
	    				if(StringUtils.isNotBlank(path)){
	    					pathList.add(path);
	    				}
	    			}
	    			
	    			pageURL = pathList.get(0);
	            }
	        }
	        
	        ResourceResolver resourceResolver = request.getResourceResolver();
	        Page contentPage = resourceResolver.resolve(pageURL).adaptTo(Page.class); 
	        
	        if(contentPage != null) {
	        	
	        	JSONArray pagePropertiesListArray = new JSONArray();
	        	pagePropertiesListArray.put(getBasicInfo(contentPage));
	        	pagePropertiesListArray.put(getAdvanceInfo(resourceResolver, contentPage));
				
	        	pagePropertiesListArray = mergeAll(pagePropertiesListArray);
				pagePropertiesList.put(JSON_KEY_PAGE_PROPERTIES_lIST, pagePropertiesListArray);
				
				
	        }
			
//	        JSONObject jsonObj = new JSONObject();
//			String jsonData = "testtttaa";
//			jsonObj.put("test", jsonData);
//			jsonObj.put("uri", pageURL);
//			jsonObj.put("ParameterNames", request.getRequestURI());
//			jsonObj.put("ParameterNrefererames", pageURL);
//			
//			JSONArray pagePropertiesListArray = new JSONArray();
//			pagePropertiesListArray.put(jsonObj);
//			
//			
//			pagePropertiesList.put(JSON_KEY_PAGE_PROPERTIES_lIST, pagePropertiesListArray);
			
			setJsonResponseOk(response, pagePropertiesList.toString());
			
			
			
	        
			
			
	        
    	 }catch (Exception e) {
			// TODO: handle exception
		}
    	

    }
    
    public JSONObject getBasicInfo(Page contentPage) {
    	
    	JSONObject basicInfoObject = new JSONObject();
    	
    	try {
    		ValueMap pageProperties = contentPage.getProperties();
    		
			basicInfoObject.put("pageTitle", contentPage.getTitle());
			basicInfoObject.put("pageDescription", contentPage.getDescription());			
			basicInfoObject.put("uri", contentPage.getPath());
			
			if(pageProperties.containsKey("pageImage")) {
    			basicInfoObject.put("pageImage", pageProperties.get("pageImage").toString());
    		}
			
			
			
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    	
    	return basicInfoObject;
    	
    }
    
    public JSONObject getAdvanceInfo(ResourceResolver resourceResolver, Page contentPage) {
    	
    	JSONObject basicInfoObject = new JSONObject();
    	
    	try {

    		Map<String, String> countryInfo = CountryUtils.retrieveUsgbCountrybyPath(resourceResolver, contentPage.getPath());
    		
    		if(countryInfo != null) {
    			basicInfoObject.put("countryCode", countryInfo.get("countryCode"));
    		}
    		
        	if(getPageTemplate(contentPage).equalsIgnoreCase(MASTERTEMPLATE3)) {
        		
        		ValueMap pageProperties = contentPage.getProperties();
        		
        		basicInfoObject.put("categoryName", MASTERTEMPLATE3);
        		
        		JSONObject pageCategory = getPageCategory(resourceResolver, countryInfo.get("sitePath") + PRODUCT_PREFIX, contentPage.getPath());
        		
        		basicInfoObject.put("categoryKey", pageCategory.get("key").toString());
        		basicInfoObject.put("categoryName", pageCategory.get("name").toString());
        		
        		JSONArray comparisonPropertiesList = new JSONArray();
        		JSONObject comparisonProperties = new JSONObject();
        		if(pageProperties.containsKey("physicalProperties")) {
        			comparisonProperties.put("physicalProperties", pageProperties.get("physicalProperties").toString());
        		}
        		
        		if(pageProperties.containsKey("featuresAndBenefits")) {
        			comparisonProperties.put("featuresAndBenefits", pageProperties.get("featuresAndBenefits").toString());
        		}
        		
        		if(pageProperties.containsKey("applications")) {
        			comparisonProperties.put("applications", pageProperties.get("applications").toString());
        		}
        		
        		if(pageProperties.containsKey("sustainability")) {
        			comparisonProperties.put("sustainability", pageProperties.get("sustainability").toString());
        		}
        		
        		comparisonPropertiesList.put(comparisonProperties);
        		basicInfoObject.put("comparisonProperties", comparisonPropertiesList);
        		

        	}
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    	
    	
    	return basicInfoObject;
    }
    
    private String getPageTemplate(Page page){
		String pageTemplateStr = page.getProperties().get("cq:template", String.class);
		
		String[] teplatePathElements = pageTemplateStr.split("/");
		if(teplatePathElements != null && teplatePathElements.length > 0){
			pageTemplateStr = teplatePathElements[teplatePathElements.length - 1];
		}
		
		return pageTemplateStr;
	}
	
	public JSONObject getPageCategory(ResourceResolver resourceResolver, String homePage, String pagePath) {
		JSONObject category = new JSONObject();

		LOG.info("getPageCategory Start = " + homePage + "  |  " + pagePath);
		
		if(pagePath.contains("jcr:content")) {
			pagePath = pagePath.substring(0,pagePath.indexOf("jcr:content"));
		}
		Page contentPage = resourceResolver.resolve(pagePath).adaptTo(Page.class); 
		
		
		try {
			
			
			LOG.info("getPageCategory pagePath = " + pagePath);
			
			if(pagePath.indexOf(homePage) > -1) {
//				LOG.info("getPageCategory indexOf > -1 = " + pagePath);
				
				if(homePage.equals(pagePath)) {

//					LOG.info("getPageCategory equals = " + pagePath);
					Page parentPage = contentPage.getParent(); 
					
					category.put("key", "homepage");
					category.put("name", "Home Page");
					
				}else {
					
					if(!(homePage.equals(contentPage.getParent().getPath()))) {

//						LOG.info("getPageCategory if = " + pagePath);
						category = getPageCategory(resourceResolver, homePage, contentPage.getParent().getPath());
						
					}else {

//						LOG.info("getPageCategory else = " + pagePath);
						
						category.put("key", contentPage.getName());
						category.put("name", contentPage.getTitle());
					}
				}
				
			}else {

				LOG.info("getPageCategory indexOf not = " + pagePath);
				category.put("key", "others");
				category.put("name", "Others");
			}
			
				
			
			
		}catch (Exception e) {
			LOG.info("getPageCategory ERROR = " + e.getMessage());
		}
		
		
		
		
		return category;
	}
	
	public JSONArray mergeAll(JSONArray jsonArray) {
		
		JSONArray mergeArray = new JSONArray();
		JSONObject combined = new JSONObject();
		
		try {
			for(int i = 0; i < jsonArray.length(); i++) {
				
				JSONObject jsonObj = jsonArray.getJSONObject(i);
				Iterator it = jsonObj.keys();
			    while (it.hasNext()) {
			        String key = (String)it.next();
			        combined.put(key, jsonObj.get(key));
			    }
			}
		}catch (Exception e) {
			// TODO: handle exception
		}
		
		mergeArray.put(combined);
		
		return mergeArray;
		
	}
    	
    	
    	
}
