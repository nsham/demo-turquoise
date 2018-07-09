package com.usgbv3.core.components;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.NodeIterator;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.Page;
import com.google.common.collect.Lists;
import com.usgbv3.core.models.FilterModel;
import com.usgbv3.core.models.ProductModel;


public class ProductListingComponent extends WCMUsePojo {
	private static final Logger LOG = LoggerFactory.getLogger(ProductListingComponent.class);
	
	private List<ProductModel> parentListingList;
	private List<ProductModel> productListingList;
	private List<FilterModel> filterListingList;
	private String error;

	public List<ProductModel> getParentListingList() {
		return parentListingList;
	}

	public void setParentListingList(List<ProductModel> parentListingList) {
		this.parentListingList = parentListingList;
	}

	public List<ProductModel> getProductListingList() {
		return productListingList;
	}

	public void setProductList(List<ProductModel> productListingList) {
		this.productListingList = productListingList;
	}

	public List<FilterModel> getFilterListingList() {
		return filterListingList;
	}

	public void setFilterListingList(List<FilterModel> filterListingList) {
		this.filterListingList = filterListingList;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	@Override
	public void activate() throws Exception {		

		List<Page> siblings =  Lists.newArrayList(getCurrentPage().getParent().listChildren()); 
		
		List<Page> childrens =  Lists.newArrayList(getCurrentPage().listChildren()); 
		parentListingList = new ArrayList<ProductModel>();
	    productListingList = new ArrayList<ProductModel>();
	    filterListingList = new ArrayList<FilterModel>();
	    
	    List<Tag> tagListingList = new ArrayList<Tag>();
	    
	    for(Page sibling : siblings) {
	    	
	    	ProductModel siblingProduct = setProductInfo(sibling);
	    	parentListingList.add(siblingProduct);
	    	
	    }

	    for(Page child : childrens) {
	    	
	    	ProductModel childProduct = setProductInfo(child);
	    	productListingList.add(childProduct);
	    	tagListingList.addAll(childProduct.getTagList());
	    	
	    }
	    
	    //remove filter
	    filterListingList = groupingFilter(tagListingList);
	    
	    
	}
	
	public ProductModel setProductInfo(Page page) {
		
		ProductModel product = new ProductModel();
		ValueMap pageProperties = page.getProperties();
		
		try {
			product.setTitle(page.getTitle());
			product.setLink(page.getPath());
			product.setDescription(page.getDescription());
			
			if(page.getTags() != null) {
				product.setTagList(Arrays.asList( page.getTags()));
			}
			
			if(pageProperties.get("pageImage") != null && !(pageProperties.get("pageImage").toString().isEmpty())){
				
				product.setImage(pageProperties.get("pageImage").toString());
			}			
			
		}catch (Exception e) {
			error = e.getMessage();
		}
		
		
		
		return product;
		
	}
	
	public List<Tag> removeDuplicate(List<Tag> tags){
		
		List<Tag> uniqueTags = new ArrayList<Tag>();
		// remove duplicate
	    HashSet<Tag> hashSet = new HashSet(tags);
	    uniqueTags = new ArrayList<Tag>(hashSet);
	    
	    return uniqueTags;
	}
	
	public List<FilterModel> groupingFilter(List<Tag> tags){
		
		List<FilterModel> filterGroups = new ArrayList<FilterModel>();
		HashSet<Tag> categoryList = new HashSet<Tag>();
		
		List<Tag> uniqueTags = removeDuplicate(tags);
		for(Tag singleTag : uniqueTags) {
			categoryList.add(singleTag.getParent());
		}
		
		for(Tag singleTag : categoryList) {
			
			FilterModel filter = new FilterModel();
			List<Tag> valuesTag = new ArrayList<Tag>();
			
			filter.setTagCategory(singleTag);
			
			for(Tag uniqueTag : uniqueTags) {
				
				if((singleTag.getName()).equalsIgnoreCase(uniqueTag.getParent().getName())) {
					valuesTag.add(uniqueTag);
				}
			}
			filter.setTagValues(valuesTag);
			filterGroups.add(filter);
		}
		
		
		
		return filterGroups;
	}
    

}
