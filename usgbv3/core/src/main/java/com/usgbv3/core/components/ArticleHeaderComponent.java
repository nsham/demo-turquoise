package com.usgbv3.core.components;

import java.sql.Date;
import java.text.DateFormat;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;
import com.day.cq.wcm.api.Page;
import com.google.common.collect.Lists;
import com.usgbv3.core.models.ArticleModel;
import com.usgbv3.core.models.ProductModel;
import com.usgbv3.core.models.TabTilesModel;


public class ArticleHeaderComponent extends WCMUsePojo {
	private static final Logger LOG = LoggerFactory.getLogger(ArticleHeaderComponent.class);
	
	private ArticleModel article;
	private String error;


	public ArticleModel getArticle() {
		return article;
	}

	public void setArticle(ArticleModel article) {
		this.article = article;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	@Override
	public void activate() throws Exception {		

		article = new ArticleModel();
		
		article.setTitle(getCurrentPage().getTitle());
		article.setDescription(getCurrentPage().getDescription());
	
		try {
			ValueMap pageProperties = getCurrentPage().getProperties();
			
			Date createdDate = (Date) pageProperties.get("pagedate");
			
			Format df = new SimpleDateFormat("dd MMM yyyy");
			
			error = df.format(createdDate);
			
		}catch (Exception e) {
			error = e.getMessage();
		}
		
		
	}
	
	
	
	
    

}
