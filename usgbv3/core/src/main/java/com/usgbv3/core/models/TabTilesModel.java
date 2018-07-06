package com.usgbv3.core.models;

import java.util.ArrayList;
import java.util.List;

import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.Page;

public class TabTilesModel {
	
	private Page category;
	private List<ProductModel> pages;
	
	public Page getCategory() {
		return category;
	}
	
	public void setCategory(Page category) {
		this.category = category;
	}
	
	public List<ProductModel> getPages() {
		return pages;
	}
	
	public void setPages(List<ProductModel> pages) {
		this.pages = pages;
	}
	
	
	
	
	
	
	
	
}