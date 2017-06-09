angular.module('evtviewer.dataHandler')

.service('evtNamedEntitiesParser', function(parsedData, evtParser, config) {
	var NEparser = {};
	//TODO retrieve definitions form configurations
	var listsMainContentDef = '<sourceDesc>';
	var listsToParse = [{
		listDef: '<listPlace>',
		contentDef: '<place>',
		type: 'place'
	},{
		listDef: '<listPerson>',
		contentDef: '<person>',
		type: 'person'
	},{
		listDef: '<listOrg>',
		contentDef: '<org>',
		type: 'org'
	}, {
		listDef: '<list>',
		contentDef: '<item>',
		type: 'generic'
	}];
	var idAttributeDef 	 = 'xml:id',
		typeAttributeDef = 'type',
		listHeaderDef 	 = 'head';

	NEparser.parseEntities = function(doc) {
		var currentDocument = angular.element(doc);

		for (var i = 0; i < listsToParse.length; i++) {
			var listDef = listsMainContentDef.replace(/[<>]/g, '') + ' ' + listsToParse[i].listDef.replace(/[<>]/g, ''),
				contentDef = listsToParse[i].contentDef.replace(/[<>]/g, ''),
				listType = listsToParse[i].type || 'generic',
				listTitle = 'Lista';
			
			// TEMP
			switch (listType) {
				case 'place':
					listTitle = 'List of Places';
					break;
				case 'person':
					listTitle = 'List of Persons';
					break;
				case 'org':
					listTitle = 'List of Organizations';
					break;
				default:
					listTitle = 'Lista generica';

			}
			angular.forEach(currentDocument.find(listDef), 
				function(element) {
					// We consider only first level lists; inset lists will be considered differently
					if ( !evtParser.isNestedInElem(element, element.tagName) ) { 
						var listId = element.getAttribute(idAttributeDef) || undefined;
						if (listType !== 'generic' || (listType === 'generic' && listId !== undefined)) { //Generic lists only allowed if have an id
							var defCollection = {
								id : listId || evtParser.xpath(element),
								type : listType,
								title : listTitle
							};
							angular.forEach(element.childNodes, function(child){
								if (child.nodeType === 1) {
									var collection = parseCollectionData(child, defCollection);
									var el = {};
									
									if (contentDef.indexOf(child.tagName) >= 0) { 
										el = parseEntity(child);
										parsedData.addNamedEntityInCollection(collection, el, el.id.substr(0, 1).toLowerCase());
									}
								}
							});
						}
					}
			});
		}

		// TODO: Generalize parser;
		console.log('## parseEntities ##', parsedData.getNamedEntitiesCollection());
	};

	var parseEntity = function(nodeElem) {
		var elId = nodeElem.getAttribute(idAttributeDef) || evtParser.xpath(nodeElem);
		var el = {
			id         : elId,
			label      : '',
			content    : {
				_indexes: []
			},
			_listPos   : elId.substr(0, 1).toLowerCase(),
			_xmlSource : nodeElem.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '')
		};
		el.label = elId; //TEMP

		angular.forEach(nodeElem.childNodes, function(child){
			if (child.nodeType === 1) {
				if (el.content[child.tagName] === undefined) {
					el.content[child.tagName] = [];
					el.content._indexes.push(child.tagName);
				}
				var parsedChild = evtParser.parseXMLElement(child, child, 'evtNote');
				el.content[child.tagName].push({
					text: parsedChild ? parsedChild.innerHTML : child.innerHTML,
					attributes: evtParser.parseElementAttributes(child) 
				}); 
			}
		});

		return el;
	};

	var parseCollectionData = function(el, defCollection) {
		var collection = defCollection;
		if (el.previousElementSibling && el.previousElementSibling.tagName === listHeaderDef) {
			collection.id = el.previousElementSibling.textContent.trim().replace(/\s/g, '');
			collection.title = el.previousElementSibling.textContent.trim();
		} else {
			var parentNode = el.parentNode,
				listId;
			if (parentNode && parentNode.getAttribute(idAttributeDef)) {
				listId = parentNode.getAttribute(idAttributeDef).trim().replace(/\s/g, '');
				collection.id = listId;
				collection.title = listId;
			}
			if (parentNode && parentNode.getAttribute(typeAttributeDef)) {
				var listTitle = parentNode.getAttribute(typeAttributeDef).trim();
				if (!listId || listId === undefined) {
					collection.id = listTitle;
				}
				listTitle = evtParser.camelToSpace(listTitle);
				collection.title = (listTitle.substr(0, 1).toUpperCase() + listTitle.substr(1));
			}
		}
		return collection;
	};

	// NAMED ENTITIES OCCURRENCES
	var getPageIdFromHTMLString = function(HTMLstring) {
		var matchPbIdAttr = 'xml:id=".*"',
			sRegExPbIdAttr = new RegExp(matchPbIdAttr, 'ig'),
			pbHTMLString = HTMLstring.match(sRegExPbIdAttr);
		sRegExPbIdAttr = new RegExp('xml:id=(?:"[^"]*"|^[^"]*$)', 'ig');
		var idAttr = pbHTMLString ? pbHTMLString[0].match(sRegExPbIdAttr) : undefined,
			pageId = idAttr ? idAttr[0].replace(/xml:id/, '').replace(/(=|\"|\')/ig, '') : '';
		return pageId;
	};

	NEparser.parseEntitiesOccurrences = function(docObj, refId) {
		var doc = docObj && docObj.content ? docObj.content : undefined,
			docHTML = doc ? doc.outerHTML : undefined,
			pages = [];
		if (docHTML && refId && refId !== '') {
			var match = '<pb(.|[\r\n])*?(?!<pb)(?=#' + refId + ')',
				sRegExInput = new RegExp(match, 'ig'),
				matches = docHTML.match(sRegExInput),
				totMatches = matches ? matches.length : 0;
			for (var i = 0; i < totMatches; i++) {
				var pageId = getPageIdFromHTMLString(matches[i]);
				if (pageId) {
					var pageObj = parsedData.getPage(pageId);
					pages.push({ 
						pageId: pageId, 
						pageLabel: pageObj ? pageObj.label : pageId,
						docId: docObj ? docObj.value : '',
						docLabel: docObj ? docObj.label : '' 
					});
				}
			}
		}
		return pages;
	};

	return NEparser;
});