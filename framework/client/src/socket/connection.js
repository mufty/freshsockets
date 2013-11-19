define(['config/config'],function(cfg){
	
	var connection = function(url, modelElement){
		this.url = url;
		this.modelElement = modelElement;
		
		this.connect();
	};
	
	connection.prototype.connect = function(){
		var thi$ = this;
		this.ws = new WebSocket(this.url);
		this.ws.onmessage= function(data) {
			var json = JSON.parse(data.data);
			if(json.modelBinding && json.modelValue){
				var a = thi$.modelElement.getElementsByAttr(cfg.prefix + "-model-binding="+json.modelBinding);
				for(var i in a){
					var elm = a[i];
					elm.val(json.modelValue);
				}
			} else {
				for(var k in json){
					var a = thi$.modelElement.getElementsByAttr(cfg.prefix + "-model-binding="+k);
					for(var i in a){
						var elm = a[i];
						elm.val(json[k]);
					}
				}
			}
		};
	};
	
	connection.prototype.send = function(obj){
		this.ws.send(obj);
	};
	
	return connection;
});