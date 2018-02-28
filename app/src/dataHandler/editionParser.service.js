/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtEditionParser
 * @description 
 * # evtEditionParser

 **/

 angular.module('evtviewer.dataHandler')

 .service("evtEditionParser", function($q, parsedData, evtParser, xmlParser, config){
 	var parser = {};

 	parser.parseEdition = function(doc){
 		var currentDocument = angular.element(doc);
 		var expanDef = "expan, espansione";
 		var corrDef = "corr, correzione";
 		var restoreDef = "restore";
 		var regDef = "reg";
 		//"abbr" | expan" | "sic" |  "corr" | "del" | "add" | "restore"| "gap" | "supplied" | "orig" | "reg"
 		// forse un and andrbbe bene chiedere
 		if(currentDocument.find(expanDef).length > 1 || currentDocument.find(corrDef).length > 1 || currentDocument.find(restoreDef).length > 1  || currentDocument.find(regDef).length > 1) {
 			console.log(currentDocument.find("add").length);
 			console.log("nel tuo if");
 		}
 		else{
 			console.log("nel tuo else");
 			config.availableEditionLevel[0].visible=true;
 			config.availableEditionLevel[1].visible=false;
 			config.availableEditionLevel[2].visible=false;
 			
 		}
 	}
 	return parser;
 });