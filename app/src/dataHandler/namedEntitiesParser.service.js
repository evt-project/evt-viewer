/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtNamedEntitiesParser
 * @description 
 * # evtNamedEntitiesParser
 * Service containing methods to parse data regarding named entities and relations among them
 *
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.evtParser
 * @requires evtviewer.dataHandler.parsedData
 *
 * @author CDP
**/
angular.module('evtviewer.dataHandler')

.service('evtNamedEntitiesParser', function(parsedData, evtParser, config) {
	var NEparser = {};
	//TODO retrieve definitions from configurations
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
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtNamedEntitiesParser#parseEntities
     * @methodOf evtviewer.dataHandler.evtNamedEntitiesParser
     *
     * @description
     * This method will parse named entities and store extracted data into 
     * {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
     * It is a generic function that will loop over an arry of possible list <code>listsToParse</code> 
     * and will parse its content depending using tag Names defined in the list itself.
     * Each element of the <code>listsToParse</code> array is structure as follows:
     	<pre>
		var list = {
			listDef: '', // tagName of list
			contentDef: '', // tagName of single entity
			contentForLabelDef: '', // element to be used as main name
			type: '' // typology of list
		}
     	</pre>
     * Once the parser of entities has finished, it will parse all the relations and update information of entities
     * that appear in a relation.
     *
     * @param {string} doc string representing the XML document to be parsed
     *
     * @author CDP
     */
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
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtNamedEntitiesParser#parseDirectSubList
     * @methodOf evtviewer.dataHandler.evtNamedEntitiesParser
     *
     * @description
     * This method will parse all first level sub list and store extracted data into 
     * {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
     *
     * @param {element} nodeElem XML element representing the entity to be parsed
     * @param {Object} listToParse JSON object representing the list that is being parsed; this object is structured as follows:
     	<pre>
		var listToParse = {
			listDef: '', // tagName of list
			contentDef: '', // tagName of single entity
			contentForLabelDef: '', // element to be used as main name
			type: '' // typology of list
		}
     	</pre>
     * @param {Object} defCollection JSON object representing the collection where to store data about relations;
     * this object is structured as follows
     	<pre>
			var defCollection = {
				id : '',
				type : '',
				title : ''
			};
     	</pre>
     *
     * @author CDP
     */
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
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtNamedEntitiesParser#parseRelationsInList
     * @methodOf evtviewer.dataHandler.evtNamedEntitiesParser
     *
     * @description
     * This method will parse all the relations encoded in a list
     * - It will handle information about roles (active, passive, mutual) and about relation type.
     * - It will update data in named entities that appear in the relation itself
     * - Finaly, it will store all data extracted in {@link evtviewer.dataHandler.parsedData parsedData} for future retrievements.
     *
     * @param {element} nodeElem XML element representing the entity to be parsed
     * @param {Object} defCollection JSON object representing the collection where to store data about relations. 
     * This object is structured as follows
     	<pre>
			var defCollection = {
				id : '',
				type : '',
				title : ''
			};
     	</pre>
     *
     * @author CDP
     */
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
		
		// Update info in passed named entities
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
	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtNamedEntitiesParser#parseEntity
     * @methodOf evtviewer.dataHandler.evtNamedEntitiesParser
     *
     * @description
     * [PRIVATE] This is a very generic function to parse a single entity.
     * The content of the entity is parsed in a very generic way:
     * - A loop will transform every child node of the given element in a JSON structure that looks like this:
     	<pre>
     		var element = {
     			content : {
     				'childNode_1': { 'text': 'Text with HTML of child 1', 'attributes': [ ] }, 
     				'childNode_2': { 'text': 'Text with HTML of child 2', 'attributes': [ ] }, 
     				'childNode_n': { 'text': 'Text with HTML of child n', 'attributes': [ ] },
     				_indexes: [ 'childNode_1', 'childNode_2', 'childNode_n' ]
     			}
     		};
     	</pre>
     * - The generic XML parser will transform the content of each node in an HTML element with *Tag Name* as *Class Name*
     *
     * @param {element} nodeElem XML element representing the entity to parse
     * @param {string} listToParse encoding definitions of the list to which the entity belongs
     *
     * @returns {Object} JSON element representing the entity, structure as follows:
     	<pre>
			var el = {
				id         : '',
				label      : '',
				content    : {
					_indexes: []
				},
				_listPos   : '',
				_xmlSource : ''
			};
     	</pre>
     * 
     * @author CDP
     */
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
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtNamedEntitiesParser#parseSubEntity
     * @methodOf evtviewer.dataHandler.evtNamedEntitiesParser
     *
     * @description
     * This method will parse entities nested into other entities.
     *
     * @param {element} nodeElem XML element representing the main entity
     * @param {string} contentDef encoding definitions of the single entity
     * @param {string} listDef encoding definitions of the list to which the entity belongs
     *
     * @returns {element} <code>evt-named-entity-ref</code> pointing to given entity reference
     * 
     * @author CDP
     */
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
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtNamedEntitiesParser#parseNamedEntitySubList
     * @methodOf evtviewer.dataHandler.evtNamedEntitiesParser
     *
     * @description
     * This method will parse an XML element representing a named entity sub list
	 * and transform it into an unordered list with attributes as titles
     * It will replace the node <code>entityNode</code> with a new <code>ul</code> element.
     * 
     * @param {element} doc XML element representing the document to be parsed
     * @param {element} entityNode node to be transformed
     * @param {string} skip names of sub elements to skip from transformation
     *
     * @returns {element} new element created from entity node
     * 
     * @author CDP
     */
	NEparser.parseNamedEntitySubList = function(doc, entityNode, skip) {
		var newNodeElem = document.createElement('span'),
			entityHeadElem = document.createElement('span'),
			headTextContent = '';
		newNodeElem.className = entityNode.tagName.toLowerCase();
		entityHeadElem.className = entityNode.tagName.toLowerCase() + '-attributes';

		for (var i = 0; i < entityNode.attributes.length; i++) {
			var attrib = entityNode.attributes[i];
			if (attrib.specified) {
				newNodeElem.setAttribute('data-' + attrib.name.replace(':','-'), attrib.value);
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
	/**
     * @ngdoc function
     * @name evtviewer.dataHandler.evtNamedEntitiesParser#parseCollectionData
     * @methodOf evtviewer.dataHandler.evtNamedEntitiesParser
     *
     * @description
     * [PRIVATE] This is a very generic function that will parse the information about an collection of entities.
     *
     * @param {element} el XML element representing the collection to be parsed
     * @param {Object} defCollection JSON object representing the parsed collection and containing data already retrieved. 
     *
     * @returns {Object} JSON object representing a collection of entities, structured as follows:
     	<pre>
			var defCollection = {
				id : ''
				type : '',
				title : ''
			};
     	</pre>
     * 
     * @author CDP
     */
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
	/**
     * @ngdoc method
     * @name evtviewer.dataHandler.evtNamedEntitiesParser#parseEntitiesOccurrences
     * @methodOf evtviewer.dataHandler.evtNamedEntitiesParser
     *
     * @description
     * This method will parse all the occurrences of a particular named entity..
     * - It will use regular expression to find the page breaks before a specific occurence
     * - For each page break identified, it will retrieve the detailed information already parsed and stored in 
     * {@link evtviewer.dataHandler.parsedData parsedData}.
     *
     * @param {element} docObj XML element representing the document to be parsed
     * @param {string} refId id of named entity to handle
     *
     * @returns {array} array of pages in which the given named entity appears. 
     * Each page is structured as follows:
     	<pre>
			var page = {
				pageId: ''.
				pageLabel: '',
				docId: '',
				docLabel: ''
			}
     	</pre>
     * 
     * @author CDP
     */
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