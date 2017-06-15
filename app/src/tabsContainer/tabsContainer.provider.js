angular.module('evtviewer.tabsContainer')

.provider('evtTabsContainer', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	this.$get = function($log, parsedData, evtInterface) {
		var tabsContainer = {},
			collection = {},
			list = [],
			idx = 0;

		var _console = $log.getInstance('tabsContainer');

		// 
		// Control function
		// 
		var destroy = function() {
            var tempId = this.uid;
            // this.$destroy();
            delete collection[tempId];
            // _console.log('vm - destroy ' + tempId);
        };
        
		var toggleSubContent = function(subContentName) {
			var vm = this;
			vm.subContentOpened = vm.subContentOpened !== subContentName ? subContentName : '';
		};

		// 
		// TabsContainer builder
		// 
		tabsContainer.build = function(scope) {
			var currentId 	= scope.id || idx++,
				currentType = scope.type || '',
				orientation = scope.orientation || 'vertical';

			var scopeHelper = {};

			if (typeof(collection[currentId]) !== 'undefined') {
				return;
			}
			var noContent = '<span>No content</span>',
				tabs = {
					_indexes: []
				};

			switch (currentType) {
				case 'projectInfo':
					/* fileDescription */
					var fileDescriptionContent = parsedData.getProjectInfo().fileDescription || '';
					if (fileDescriptionContent && fileDescriptionContent !== '') {
						tabs.fileDescription = {
							label: 'File Description',
							name: 'fileDescription',
							content: fileDescriptionContent || noContent
						};
						tabs._indexes.push('fileDescription');
					}

					/* encodingDescription */
					var encodingDescriptionContent = parsedData.getProjectInfo().encodingDescription || '';
					if (encodingDescriptionContent && encodingDescriptionContent !== '') {
						tabs.encodingDescription = {
							label: 'Encoding Description',
							name: 'encodingDescription',
							content: encodingDescriptionContent || noContent
						};
						tabs._indexes.push('encodingDescription');
					}

					/* textProfile */
					var textProfileContent = parsedData.getProjectInfo().textProfile || '';
					if (textProfileContent && textProfileContent !== '') {
						tabs.textProfile = {
							label: 'Text Profile',
							name: 'textProfile',
							content: textProfileContent || noContent
						};
						tabs._indexes.push('textProfile');
					}

					/* outsideMetadata */
					var outsideMetadataContent = parsedData.getProjectInfo().outsideMetadata || '';
					if (outsideMetadataContent && outsideMetadataContent !== '') {
						tabs.outsideMetadata = {
							label: 'Outside Metadata',
							name: 'outsideMetadata',
							content: outsideMetadataContent || noContent
						};
						tabs._indexes.push('outsideMetadata');
					}

					/* revisionHistory */
					var revisionHistoryContent = parsedData.getProjectInfo().revisionHistory || '';
					if (revisionHistoryContent && revisionHistoryContent !== '') {
						tabs.revisionHistory = {
							label: 'Revision History',
							name: 'revisionHistory',
							content: revisionHistoryContent || noContent
						};
						tabs._indexes.push('revisionHistory');
					}

					/* Bibliography */
					if (parsedData.getBibliographicRefsCollection()._indexes.length > 0) {
						var bibliographyContent = '<evt-bibliography data-id="mainBibliography"></evt-bibliography>';
						tabs.bibliography = {
							label: 'Bibliography',
							name: 'bibliography',
							content: bibliographyContent || noContent,
							scrollDisabled: true
						};
						tabs._indexes.push('bibliography');
					}
					break;
				case 'entitiesList':
					var entitiesCollection = parsedData.getNamedEntitiesCollection();
					tabs._indexes = entitiesCollection._indexes;
					for (var i = 0; i < entitiesCollection._indexes.length; i++) {
						var listIcon = entitiesCollection[listId] && entitiesCollection[listId]._icon ? entitiesCollection[listId]._icon : 'fa-list-ul',
							listId = entitiesCollection._indexes[i],
							listType = entitiesCollection[listId] && entitiesCollection[listId]._type ? entitiesCollection[listId]._type : listId,
							listTitle = entitiesCollection[listId] && entitiesCollection[listId]._title ? entitiesCollection[listId]._title : listId;
						tabs[listId] = {
							label: listTitle,
							icon: listIcon,
							name: listId,
							content: '<evt-list data-list-id="' + listId + '" data-list-type="' + listType + '"></evt-list>',
							scrollDisabled: true
						};
					}
					break;
			}

			var subContentOpened = tabs._indexes.length > 0 ? tabs._indexes[0] : '';

			scopeHelper = {
				// expansion
				uid: currentId,
				type: currentType,
				orientation: orientation,
				defaults: angular.copy(defaults),
				tabs: tabs,

				// model
				subContentOpened: subContentOpened,

				// function
				toggleSubContent: toggleSubContent,
				destroy: destroy
			};

			collection[currentId] = angular.extend(scope.vm, scopeHelper);
			list.push({
				id: currentId,
				type: currentType
			});

			return collection[currentId];
		};


		//
		// Service function
		// 
		
		return tabsContainer;
	};

});