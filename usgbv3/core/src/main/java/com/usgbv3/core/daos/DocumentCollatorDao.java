package com.usgbv3.core.daos;


import java.util.List;

import com.usgbv3.core.entity.DocumentCollator;

public interface DocumentCollatorDao {

	public int insertData(DocumentCollator data);
	public boolean removeData(String sso_id, List<String> removeList);
	public List<DocumentCollator> getDocumentListbySsoId(String sso_id);
	
}
