package com.usgbv3.core.utils;

public class StringUtils {

	/**
	 * Checks if string is NOT null or NOT empty after trimming start and trailing spaces
	 * str = null, returns false;
	 * str = "", returns false;
	 * str = " ", returns false;
	 * str = "   ", returns false;
	 * str = " abc", returns true;
	 * @param str
	 * @return
	 */
	public static boolean isNotBlank(String str){
		return str != null && !str.trim().isEmpty();
	}
	

 
}