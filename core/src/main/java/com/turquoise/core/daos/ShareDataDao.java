package com.turquoise.core.daos;

import com.turquoise.core.models.ShareData;

public interface ShareDataDao {

	public boolean insertShareData(ShareData data);
	public ShareData getShareData(String key);
	
}
