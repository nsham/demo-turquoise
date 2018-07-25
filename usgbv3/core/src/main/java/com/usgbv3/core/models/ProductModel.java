package com.usgbv3.core.models;

import java.util.ArrayList;
import java.util.List;

import com.day.cq.tagging.Tag;

public class ProductModel {
	
	private String title;
	private String description;
	private String image;
	private String icon;
	private String linkType;
	private String link;
	private Tag tag;
	private List<Tag> tagList;
	private String toStringTags;
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getIcon() {
		return icon;
	}
	
	public void setIcon(String icon) {
		this.icon = icon;
	}
	
	public String getLinkType() {
		return linkType;
	}

	public void setLinkType(String linkType) {
		this.linkType = linkType;
	}

	public String getLink() {
		return link;
	}
	
	public void setLink(String link) {
		this.link = link;
	}

	public Tag getTag() {
		return tag;
	}

	public void setTag(Tag tag) {
		this.tag = tag;
	}

	public List<Tag> getTagList() {
		return tagList;
	}

	public void setTagList(List<Tag> tagList) {
		if(tagList == null) {
			tagList = new ArrayList<Tag>();
		}
		
		this.tagList = tagList;
	}
	
	public String toStringTags() {
		String result = "";
		
		for(Tag tag : tagList) {
			result = result + "data-"+ tag.getParent().getName() + "='" + tag.getName() + "' ";
		}
		
		return result;
	}

	public String getToStringTags() {
		String result = "";
		
		for(Tag tag : tagList) {
			result = result + "data-"+ tag.getParent().getName() + "='" + tag.getName() + "' ";
		}
		return result;
	}
	
	
	
}