package org.mb.socket.endpoint;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.mb.socket.pojo.BasePOJO;
import org.mb.socket.pojo.Connection;
import org.mb.socket.pojo.ModelBinding;
import org.mb.socket.pojo.TestPOJO;

import com.google.gson.Gson;

@ServerEndpoint(value = "/websocket/test")
public class TestEndpoint {
	
	private static final Set<TestEndpoint> connections = new CopyOnWriteArraySet<>();
	private static final String GUEST_PREFIX = "Guest";
	private static final AtomicInteger connectionIds = new AtomicInteger(0);
	private static final TestPOJO testPojo = new TestPOJO();
	
	private final Connection connection;
	
	private Session session;
	
	private static Gson gson = new Gson();
	
	public TestEndpoint(){
		connection = new Connection();
		connection.setGuestName(GUEST_PREFIX + connectionIds.getAndIncrement());
	}
	
	@OnOpen
	public void start(Session session){
		this.session = session;
		connections.add(this);
		broadcast(testPojo);
	}
	
	@OnClose
	public void end(){
		connections.remove(this);
	}
	
	@OnMessage
	public void incoming(String message){
		ModelBinding pojo = gson.fromJson(message, ModelBinding.class);
		if(pojo.getAction() != null){
			switch (pojo.getAction()) {
				case ModelBinding.ACTION_UPDATE:
					updatePojo(pojo);
					broadcast(pojo);
					break;
				default:
					broadcast(pojo);
					break;
			}
		} else {
			broadcast(pojo);
		}
	}
	
	private static void updatePojo(ModelBinding mb){
		String binding = mb.getModelBinding();
		String value = mb.getModelValue();
		
		try {
			Field f = testPojo.getClass().getDeclaredField(binding);
			f.setAccessible(true);
			f.set(testPojo, value);
		} catch (NoSuchFieldException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private static void broadcast(BasePOJO pojo){
		for(TestEndpoint client : connections){
			try {
				System.out.println(gson.toJson(pojo));
				client.session.getBasicRemote().sendText(gson.toJson(pojo));
			} catch (IOException e) {
				connections.remove(client);
				try {
					client.session.close();
				} catch (IOException e1) {
					//ignore
				}
			}
		}
	}

}
