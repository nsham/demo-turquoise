package com.usgbv3.core.services.impl;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.usgbv3.core.services.StoreLocatorService;
import com.usgbv3.core.utils.CountryUtils;
import com.usgbv3.core.utils.GenericUtils;
import com.usgbv3.core.utils.StringUtils;
import org.apache.sling.api.request.RequestParameter;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.*;

@Component(immediate = true, service = StoreLocatorService.class
        , configurationPid = "com.usgbv3.core.services.impl.StoreLocatorServiceImpl")
public class StoreLocatorServiceImpl implements StoreLocatorService{

    private static Logger LOG = LoggerFactory.getLogger(StoreLocatorServiceImpl.class);

    @Reference
    QueryBuilder queryBuilder;

    @Override
    public String getAllStates(String countryCode, ResourceResolver resourceResolver) {
        String lang= null , country=null;
        Set<String> statesNameSet = new HashSet();

        if(StringUtils.isNotBlank(countryCode)){
            if(countryCode.indexOf("_")!= -1){
                String[] countryLanguageArray = countryCode.split("_");
                if(countryLanguageArray != null && countryLanguageArray.length==2){
                    lang=countryLanguageArray[0];
                    country =countryLanguageArray[1];
                }
            }
            //LOG.info("lang :"+lang +" country:"+country);
            if(country != null){
                String countryLanguagePath = CountryUtils.getCountry(resourceResolver, country, lang);
                //LOG.info("countryLanguagePath:"+countryLanguagePath);
                if(countryLanguagePath != null){
                    if(!countryLanguagePath.endsWith("/")){
                        countryLanguagePath = countryLanguagePath+"/";
                    }
                    Resource storeLocationResource = resourceResolver.resolve(countryLanguagePath + "storelocations");
                   // LOG.info("storeLocationResource:"+storeLocationResource);
                    if(storeLocationResource != null){
                        ValueMap storeValueMap = null;
                        Iterable<Resource> storeIterator = storeLocationResource.getChildren();
                        for(Resource store: storeIterator){
                            storeValueMap = store.getValueMap();
                            if(storeValueMap.containsKey("state")){
                                statesNameSet.add(storeValueMap.get("state").toString());
                            }
                        }
                    }
                }
            }

        }
        if(statesNameSet.size()>0){
            List sortedList = new ArrayList(statesNameSet);
            Gson gson = new Gson();
            return gson.toJson(sortedList);
        }
        return null;
    }

    @Override
    public String getAutoSearch(String pageURL, String text, ResourceResolver resourceResolver) {
        LOG.info("pageURL:"+pageURL);
        JsonArray resultJsonArray = null;
        Gson gson = new Gson();
        Map<String, String> autoSearchConfiguration = new LinkedHashMap<>();
        if(pageURL != null){
            String completePageURL="";
            if(!pageURL.startsWith("/content/usgboral")){
                completePageURL = "/content/usgboral"+pageURL;
            }else{
                completePageURL = pageURL;
            }

            Map<String, String>  queryMap = new HashMap<>();
            // forming query filter
            queryMap.put("type", "nt:unstructured");
            queryMap.put("path", completePageURL);
            queryMap.put("property", "sling:resourceType");
            queryMap.put("property.1_value", "usgbv3/components/content/where-to-buy");

            // logging the query
            GenericUtils.logQuery(LOG, queryMap);

            // querying the data
            Session session = resourceResolver.adaptTo(Session.class);
            Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), session);
            SearchResult result = query.getResult();
            List<Hit> hitsList = result.getHits();
            if(hitsList != null && hitsList.size()>0){
                LOG.info("hitList size:"+hitsList.size());
                // get the properties
                Resource autoSearchResource = null;
                try {
                    autoSearchResource = hitsList.get(0).getResource();
                    if(autoSearchResource != null){
                        ValueMap autoSearchNodeVM = autoSearchResource.getValueMap();
                        if(autoSearchNodeVM != null && autoSearchNodeVM.containsKey("matchField")){
                            autoSearchConfiguration.put("matchField", autoSearchNodeVM.get("matchField").toString());
                        }
                       /* if(autoSearchNodeVM.containsKey("isGlobal")){
                            autoSearchConfiguration.put("isGlobal", autoSearchNodeVM.get("isGlobal").toString());
                        }*/
                        if(autoSearchNodeVM.containsKey("proximityMatchField")){
                            autoSearchConfiguration.put("proximityMatchField", autoSearchNodeVM.get("proximityMatchField").toString());
                        }
                        if(autoSearchNodeVM.containsKey("wordLength")){
                            autoSearchConfiguration.put("wordLength", autoSearchNodeVM.get("wordLength").toString());
                        }
                    }
                } catch (RepositoryException e) {
                    LOG.error("Repository Exception is :"+e);
                }
            }
        }
        LOG.info("properties set in page is :"+autoSearchConfiguration);

        // get the properties and form the query  to get the results and form json
        if(autoSearchConfiguration.size()>0){
            String storeLocationPath = null, proximityLocationPath=null;
            if(pageURL != null && pageURL.indexOf("/")!= -1){
                String country=null;
                if(pageURL.startsWith("/content/usgboral")){
                    pageURL = pageURL.replace("/content/usgboral", "");
                }
                String[] pageURLSlashSplitArray = pageURL.split("/");
                for(String pageURLPath : pageURLSlashSplitArray){
                    if(StringUtils.isNotBlank(pageURLPath)){
                        country=pageURLPath;
                        break;
                    }
                }

                if(StringUtils.isNotBlank(country)){
                    storeLocationPath = "/content/usgboral/"+country+"/storelocations";
                    proximityLocationPath = "/content/usgboral/"+country+"/proximitylocations";
                }
            }
            LOG.info("storeLocationPath:"+storeLocationPath);
            LOG.info("proximityLocationPath:"+proximityLocationPath);
            String[] matchFieldsArray = null;
            if(StringUtils.isNotBlank(storeLocationPath)){
                if(autoSearchConfiguration.containsKey("matchField")){
                    String matchFieldCSV = autoSearchConfiguration.get("matchField");
                    resultJsonArray = getAutoSearchJsonElements(text, resourceResolver, resultJsonArray
                            , storeLocationPath, matchFieldCSV, "");
                }
            }

            // if store excel doesnt contain the match criteria and we have proximity search defined in properties
            if((resultJsonArray == null || (resultJsonArray != null && resultJsonArray.size()==0)) && StringUtils.isNotBlank(proximityLocationPath) && autoSearchConfiguration.containsKey("proximityMatchField")){
                LOG.info("resultJsonArray is null so searching in  proximity data");
                String proximityMatchFieldCSV = autoSearchConfiguration.get("proximityMatchField");
                resultJsonArray = getAutoSearchJsonElements(text, resourceResolver, resultJsonArray
                        , proximityLocationPath, proximityMatchFieldCSV, "proximity_");
            }

        }
        if(resultJsonArray != null){
            JsonObject resultJson = new JsonObject();
            resultJson.add("Items", resultJsonArray);
            return gson.toJson(resultJson);
        }
        return null;
    }

    private JsonArray getAutoSearchJsonElements(String searchText, ResourceResolver resourceResolver
            , JsonArray resultJsonArray, String path, String matchFieldCSV, String prefix) {
        String[] matchFieldsArray;
        Map<String, String> queryMap;
        matchFieldsArray = matchFieldCSV.split(",");
        if(matchFieldsArray != null && matchFieldsArray.length>0){
            Session session = resourceResolver.adaptTo(Session.class);
            SearchResult result = null;
            List<Hit> hitsList = null;
            resultJsonArray = new JsonArray();
            JsonObject tempJsonObject = new JsonObject();
            Map<String, String> dataMap = new LinkedHashMap<>();
            for(String matchField : matchFieldsArray){
                if(StringUtils.isNotBlank(matchField)){
                    queryMap = new LinkedHashMap<>();
                    queryMap.put("path", path);
                    queryMap.put("type", "nt:unstructured");
                    queryMap.put("fulltext", "*"+searchText+"*");
                    queryMap.put("fulltext.relPath", "@"+matchField);
                    // logging the querymap
                    GenericUtils.logQuery(LOG, queryMap);

                    Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), session);
                    result = query.getResult();
                    hitsList = result.getHits();
                    Resource resultResource = null;
                    for(Hit hit: hitsList){
                        try {
                            resultResource = hit.getResource();
                            LOG.info("for match field :"+matchField+"resultResource:"+resultResource.getPath());
                            ValueMap valueMap = resultResource.getValueMap();
                            if(valueMap.containsKey(matchField)){
                                dataMap.put(valueMap.get(matchField).toString(), prefix+matchField);
                            }

                        } catch (RepositoryException e) {
                            LOG.error("RepositoryException :"+e);
                        }

                    }
                }

            }
            if(dataMap.size()>0){
                Iterator it = dataMap.entrySet().iterator();
                while (it.hasNext()) {
                    Map.Entry pair = (Map.Entry)it.next();
                    tempJsonObject = new JsonObject();
                    tempJsonObject.addProperty(pair.getValue().toString(), pair.getKey().toString());
                    resultJsonArray.add(tempJsonObject);
                }

            }
        }
        return resultJsonArray;
    }

    @Override
    public String getStoreSearch(RequestParameter keyParameter, RequestParameter textParameter, RequestParameter countryParameter, RequestParameter currentLocationParameter, ResourceResolver resourceResolver) {
        String jsonData = "";
        LOG.info("keyParameter:"+keyParameter);
        LOG.info("textParameter:"+textParameter);
        LOG.info("countryParameter:"+countryParameter);
        LOG.info("currentLocationParameter:"+currentLocationParameter);
        Gson gson = new Gson();
        // getting the country path
        String countryParam = countryParameter.getString();
        String country=null, lang= null;
        if(countryParam != null && countryParam.indexOf("_")!= -1){
            String[] countryLangStringArray = countryParam.split("_");
            if(countryLangStringArray != null && countryLangStringArray.length==2){
                lang = countryLangStringArray[0];
                country = countryLangStringArray[1];
            }
        }
        String countryPath = CountryUtils.getCountry(resourceResolver, country, lang);
        LOG.info("countryPath:"+countryPath);
        String storeLocationPath = countryPath+"/storelocations";
        String proximityLocationPath = countryPath+"/proximitylocations";
        JsonObject tempJson=null;
        JsonArray resultJsonArray = new JsonArray();

        if(countryPath != null){
            if(currentLocationParameter != null){
                // we are searching as per the current location and get all the stores in the country parameter sent
                Resource storeLocatorResource = resourceResolver.resolve(storeLocationPath);
                if(storeLocatorResource != null){
                    Iterable<Resource> children = storeLocatorResource.getChildren();
                    for(Resource store : children){
                        tempJson = convertResourceToStoreJson(store, gson);
                        resultJsonArray.add(tempJson);
                    }
                    jsonData = gson.toJson(resultJsonArray);
                }
            }else if(keyParameter != null){
                String key = keyParameter.getString();
                Session session = resourceResolver.adaptTo(Session.class);
                SearchResult result = null;
                List<Hit> hitsList = null;
                if("statename".equals(key)){
                    if(textParameter != null){
                        String text = textParameter.getString();
                        // search in statename and send all store with that statename
                        Map<String, String> queryMap = new LinkedHashMap<>();
                        queryMap.put("path", storeLocationPath);
                        queryMap.put("type", "nt:unstructured");
                        queryMap.put("fulltext", text);
                        queryMap.put("fulltext.relPath", "@state");
                        GenericUtils.logQuery(LOG, queryMap);

                        Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), session);
                        result = query.getResult();
                        hitsList = result.getHits();
                        for(Hit hit:hitsList){
                            try {
                                tempJson = convertResourceToStoreJson(hit.getResource(), gson);
                                resultJsonArray.add(tempJson);
                            } catch (RepositoryException e) {
                                LOG.error("Repository Exception:"+e);
                            }
                        }
                        jsonData = gson.toJson(resultJsonArray);
                    }
                }else if(key.startsWith("proximity")){
                    // get all the store in country and search for the proximity string sent
                    key = key.replaceAll("proximity-", "");
                    JsonObject  resultJsonObject = new JsonObject();
                    String text = textParameter.getString();
                    Map<String, String> queryMap = new LinkedHashMap<>();
                    queryMap.put("path", proximityLocationPath);
                    queryMap.put("type", "nt:unstructured");
                    queryMap.put("fulltext", text);
                    queryMap.put("fulltext.relPath", "@"+key);
                    GenericUtils.logQuery(LOG, queryMap);

                    Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), session);
                    result = query.getResult();
                    hitsList = result.getHits();
                    for(Hit hit:hitsList){
                        try {
                            tempJson = convertResourceToStoreJson(hit.getResource(), gson);
                            resultJsonArray.add(tempJson);
                        } catch (RepositoryException e) {
                            LOG.error("Repository Exception:"+e);
                        }
                    }
                    resultJsonObject.add("ProximityResult", resultJsonArray);
                    resultJsonArray = new JsonArray();
                    Resource storeLocatorResource = resourceResolver.resolve(storeLocationPath);
                    if(storeLocatorResource != null){
                        Iterable<Resource> children = storeLocatorResource.getChildren();
                        for(Resource store : children){
                            tempJson = convertResourceToStoreJson(store, gson);
                            resultJsonArray.add(tempJson);
                        }
                        resultJsonObject.add("StoreResults", resultJsonArray);
                    }
                    jsonData = gson.toJson(resultJsonObject);

                }else{
                    // search in country for the key to have the value
                    if(textParameter != null) {
                        String text = textParameter.getString();

                        Map<String, String> queryMap = new LinkedHashMap<>();
                        queryMap.put("path", storeLocationPath);
                        queryMap.put("type", "nt:unstructured");
                        queryMap.put("fulltext", text);
                        queryMap.put("fulltext.relPath", "@"+key);
                        GenericUtils.logQuery(LOG, queryMap);

                        Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), session);
                        result = query.getResult();
                        hitsList = result.getHits();
                        for(Hit hit:hitsList){
                            try {
                                tempJson = convertResourceToStoreJson(hit.getResource(), gson);
                                resultJsonArray.add(tempJson);
                            } catch (RepositoryException e) {
                                LOG.error("Repository Exception:"+e);
                            }
                        }
                        jsonData = gson.toJson(resultJsonArray);
                    }
                }
            }
        }
        return jsonData;
    }

    private JsonObject convertResourceToStoreJson(Resource store, Gson gson) {
        JsonObject jsonObject = new JsonObject();
        if(store != null){
            ValueMap valueMap = store.getValueMap();
            List<String> productList= null;
            for(Map.Entry<String, Object> entry : valueMap.entrySet()) {
                if(entry.getValue() != null){
                    if(entry.getKey().startsWith("product")){
                        if(productList == null){
                            productList = new ArrayList<>();
                        }
                        productList.add(entry.getValue().toString());
                        jsonObject.add("product", gson.toJsonTree(productList));
                    }else{
                        jsonObject.addProperty(entry.getKey(), entry.getValue().toString());
                    }

                }
            }
        }
        return jsonObject;
    }
}
