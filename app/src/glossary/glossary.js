

function chiamata(wordTS){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
   		if (this.readyState == 4 && this.status == 200) {
   			myFunction(this);
   		}
   	}
	xhttp.open("GET", "/src/glossary/glossDucange.xml", true);
	xhttp.send();
}

function createBox(elem, xml, box){
	word=elem.childNodes[0].nodeValue;
	wordTS=word.toUpperCase();
	k=wordTS.trim();
	//qui ci va wordTS
	alert(k);
	b= xml.getElementsByTagName("entry");
	for (i=0; i<b.length;i++){
		id= b[i].getAttribute("xml:id");
		if (id==k){
			def = b[i].innerHTML;
			box+=wordTS+": "+def+"</span>";
	   		$(box).insertAfter(elem);
	    	$(".glossBox").click(function(event){
	    		event.stopPropagation();
	    	})
	    	box="<span class='glossBox'>";
	    	session=true;
		}
	}
	return session
}

function myFunction(xml){
	
	var xmlDoc = xml.responseXML;
	var elem = document.getElementsByClassName("w");
	var box="<span class='glossBox'>";
	document.getElementsByTagName("body").innerHTML+=box;
	var session=false;
	//alert(elem.length);
	for(i=0;i<elem.length;i++){
		
    	elem[i].addEventListener("click", function(event){
    		//alert(this.innerHTML);
    		event.stopPropagation();
    		if (session == true){
    			$(".glossBox").remove();
	    		session=false;
	    		session=createBox(this, xmlDoc, box);
   			}
   			else{
   				session=createBox(this, xmlDoc, box);
	   			$(document).click(function() {
	    			$(".glossBox").remove();
	    			session=false;
			});}
    		
    	});
    }

};

setTimeout(function (){
	console.log("glossario");
	a=document.getElementsByClassName("w");
	chiamata();
	//TODO
	// var observer = new MutationObserver(function(mutations) {
 //      mutations.forEach(function(mutation) {
 //      	chiamata();
 //      });
 //    });

 //    var config = {
 //      childList: true,
 //      subtree: true,
 //      characterData: true
 //    };

 //    var target = document.getElementById("box_body_mainText");
	
    //observer.observe(target, config);
}, 5000);




