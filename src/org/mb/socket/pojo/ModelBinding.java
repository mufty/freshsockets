package org.mb.socket.pojo;

public class ModelBinding extends BasePOJO {
	public static final String ACTION_UPDATE = "update";
	private String modelBinding;
	private String modelValue;
	private String action;
	
	public String getModelValue() {
		return modelValue;
	}
	public void setModelValue(String modelValue) {
		this.modelValue = modelValue;
	}
	public String getModelBinding() {
		return modelBinding;
	}
	public void setModelBinding(String modelBinding) {
		this.modelBinding = modelBinding;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
}
