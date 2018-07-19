package com.usgbv3.core.daos;

import com.usgbv3.core.models.ShareData;

public interface ShareDataDao {

	public boolean insertShareData(ShareData data);
	public ShareData getShareData(String key);
	
}
