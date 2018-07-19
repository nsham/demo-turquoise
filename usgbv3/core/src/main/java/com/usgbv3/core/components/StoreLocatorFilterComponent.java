package com.usgbv3.core.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.usgbv3.core.models.DistanceLocatorProductCategory;
import com.usgbv3.core.models.StoreLocatorProductCategory;
import com.usgbv3.core.models.StoreLocatorStoreCategory;
import com.usgbv3.core.services.StoreLocatorService;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

public class StoreLocatorFilterComponent extends WCMUsePojo {
    private static final Logger LOG = LoggerFactory.getLogger(StoreLocatorFilterComponent.class);

    public String getStoreCategoryTitle() {
        return storeCategoryTitle;
    }

    public void setStoreCategoryTitle(String storeCategoryTitle) {
        this.storeCategoryTitle = storeCategoryTitle;
    }

    public List<StoreLocatorStoreCategory> getStoreCategoryList() {
        return storeCategoryList;
    }

    public void setStoreCategoryList(List<StoreLocatorStoreCategory> storeCategoryList) {
        this.storeCategoryList = storeCategoryList;
    }

    public String getProductCategoryTitle() {
        return productCategoryTitle;
    }

    public void setProductCategoryTitle(String productCategoryTitle) {
        this.productCategoryTitle = productCategoryTitle;
    }

    public List<StoreLocatorProductCategory> getProductCategoryList() {
        return productCategoryList;
    }

    public void setProductCategoryList(List<StoreLocatorProductCategory> productCategoryList) {
        this.productCategoryList = productCategoryList;
    }

    public String getDistanceCategoryTitle() {
        return distanceCategoryTitle;
    }

    public void setDistanceCategoryTitle(String distanceCategoryTitle) {
        this.distanceCategoryTitle = distanceCategoryTitle;
    }

    public List<DistanceLocatorProductCategory> getDistanceCategoryList() {
        return distanceCategoryList;
    }

    public void setDistanceCategoryList(List<DistanceLocatorProductCategory> distanceCategoryList) {
        this.distanceCategoryList = distanceCategoryList;
    }

    private String storeCategoryTitle;
    private List<StoreLocatorStoreCategory>  storeCategoryList;
    private String productCategoryTitle;
    private List<StoreLocatorProductCategory>  productCategoryList;
    private String distanceCategoryTitle;
    private List<DistanceLocatorProductCategory>  distanceCategoryList;

    @Override
    public void activate() throws Exception {
        ValueMap storeLocatorFilterProperties = getProperties();

        StoreLocatorService storeLocatorService = getSlingScriptHelper().getService(StoreLocatorService.class);
        //LOG.info(":storeLocatorService:"+storeLocatorService);
        Map<String, Object> storeData = storeLocatorService.getStoreFilter(storeLocatorFilterProperties);
        //LOG.info(":storeData:"+storeData);
        if(storeData != null){
            if(storeData.containsKey("storeCategoryTitle")){
                this.storeCategoryTitle =storeData.get("storeCategoryTitle").toString();
            }
            if(storeData.containsKey("productCategoryTitle")){
                this.productCategoryTitle =storeData.get("productCategoryTitle").toString();
            }
            if(storeData.containsKey("distanceCategoryTitle")){
                this.distanceCategoryTitle =storeData.get("distanceCategoryTitle").toString();
            }
            if(storeData.containsKey("storeCategoryList")){
                this.storeCategoryList = (List<StoreLocatorStoreCategory>)storeData.get("storeCategoryList");
            }
            if(storeData.containsKey("productCategoryList")){
                this.productCategoryList = (List<StoreLocatorProductCategory>)storeData.get("productCategoryList");
            }
            if(storeData.containsKey("distanceCategoryList")){
                this.distanceCategoryList = (List<DistanceLocatorProductCategory>)storeData.get("distanceCategoryList");
            }
        }


    }


}
