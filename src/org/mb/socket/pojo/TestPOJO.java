package org.mb.socket.pojo;

public class TestPOJO extends BasePOJO {
	
	private String name;
	private String surname;
	private String message;
	
	public TestPOJO() {
		id = new Long(1);
		name = "John";
		surname = "Doe";
		message = "Unavailable";
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSurname() {
		return surname;
	}
	public void setSurname(String surname) {
		this.surname = surname;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}

}
