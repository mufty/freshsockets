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
			//TODO can be in parent elements so we need to traverse then
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
			var hasAppConnection = false, hasModelConnection = false;
			var url = ce.attr(cfg.prefix + "-host");
			
			if(ce.attr(cfg.prefix + "-app")) {
				url +=ce.attr(cfg.prefix + "-app");
				hasAppConnection = true;
			}
			
			if(hasAppConnection && ce.attr(cfg.prefix + "-model")) {
				url += ce.attr(cfg.prefix + "-model");
				hasModelConnection = true;
			}
			
			//find app childs
			if(!hasAppConnection){
				var appElements = findAppChilds(ce);
				if(appElements.length > 0){
					for(var i in appElements){
						var ae = appElements[i];
						
						url += ae.attr(cfg.prefix + "-app");
						
						if(ae.attr(cfg.prefix + "-model")){
							url += ae.attr(cfg.prefix + "-model");
							
							connectSocket(url);
						} else {
							var modelElements = findModelChilds(ae);
							for(var x in modelElements){
								var me = modelElements[x];
								
								url += me.attr(cfg.prefix + "-model");
								
								connectSocket(url);
							}
						}
					}
				}
			}
		}
	}
	
	function connectSocket(url){
		ws = new WebSocket(url);
		ws.onmessage= function(data) {
			var json = JSON.parse(data.data);
			if(json.modelBinding && json.modelValue){
				var a = document.getElementsByAttr(cfg.prefix + "-model-binding="+json.modelBinding);
				for(var i in a){
					var elm = a[i];
					elm.val(json.modelValue);
				}
			} else {
				for(var k in json){
					var a = document.getElementsByAttr(cfg.prefix + "-model-binding="+k);
					for(var i in a){
						var elm = a[i];
						elm.val(json[k]);
					}
				}
			}
		};	
	}
	
	function findAppChilds(e){
		var appElements = e.getElementsByAttr(cfg.prefix + "-app");
		return appElements;
	}
	
	function findModelChilds(e){
		var modelElements = e.getElementsByAttr(cfg.prefix + "-model");
		return modelElements;
	}
	
	function sendChange(e){
		var elm = e.currentTarget;
		var wsModel = elm.attr(cfg.prefix + "-model-binding");
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