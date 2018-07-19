package com.usgbv3.core.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

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

	/**
	 * Converts InputStream to String
	 * @param is
	 * @return
	 */
	public static String getStringFromInputStream(InputStream is) {

		BufferedReader br = null;
		StringBuilder sb = new StringBuilder();

		String line;
		try {

			br = new BufferedReader(new InputStreamReader(is));
			while ((line = br.readLine()) != null) {
				sb.append(line);
			}

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		return sb.toString();



	}

	public static String replaceSpecialCharacters(String inputString){
		inputString = inputString.replace(" ", "_");
		inputString = inputString.replace("(", "_");
		inputString = inputString.replace(")", "_");
		return inputString;
	}

 
}