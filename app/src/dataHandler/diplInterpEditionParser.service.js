/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtDiplInterpEditionParser
 * @description 
 * # evtDiplInterpEditionParser

 **/

 angular.module('evtviewer.dataHandler')

 .service("evtDiplInterpEditionParser", function($q, parsedData, evtParser, xmlParser, config){
 	var parser = {
 	};

 	parser.parseEdition = function(doc){
 		var currentDocument = angular.element(doc);
 		var expanDef = "expan, espansione";
 			corrDef = "corr, correzione";
 			restoreDef = "restore";
 			regDef = "reg";
 			origDef ="orig, originale";
 			regDef = "reg, regolare";



 		if(currentDocument.find(expanDef).length > 1 || currentDocument.find(corrDef).length > 1 || currentDocument.find(restoreDef).length > 1  || currentDocument.find(regDef).length > 1) {
 		
 			console.log("nel tuo if");
 		}
 		else{
 			
 			//TODO: create a error box
 			alert("Elementi non sufficienti per edizione diplomatica-interpretativa")
 			config.availableEditionLevel[0].visible=true;
 			config.availableEditionLevel[1].visible=false;
 			config.availableEditionLevel[2].visible=false;

 		}

 	}
 	return parser;
 });