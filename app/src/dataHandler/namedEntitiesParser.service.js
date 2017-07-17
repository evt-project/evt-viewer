/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtNamedEntitiesParser
 * @description 
 * # evtNamedEntitiesParser
 * TODO: Add description and comments for every method
 *
 * @author Chiara Di Pietro
**/
angular.module('evtviewer.dataHandler')

.service('evtNamedEntitiesParser', function(parsedData, evtParser, config) {
	var NEparser = {};
	//TODO retrieve definitions form configurations
	var listsMainContentDef = '<sourceDesc>';
	var listsToParse = [{
		listDef: '<listPlace>',
		contentDef: '<place>',
		contentForLabelDef: '<placeName>',
		type: 'place'
	},{
		listDef: '<listPerson>',
		contentDef: '<person>',
		contentForLabelDef: '<persName>',
		type: 'person'
	},{
		listDef: '<listOrg>',
		contentDef: '<org>',
		contentForLabelDef: '<orgName>',
		type: 'org'
	},{
		listDef: '<list>',
		contentDef: '<item>',
		contentForLabelDef: '',
		type: 'generic'
	}];

	var idAttributeDef 	 = 'xml:id',
		typeAttributeDef = 'type',
		listHeaderDef 	 = '<head>',

		listRelationDef    = '<listRelation>',
		relationDef 	   = '<relation>',
		relationNameDef	   = 'name',
		relationActiveDef  = 'active',
		relationPassiveDef = 'passive',
		relationMutualDef  = 'mutual',
		relationTypeDef    = 'type';

	NEparser.parseEntities = function(doc) {
		var currentDocument = angular.element(doc),
			relationsInListDef = '';

		for (var i = 0; i < listsToParse.length; i++) {
			var listDef = listsMainContentDef.replace(/[<>]/g, '') + ' > ' + listsToParse[i].listDef.replace(/[<>]/g, ''),
				contentDef = listsToParse[i].contentDef.replace(/[<>]/g, ''),
				listType = listsToParse[i].type || 'generic',
				listTitle = 'LISTS.'+listType.toUpperCase();
			relationsInListDef += listDef + ' ' + relationDef.replace(/[<>]/g, '') + ', ';
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
									
									if (listsToParse[i].listDef.indexOf('<' + child.tagName + '>') >= 0) {
										// Parse Direct Sub list 
										NEparser.parseDirectSubList(child, listsToParse[i], defCollection);
									} else if (contentDef.indexOf(child.tagName) >= 0) { 
										el = parseEntity(child, listsToParse[i]);
										parsedData.addNamedEntityInCollection(collection, el, el.id.substr(0, 1).toLowerCase());
									}
								}
							});
							element.parentNode.removeChild(element);
						}
					}
			});
		}
		// Parse relations
		var relations = currentDocument.find(relationsInListDef.slice(0, -2));
		if (relations && relations.length > 0) {
			var defCollection = {
				id : 'parsedRelations',
				type : 'relation',
				title : 'LISTS.RELATION'
			};
			angular.forEach(relations, function(element) {
				NEparser.parseRelationsInList(element, defCollection);
			});
		}

		console.log('## parseEntities ##', parsedData.getNamedEntitiesCollection());
	};

	NEparser.parseDirectSubList = function(nodeElem, listToParse, defCollection) {
		var contentDef = listToParse.contentDef, 
			listDef = listsToParse.listDef;
		angular.forEach(nodeElem.childNodes, function(child){
			if (child.nodeType === 1) {
				var collection = parseCollectionData(child, defCollection);
				var el = {};
				if (contentDef.indexOf(child.tagName) >= 0) { 
					el = parseEntity(child, listToParse);
					parsedData.addNamedEntityInCollection(collection, el, el._listPos);
				}
			}
		});
	};

	NEparser.parseRelationsInList = function(nodeElem, defCollection) {
		var parsedRelation = evtParser.parseXMLElement(nodeElem, nodeElem, {skip: '<evtNote>'}),
			activeRefs = nodeElem.getAttribute(relationActiveDef),
			mutualRefs = nodeElem.getAttribute(relationMutualDef),
			passiveRefs = nodeElem.getAttribute(relationPassiveDef),
			relationName = nodeElem.getAttribute(relationNameDef),
			relationType = nodeElem.getAttribute(relationTypeDef); 

		if (!relationType && nodeElem.parentNode && listRelationDef.indexOf('<'+nodeElem.parentNode.tagName+'>') >= 0) {
			relationType = nodeElem.parentNode.getAttribute(relationTypeDef);			
		}
		relationName = relationName ? evtParser.camelToSpace(relationName) : relationName;

		var elId = nodeElem.getAttribute(idAttributeDef) || evtParser.xpath(nodeElem);
		var relationEl = {
			id         : elId,
			label      : '',
			content    : {
				_indexes: []
			},
			_listPos   : '',
			_xmlSource : nodeElem.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '')
		};
		
		relationEl.content.name = [{
			attributes: { _indexes: [] },
			text: relationName }];
		relationEl.content._indexes.push('name');

		// Relation Label => NAME (TYPE): TEXT [TEXT is set at the bottom of the function]
		relationEl.label = relationName ? relationName.toLowerCase() : '';
		if (relationName) {
			relationEl.label += ' (';
		}
		relationEl.label += relationType ? relationType : 'generic';
		relationEl.label += ' relation';
		if (relationName) {
			relationEl.label += ')';
		}
		

		//relationType = relationType ? '<i>'+relationType+'</i>' : '';
		var relationText = '<span class="relation">',
			activeText = '',
			mutualText = '',
			passiveText = '';

		var activeRefsArray = activeRefs ? activeRefs.split('#').filter(function(el) { return el.length !== 0; }) : [],
			mutualRefsArray = mutualRefs ? mutualRefs.split('#').filter(function(el) { return el.length !== 0; }) : [], 
			passiveRefsArray = passiveRefs ? passiveRefs.split('#').filter(function(el) { return el.length !== 0; }) : [];

		if (activeRefs || mutualRefs || passiveRefs || relationName) {
			var entityElem, entityId, listType;
			for (var i = 0; i < activeRefsArray.length; i++) { 
				entityElem = document.createElement('evt-named-entity-ref');
				entityId = activeRefsArray[i].trim();
				//listType = parsedData.getNamedEntityType(entityId);
				
				if (entityId && entityId !== '') {
					entityElem.setAttribute('data-entity-id', entityId);
				}
				//entityElem.setAttribute('data-entity-type', listType);
				entityElem.textContent = '#' + entityId;
				relationText += entityElem.outerHTML + ' ';
				activeText +=  entityElem.outerHTML.trim() + ', ';
			}

			for (var j = 0; j < mutualRefsArray.length; j++) { 
				if (j === 0 && activeRefs && activeRefs !== '') {
					relationText += '{{ \'AND\' | translate}} ';
				}

				entityElem = document.createElement('evt-named-entity-ref');
				entityId = mutualRefsArray[j].trim();
				//listType = parsedData.getNamedEntityType(entityId);

				if (entityId && entityId !== '') {
					entityElem.setAttribute('data-entity-id', entityId);
				}
				//entityElem.setAttribute('data-entity-type', listType);
				entityElem.textContent = '#' + entityId;
				relationText += entityElem.outerHTML + ' ';
				mutualText +=  entityElem.outerHTML.trim() + ', ';
			}

			relationText += relationName ? '<span class="relation-name">'+relationName + ' </span>' : '';

			for (var k = 0; k < passiveRefsArray.length; k++) { 
				entityElem = document.createElement('evt-named-entity-ref');
				entityId = passiveRefsArray[k].trim();
				//listType = parsedData.getNamedEntityType(entityId);

				if (entityId && entityId !== '') {
					entityElem.setAttribute('data-entity-id', entityId);
				}
				//entityElem.setAttribute('data-entity-type', listType);
				entityElem.textContent = '#' + entityId;
				relationText += entityElem.outerHTML + ' ';
				passiveText +=  entityElem.outerHTML.trim() + ', ';
			}
		}
		relationText += '</span>';
		relationText += parsedRelation ? parsedRelation.innerHTML : nodeElem.innerHTML;
		
		// Update info in pased named entities
		// Active roles
		// Add relation info to active elements
		for (var x = 0; x < activeRefsArray.length; x++) {
			var entityActive = parsedData.getNamedEntity(activeRefsArray[x].trim());
			if (entityActive && relationText !== '') {
				if (!entityActive.content.relations) {
					entityActive.content.relations = [];
					entityActive.content._indexes.push('relations');
				}	
				entityActive.content.relations.push({
					text: '{{ \'LISTS.RELATION_ACTIVE_ROLE \' | translate:\'{relationType:"'+relationType+'"}\'}}: '+ relationText,
					attributes: []
				});
				entityActive._xmlSource += nodeElem.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
			}
		}

		// Mutual roles
		for (var y = 0; y < mutualRefsArray.length; y++) {
			var entityMutual = parsedData.getNamedEntity(mutualRefsArray[y].trim());
			if (entityMutual && relationText !== '') {
				if (!entityMutual.content.relations) {
					entityMutual.content.relations = [];
					entityMutual.content._indexes.push('relations');
				}	
				entityMutual.content.relations.push({
					text: '{{ \'LISTS.RELATION_MUTUAL_ROLE \' | translate:\'{relationType:"'+relationType+'"}\'}}: '+ relationText,
					attributes: []
				});
				entityMutual._xmlSource += nodeElem.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
			}
		}

		// Passive roles
		for (var z = 0; z < passiveRefsArray.length; z++) {
			var entityPassive = parsedData.getNamedEntity(passiveRefsArray[z].trim());
			if (entityPassive && relationText !== '') {
				if (!entityPassive.content.relations) {
					entityPassive.content.relations = [];
					entityPassive.content._indexes.push('relations');
				}	
				entityPassive.content.relations.push({
					text: '{{ \'LISTS.RELATION_PASSIVE_ROLE \' | translate:\'{relationType:"'+relationType+'"}\'}}: '+ relationText,
					attributes: []
				});
				entityPassive._xmlSource += nodeElem.outerHTML.replace(/ xmlns="http:\/\/www\.tei-c\.org\/ns\/1\.0"/g, '');
			}
		}

		// Add details to relation element
		relationEl.label = evtParser.capitalize(relationEl.label + ': '+ relationText);
		relationEl._listPos = relationEl.label.substr(0, 1).toLowerCase();

		if (activeText !== '' || mutualText !== '' || passiveText !== '') {
			var actors = [];

			if (activeText !== '') {
				actors.push({
					attributes: {
						type: 'LISTS.RELATION_ACTIVE',
						_indexes: ['type'] },
					text: activeText.slice(0, -2) });
			}
			
			if (mutualText !== '') {
				actors.push({
					attributes: {
						type: 'LISTS.RELATION_MUTUAL',
						_indexes: ['type'] },
					text: mutualText.slice(0, -2) });
			}

			if (passiveText !== '') {
				actors.push({
					attributes: {
						type: 'LISTS.RELATION_PASSIVE',
						_indexes: ['type'] },
					text: passiveText.slice(0, -2) });
			}

			relationEl.content.actors = actors;
			relationEl.content._indexes.push('actors');
		}


		parsedData.addNamedEntityInCollection(defCollection, relationEl, relationEl._listPos);
	};

	var parseEntity = function(nodeElem, listToParse) {
		var contentDef = listToParse.contentDef, 
			listDef = listToParse.listDef,
			contentForLabelDef = listToParse.contentForLabelDef;
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
		
		var elementForLabel = nodeElem.getElementsByTagName(contentForLabelDef.replace(/[<>]/g, ''));
		if (elementForLabel && elementForLabel.length > 0) {
			var parsedLabel = evtParser.parseXMLElement(elementForLabel[0], elementForLabel[0], {skip: '<evtNote>'});
			el.label = parsedLabel ? parsedLabel.innerHTML : elId;
		} else {
			el.label = elId;
		}

		angular.forEach(nodeElem.childNodes, function(child) {
			// Each child node of XML node will be saved in a JSON structure that looks like this:
			// element: {
			//		content : {
			//			'childNode_1': { 'text': 'Text with HTML of child 1', 'attributes': [ ] }, 
			//			'childNode_2': { 'text': 'Text with HTML of child 2', 'attributes': [ ] }, 
			//			'childNode_n': { 'text': 'Text with HTML of child n', 'attributes': [ ] },
			//			_indexes: [ 'childNode_1', 'childNode_2', 'childNode_n' ]
			//		}
			// }
			// The generic XML parser will transform the content of each node in an HTML element 
			// with Tag Name as Class Name
			if (child.nodeType === 1) {
				if (contentForLabelDef.indexOf('<'+child.tagName+'>') >= 0 && child.children && child.children.length > 0) {
					angular.forEach(child.children, function(subChild) {
						if (subChild.nodeType === 1) {
							parseAndAddContentToEntity(el, subChild, contentDef, listDef);
						}
					});
				} else {
					parseAndAddContentToEntity(el, child, contentDef, listDef);					
				}
			}
		});
		return el;
	};

	var parseAndAddContentToEntity = function(el, child, contentDef, listDef) {
		if (el.content[child.tagName] === undefined) {
			el.content[child.tagName] = [];
			el.content._indexes.push(child.tagName);
		}
		var parsedChild;
		if (contentDef.indexOf('<'+child.tagName+'>') >= 0) {
			parsedChild = NEparser.parseSubEntity(child, contentDef, listDef);
		} else {
			parsedChild = evtParser.parseXMLElement(child, child, {skip: '<evtNote>'});
		}
		el.content[child.tagName].push({
			text: parsedChild ? parsedChild.innerHTML : child.innerHTML,
			attributes: evtParser.parseElementAttributes(child) 
		}); 
	};

	NEparser.parseSubEntity = function(nodeElem, contentDef, listDef) {
		var newNodeElem = document.createElement('evt-named-entity-ref'),
			entityRef = nodeElem.getAttribute('ref'),
			entityId = entityRef ? entityRef.replace('#', '') : undefined;
		if (entityId && entityId !== '') {
			newNodeElem.setAttribute('data-entity-id', entityId);
		}
		var listType = nodeElem.tagName ? nodeElem.tagName : 'generic';
		newNodeElem.setAttribute('data-entity-type', listType);

		var entityContent = '';
		for (var i = 0; i < nodeElem.childNodes.length; i++) {
			var childElement = nodeElem.childNodes[i].cloneNode(true),
				parsedXmlElem;

			if (childElement.nodeType === 1 && listDef.toLowerCase().indexOf('<' + childElement.tagName.toLowerCase() + '>') >= 0 ) {
				parsedXmlElem = NEparser.parseNamedEntitySubList(childElement, childElement, '<evtNote>');
			} else {
				parsedXmlElem = evtParser.parseXMLElement(childElement, childElement, {skip: '<evtNote>'});
			} 
			newNodeElem.appendChild(parsedXmlElem);
		}
		return newNodeElem;
	};

	/* ******************* */
	/* parseNamedEntitySubList(docDOM) */
	/* **************************************************************************** */
	/* Function to parse an XML element representing a named entity sub list	    */
	/* and transform it into an unordered list with attributes as titles 			*/
	/* @doc -> XML to be parsed                                                  	*/
	/* @entityNode -> Node to be transformed										*/
	/* @skip -> names of sub elements to skip from transformation					*/
	/* **************************************************************************** */
	// It will replace the node @entityNode
	// and replace it with a new ul element
	NEparser.parseNamedEntitySubList = function(doc, entityNode, skip) {
		var newNodeElem = document.createElement('span'),
			entityHeadElem = document.createElement('span'),
			headTextContent = '';
		newNodeElem.className = entityNode.tagName.toLowerCase();
		entityHeadElem.className = entityNode.tagName.toLowerCase() + '-attributes';

		for (var i = 0; i < entityNode.attributes.length; i++) {
			var attrib = entityNode.attributes[i];
			if (attrib.specified) {
				newNodeElem.setAttribute('data-' + attrib.name, attrib.value);
				headTextContent += evtParser.camelToSpace(attrib.value) + ', ';
			}
		}
		if (headTextContent !== '') {
			entityHeadElem.textContent = headTextContent.slice(0, -2);
			newNodeElem.appendChild(entityHeadElem);
		}

		for (var j = 0; j < entityNode.childNodes.length; j++) {
			var childElement = entityNode.childNodes[j].cloneNode(true),
				parsedXmlElem = evtParser.parseXMLElement(doc, childElement, {skip: skip});
			newNodeElem.appendChild(parsedXmlElem);
		}
		return newNodeElem;
	};

	var parseCollectionData = function(el, defCollection) {
		var collection = defCollection;
		if (el.previousElementSibling && listHeaderDef.indexOf('<' + el.previousElementSibling.tagName + '>') >= 0) {
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
			var match = '<pb(.|[\r\n])*?\/>(.|[\r\n])*?(?=#' + refId + ')',
				sRegExInput = new RegExp(match, 'ig'),
				matches = docHTML.match(sRegExInput),
				totMatches = matches ? matches.length : 0;
			for (var i = 0; i < totMatches; i++) {
				//Since JS does not support lookbehind I have to get again all <pb in match and take the last one
				var matchOnlyPb = '<pb(.|[\r\n])*?\/>',
					sRegExOnlyPb = new RegExp(matchOnlyPb, 'ig'),
					pbList = matches[i].match(sRegExOnlyPb),
					pbString = pbList && pbList.length > 0 ? pbList[pbList.length - 1] : '';
				var pageId = getPageIdFromHTMLString(pbString);
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