require(['DOM/traversal'], function(){
	var ws = new WebSocket("ws://localhost:8080/WonderfulSockets/websocket/test");
	ws.onmessage= function(data) {
		var json = JSON.parse(data.data);
		if(json.modelBinding){
			var a = document.getElementsByAttr("ws-model="+json.modelBinding);
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
	
	function sendChange(e){
		var elm = e.currentTarget;
		var wsModel = elm.attr("ws-model");
		var wsValue;
		if(elm.val)
			wsValue = elm.val();
		ws.send('{"modelBinding":"'+wsModel+'","modelValue":"'+wsValue+'", "action":"update"}');
	}
	
	function init(){
		var a = document.getElementsByAttr("ws-model");
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