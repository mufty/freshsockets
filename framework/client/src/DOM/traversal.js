(function(d){
	
	var hasAttr = function(elm, attr){
		var atr, advanced = false, advValue;
		if(attr.indexOf("=") != -1){
			atr = attr.split("=")[0];
			advanced = true;
			advValue = attr.split("=")[1];
		} else {
			atr = attr;
		}
		if(elm.attr){
			var attrVal = elm.attr(atr);
			if(advanced && attrVal == advValue)
				return true;
			else if(!advanced && attrVal)
				return true;
		}
		
		return false;
	};
	
	var traverseElement = function(elm, arr, attr){
		for(var i in elm.childNodes){
			var e = elm.childNodes[i];
			if(hasAttr(e, attr)){
				arr[arr.length] = e;
			}
			
			if(e.childNodes && e.childNodes.length > 0){
				traverseElement(e, arr, attr);
			}
		}
	};
	
	d.getElementsByAttr = function(attr){
		var foundElements = [];
		for(var i in d.childNodes){
			var elm = d.childNodes[i];
			if(elm.nodeType == Element.ELEMENT_NODE){
				if(hasAttr(elm, attr)){
					foundElements[foundElements.length] = elm;
				}
				
				if(elm.childNodes && elm.childNodes.length > 0){
					traverseElement(elm, foundElements, attr);
				}
			}
		}
		
		return foundElements;
	};
	
	Element.prototype.attr = function(name, set){
		if(set && this.setAttribute){
			this.setAttribute(name, set);
		} else if (this.getAttribute){
			return this.getAttribute(name);
		} else {
			return null;
		}
	};
	
	Element.prototype.val = function(set){
		if(this.nodeType == Element.ELEMENT_NODE && this.tagName == "INPUT"){
			if(set)
				this.value = set;
			else
				return this.value;
		}
	};
})(document);