package com.usgbv3.core.daos;

import com.usgbv3.core.entity.UserInfo;

public interface UserInfoDao {

	public boolean insertData(UserInfo data);
	public UserInfo getUser(String sso_id);
	public String getUserId(UserInfo userInfo);
}
