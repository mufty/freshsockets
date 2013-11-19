package org.mb.socket.config;

import java.util.HashSet;
import java.util.Set;

import javax.websocket.Endpoint;
import javax.websocket.server.ServerApplicationConfig;
import javax.websocket.server.ServerEndpointConfig;

import org.mb.socket.endpoint.TestEndpoint;

public class ExampleConfig implements ServerApplicationConfig {

	@Override
	public Set<ServerEndpointConfig> getEndpointConfigs(
			Set<Class<? extends Endpoint>> scanned) {
		Set<ServerEndpointConfig> result = new HashSet<>();
		
		if(scanned.contains(TestEndpoint.class)){
			result.add(ServerEndpointConfig.Builder.create(TestEndpoint.class, "/websocket/test").build());
		}
		return result;
	}

	@Override
	public Set<Class<?>> getAnnotatedEndpointClasses(Set<Class<?>> arg0) {
		// TODO Auto-generated method stub
		return null;
	}

}
