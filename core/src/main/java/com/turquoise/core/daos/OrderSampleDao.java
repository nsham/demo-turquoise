package com.turquoise.core.daos;

import java.util.List;
import java.util.Map;

import com.turquoise.core.entity.OrderInfo;
import com.turquoise.core.entity.ProductInfo;
import com.turquoise.core.entity.ShippingDetail;
import com.turquoise.core.models.OrderSampleForm;

public interface OrderSampleDao {

	public boolean insertData(OrderSampleForm data);
	public String insertDataSD(ShippingDetail data);
	public List<String> insertDataProduct(List<ProductInfo> data);
	public OrderInfo insertDataOrder(OrderInfo orderInfo, List<String> productIdList);
	public List<OrderInfo> getOrderListbySsoId(String sso_id);
	public boolean UpdateData(String userId, String removeId, String status);
	public List<OrderInfo> getOrderListbyCountry(List<String> country, Map<String, Object> inputMap);
	public List<OrderInfo> getOrderList(Map<String, Object> inputMap);
}
