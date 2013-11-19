package org.mb.socket.endpoint;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;

import javax.websocket.CloseReason;
import javax.websocket.Endpoint;
import javax.websocket.EndpointConfig;
import javax.websocket.MessageHandler;
import javax.websocket.Session;

import org.mb.socket.pojo.BasePOJO;
import org.mb.socket.pojo.Connection;
import org.mb.socket.pojo.ModelBinding;
import org.mb.socket.pojo.TestPOJO;

import com.google.gson.Gson;

public final class TestEndpoint extends Endpoint {
	
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
				
				if(client.session.isOpen())
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
	
	@Override
	public void onClose(Session session, CloseReason closeReason) {
		//super.onClose(session, closeReason);
		connections.remove(this);
	}

	@Override
	public void onOpen(Session session, EndpointConfig arg1) {
		this.session = session;
		this.session.addMessageHandler(stringHandler);
		connections.add(this);
		broadcast(testPojo);
	}
	
	private final MessageHandler.Whole<String> stringHandler = new MessageHandler.Whole<String>() {

		@Override
		public void onMessage(String message) {
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
	}; 

}
