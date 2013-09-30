require.config({
	nodeRequire: require
});

require(['DOM/traversal'], function(){
	var ws, cfg;
	
	//TODO configuration for custom attribute prefix and others...
	cfg = {
		prefix: "fs"
	};
	
	connect();
	
	function connect(){
		var connectionElements = document.getElementsByAttr(cfg.prefix + "-host");
		
		for(var index in connectionElements){
			var ce = connectionElements[index];
			
			//TODO multiple connections
			//TODO can be in parent elements so we need to travese then
			/*
			 * example 1:
			 * 
			 * <elm ws-host="somehost">
			 * 	<elm ws-app="someapp"/>
			 *   <elm ws-model="somemodel"/>
			 *    <elm ws-model-binding="modelBinding1"/>
			 *    <elm ws-model-binding="modelBinding2"/>
			 *   </elm>
			 *  </elm>
			 * </elm>
			 * 
			 * example 2:
			 * 
			 * <elm ws-host="somehost" ws-app="someapp">
			 *   <elm ws-model="somemodel"/>
			 *    <elm ws-model-binding="modelBinding1"/>
			 *    <elm ws-model-binding="modelBinding2"/>
			 *   </elm>
			 * </elm>
			 * 
			 * example 3:
			 * 
			 * <elm ws-host="somehost" ws-app="someapp" ws-model="somemodel">
			 *    <elm ws-model-binding="modelBinding1"/>
			 *    <elm ws-model-binding="modelBinding2"/>
			 * </elm>
			 */
			var url = ce.attr(cfg.prefix + "-host") + ce.attr(cfg.prefix + "-app") + ce.attr(cfg.prefix + "-model");
			
			ws = new WebSocket("ws://localhost:8080/WonderfulSockets/websocket/test");
			ws.onmessage= function(data) {
				var json = JSON.parse(data.data);
				if(json.modelBinding){
					var a = document.getElementsByAttr(cfg.prefix + "-model-binding="+json.modelBinding);
					for(var i in a){
						var elm = a[i];
						elm.val(json.modelValue);
					}
				} else if(json.name){
					document.getElementById('name').val(json.name);
					document.getElementById('surname').val(json.surname);
					document.getElementById('message').val(json.message);
				}
			};
		}
	}
	
	function sendChange(e){
		var elm = e.currentTarget;
		var wsModel = elm.attr(cfg.prefix + "-model");
		var wsValue;
		if(elm.val)
			wsValue = elm.val();
		ws.send('{"modelBinding":"'+wsModel+'","modelValue":"'+wsValue+'", "action":"update"}');
	}
	
	function init(){
		var a = document.getElementsByAttr(cfg.prefix + "-model-binding");
		for(var i in a){
			var elm = a[i];
			elm.onchange = sendChange;
		};
	}
	
	if(document.readyState === "complete"){
		init();
	} else {
		window.onload = function(){
			init();
		};
	}
});