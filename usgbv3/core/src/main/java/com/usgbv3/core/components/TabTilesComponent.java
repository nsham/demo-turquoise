package com.usgbv3.core.components;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.wcm.api.Page;
import com.google.common.collect.Lists;
import com.usgbv3.core.models.ProductModel;
import com.usgbv3.core.models.TabTilesModel;


public class TabTilesComponent extends WCMUsePojo {
	private static final Logger LOG = LoggerFactory.getLogger(TabTilesComponent.class);
	
	private List<TabTilesModel> productList;
	private String error;

	public List<TabTilesModel> getProductList() {
		return productList;
	}

	public void setProductList(List<TabTilesModel> productList) {
		this.productList = productList;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	@Override
	public void activate() throws Exception {		

		productList = new ArrayList<TabTilesModel>();
		
		String parentPath = (String) getProperties().get("parentPath");
		Page parentPage = getPageManager().getPage(parentPath);
		List<Page> categoryPages =  Lists.newArrayList(parentPage.listChildren());
		
		for(Page category : categoryPages) {
			
			TabTilesModel tabTiles = new TabTilesModel();
			List<ProductModel> products = setProduct(category);
			tabTiles.setCategory(category);
			tabTiles.setPages(products);
			
			productList.add(tabTiles);
		}
		
	}
	
	public List<ProductModel> setProduct(Page page) {
		
		List<ProductModel> productList = new ArrayList<ProductModel>();
		List<Page> listOfPages =  Lists.newArrayList(page.listChildren());
		
		for(Page subPage : listOfPages) {
			
			if(subPage.getTitle() != null && !(subPage.getTitle().isEmpty())) {
				
				ValueMap pageProperties = subPage.getProperties();
				ProductModel product = new ProductModel();
				
				product.setTitle(subPage.getTitle());
				product.setLink(subPage.getPath());
				product.setDescription(subPage.getDescription());
								
				if(pageProperties.get("pageImage") != null && !(pageProperties.get("pageImage").toString().isEmpty())){
					
					product.setImage(pageProperties.get("pageImage").toString());
				}
				
				productList.add(product);
			}
			
		}
		
		
		
		return productList;
	}
	
	
    

}
