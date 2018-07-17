package com.usgbv3.core.services.impl;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.usgbv3.core.services.MixedMediaService;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component(immediate = true, service = MixedMediaService.class
        , configurationPid = "com.usgbv3.core.services.impl.MixedMediaServiceImpl")
public class MixedMediaServiceImpl implements MixedMediaService{
    private final Logger LOG = LoggerFactory.getLogger(this.getClass());

    @Reference
    QueryBuilder queryBuilder;



    @Override
    public int getMixedMediaCountInPage(String pagePath, ResourceResolver resourceResolver) {
        if(pagePath != null){
           Map<String, String> queryMap = new LinkedHashMap<>();
           queryMap.put("type","nt:unstructured");
           queryMap.put("path", pagePath);
           queryMap.put("property", "assetType");
           queryMap.put("property.1_value", "MixedMediaSet");

            Session session = resourceResolver.adaptTo(Session.class);
            Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), session);
            SearchResult result = query.getResult();
            List<Hit> hitsList = result.getHits();

            String dynamicMediaPath=null;
            if(hitsList != null && hitsList.size()>0){
                Hit hit = hitsList.get(0);

                Resource dynamicMediaNode = null;
                try {
                   // LOG.info("hit:"+hit.getPath());
                    dynamicMediaNode = hit.getResource();
                } catch (RepositoryException e) {
                    LOG.error("RepositoryException in getMixedMediaCountInPage:"+e.getMessage());
                }
                if(dynamicMediaNode != null ){
                    ValueMap dynamicMediaValueMap = dynamicMediaNode.getValueMap();
                    if(dynamicMediaValueMap.containsKey("assetID")){
                        dynamicMediaPath =dynamicMediaValueMap.get("assetID").toString();
                    }else if(dynamicMediaValueMap.containsKey("fileReference")){
                        dynamicMediaPath =dynamicMediaValueMap.get("fileReference").toString();
                    }
                }
            }
            //LOG.info("dynamicMediaPath:"+dynamicMediaPath);
            //if dynamice media is present we need to get the count
            if(dynamicMediaPath != null){
                Resource dynamicMediaAsset = resourceResolver.resolve(dynamicMediaPath);
                //LOG.info("dynamicMediaAsset:"+dynamicMediaAsset);
                if(dynamicMediaAsset != null && dynamicMediaAsset.hasChildren()){
                    Resource jcrContentResource = dynamicMediaAsset.getChild("jcr:content");
                    //LOG.info("jcrContentResource:"+jcrContentResource);
                    if(jcrContentResource != null && jcrContentResource.hasChildren()){
                        Resource relatedResource = jcrContentResource.getChild("related");
                        //LOG.info("relatedResource:"+relatedResource);
                        if(relatedResource != null && relatedResource.hasChildren()){
                            Resource s7SetResource = relatedResource.getChild("s7Set");
                            //LOG.info("s7SetResource:"+s7SetResource);
                            if(s7SetResource != null && s7SetResource.hasChildren()){
                                Resource slingMembersResource = s7SetResource.getChild("sling:members");
                                //LOG.info("slingMembersResource:"+slingMembersResource);
                                if(slingMembersResource != null){
                                    ValueMap slingMembersResourceValueMap = slingMembersResource.getValueMap();
                                    //LOG.info("slingMembersResourceValueMap:"+slingMembersResourceValueMap);
                                    if(slingMembersResourceValueMap.containsKey("sling:resources")){
                                        String[] slingResourcesStringArray = slingMembersResourceValueMap.get("sling:resources", String[].class);
                                        //LOG.info("slingResourcesStringArray:"+slingResourcesStringArray);
                                        if(slingResourcesStringArray != null && slingResourcesStringArray.length>-1){
                                            return slingResourcesStringArray.length;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return -1;
    }
}
