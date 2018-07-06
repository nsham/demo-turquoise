package com.usgbv3.core.components;

import java.util.ArrayList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.NodeIterator;

import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.usgbv3.core.models.ProductModel;

/**
 * @author Prashanth
 * This class would be called Featured Product component to compute the components logic
 * Called by:/apps/usgb/components/content/featuredproducts/featuredproducts.html
 * Revision: 
 * 			Date 					Modified by 					Reason
 *
 */
public class ProductCharacteristicComponent extends WCMUsePojo {
	private static final Logger LOG = LoggerFactory.getLogger(ProductCharacteristicComponent.class);
	
	private List<ProductModel> productList;
	private String error;

	public List<ProductModel> getProductList() {
		return productList;
	}

	public void setProductList(List<ProductModel> productList) {
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

		Node currentNode = getResource().adaptTo(Node.class);
	    NodeIterator ni =  currentNode.getNodes() ; 
	    productList = new ArrayList<ProductModel>();
	    
	    while (ni.hasNext()) {
	        Node child = (Node)ni.nextNode(); 
	         
	        
	        NodeIterator ni2 =  child.getNodes() ; 
	        while (ni2.hasNext()) {
		        Node child2 = (Node)ni2.nextNode(); 
		        
		        productList.add(setProductInfo(child2));
	        }
	    }
	    
	}
	
	public ProductModel setProductInfo(Node rawNode) {
		
		ProductModel product = new ProductModel();
		
		try {
			
			if(rawNode.getProperty("title") != null && !(rawNode.getProperty("title").getString().isEmpty())){
				
				product.setTitle(rawNode.getProperty("title").getString());
			}
			
			if(rawNode.getProperty("description") != null && !(rawNode.getProperty("description").getString().isEmpty())){
				
				product.setDescription(rawNode.getProperty("description").getString());
			}
			
			if(rawNode.getProperty("icon") != null && !(rawNode.getProperty("icon").getString().isEmpty())){
				
				product.setIcon(rawNode.getProperty("icon").getString());
			}
			
			if(rawNode.getProperty("linkType") != null) {
				
				String linkType = rawNode.getProperty("linkType").toString();
				product.setLinkType(linkType);
				
				if("asset".equalsIgnoreCase(linkType) && rawNode.getProperty("imgPath") != null && !(rawNode.getProperty("imgPath").getString().isEmpty())) {
					
					product.setLink(rawNode.getProperty("imgPath").getString());
					
				}else if("page".equalsIgnoreCase(linkType) && rawNode.getProperty("link") != null && !(rawNode.getProperty("link").getString().isEmpty())) {

					product.setLink(rawNode.getProperty("link").getString());
					
				}else if("externalURL".equalsIgnoreCase(linkType) && rawNode.getProperty("externalUrl") != null && !(rawNode.getProperty("externalUrl").getString().isEmpty())) {

					product.setLink(rawNode.getProperty("externalUrl").getString());
					
				}else {

					product.setLink("");
				}
				
			}
			
		}catch (Exception e) {
			error = e.getMessage();
		}
		
		
		
		return product;
		
	}
    

}
