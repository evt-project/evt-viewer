/**
 * @ngdoc service
 * @module evtviewer.select
 * @name evtviewer.select.evtSelect
 * @description 
 * # evtSelect
 * This provider expands the scope of the
 * {@link evtviewer.select.directive:evtSelect evtSelect} directive 
 * and stores its reference untill the directive remains instantiated.
 * It also add some modules to controller, according to <code>&lt;evt-select&gt;</code> type.
 *
 * @requires $log
 * @requires evtviewer.core.config
 * @requires evtviewer.core.Utils
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.namedEntity.evtNamedEntityRef
 * @requires evtviewer.namedEntity.evtGenericEntity
 * @requires evtviewer.UItools.evtPinnedElements
 * @requires evtviewer.dataHandler.evtSourcesApparatus
**/
angular.module('evtviewer.select')

.provider('evtSelect', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	this.$get = function($log, config, Utils, parsedData, evtInterface, evtNamedEntityRef, evtGenericEntity, evtPinnedElements, evtSourcesApparatus) {
		var select = {},
			collection = {},
			list = [],
			idx = 0;

		var _console = $log.getInstance('select');

		// 
		// Select builder
		// 
		/**
	     * @ngdoc method
	     * @name evtviewer.select.evtSelect#build
	     * @methodOf evtviewer.select.evtSelect
	     *
	     * @description
	     * <p>This method will extend the scope of {@link evtviewer.select.directive:evtSelect evtSelect} directive 
	     * according to selected configurations and parsed data.</p>
	     * <p>According to <code>type</code> it will set the methods **callback**, **formatOptionList** and **formatOption**
	     * and it will set the available options list.
		 * <p>Handled types are: <ul>
		 * <li>"**page**":<ul> 
		 * 		<li>option list will contain all available pages;</li>
		 * 		<li>callback will update the current page on interface, 
		 * 			updating eventually the current document too.</li></ul></li>
		 * <li>"**document**":<ul> 
		 * 		<li>option list will contain all available documents;</li>
		 * 		<li>callback will update the current document on interface, 
		 * 			updating eventually the current page too.</li></ul></li>
		 * <li>"**edition**":<ul> 
		 * 		<li>option list will contain all available editions;</li>
		 * 		<li>callback will update the current edition level on interface.</li></ul>/li>
		 * <li>"**named-entities**":<ul>
		 * 		<li>**" option list will contain all available (named) entities, 
		 * 		divided in "*named entitites*" and "*generic entities";</li>
		 * 		<li>it will allow multiple selection (and thus will have a "*Select All*" option 
		 * 			and a "*Clear*" option;</li>
		 * 		<li>callback will (de)active the selected (named) entities type
		 * 			in order to (de)highilight them. </li></ul>/li>
		 * <li>"**witness**":<ul> 
		 * 		<li>option list will contain all available witnesses;</li>
		 * 		<li>callback will update the selected witnesses (and URL) in collation view mode.</li></ul>/li>
		 * <li>"**witness-page**":<ul>
		 * 		<li>**" option list will contain all available pages for a given witness;</li>
		 * 		<li>callback will update current page for given witness and will eventally 
		 * 			scroll the main text to selected page anchor.</li></ul>/li>
		 * <li>"**pinned-filter**"<ul>
		 * 		<li>**" option list will contain all available pinned filters;</li>
		 * 		<li>callback will decide which pinned elements to show;</li>
		 * 		<li>it will allow multiple selection (and thus will have a "*Select All*" option 
		 * 			and a "*Clear*" option.</li></ul>/li>
		 * <li>"**source**":<ul> 
		 * 		<li>option list will contain all available sources;</li>
		 * 		<li>callback will update current source on interface.</li></ul>/li>
		 * <li>"**version**":<ul> 
		 * 		<li>option list will contain all available versions;</li>
		 * 		<li>callback will update current version on interface.</li></ul></li>
		 * </ul></p>
		 * <p>To see details of callback function just open the file and read.</p>
		 * <p>You can add your own type of select, if the same select used in different places 
		 * should always have the same behaviour.</p>
		 *
		 * @param {Object} scope initial scope of the directive:
		 	<pre>
				var scope: {
		            id: '@',
		            type: '@',
		            init: '@',
		            openUp: '@',
		            multiselect: '@'
		        };
		 	</pre>
		 *
		 * @returns {Object} extended scope:
		 	<pre>
				var scopeHelper = {
					// expansion
					uid: currentId,
					defaults: angular.copy(defaults),
					callback: callback,
					initValue: initValue,
					currentType: currentType,
					multiselect: multiselect,
					openUp: openUp,
					// model
					optionList: optionList,
					optionSelected: optionSelected,
					optionSelectedValue: optionSelectedValue,
					formatOptionList: formatOptionList,
					formatOption: formatOption
				};
		 	</pre>
	     */
		select.build = function(scope, vm) {
			var currentId = scope.id || idx++,
				currentType = scope.type || 'default',
				initValue = scope.init || undefined,
				openUp = scope.openUp || false,
				multiselect = scope.multiselect || false,
				optionList = [],
				optionSelected,
				optionSelectedValue,
				marginTop = 0; //Needed for selector that open up
			/**
		     * @ngdoc method
		     * @name evtviewer.select.controller:SelectCtrl#callback
		     * @methodOf evtviewer.select.controller:SelectCtrl
		     *
		     * @description
		     * Callback fired when user clicks on select. It depends on select type:<ul>
			 * <li>"**page**": it will update the current page on interface, 
			 * 			updating eventually the current document too.</li>
			 * <li>"**document**": it will update the current document on interface, 
			 * 			updating eventually the current page too.</li>
			 * <li>"**edition**": it will update the current edition level on interface.</li>
			 * <li>"**named-entities**": it will (de)active the selected (named) entities type
			 * 			in order to (de)highilight them. </li>
			 * <li>"**witness**": it will update the selected witnesses (and URL) in collation view mode.</li>
			 * <li>"**witness-page**": it will update current page for given witness and will eventally 
			 * 			scroll the main text to selected page anchor.</li>
			 * <li>"**pinned-filter**": it will decide which pinned elements to show;</li>
			 * <li>"**source**": it will update current source on interface.</li>
			 * <li>"**version**": it will update current version on interface.</li>
		     * </ul>
		     */
			var callback;
			/**
		     * @ngdoc method
		     * @name evtviewer.select.controller:SelectCtrl#formatOptionList
		     * @methodOf evtviewer.select.controller:SelectCtrl
		     *
		     * @description
		     * Prepare option list objects in order to reflects generic model:
			     <pre>
					var optionList = [{
						value: '',
						label: '',
						title: '',
						additionalClass: ''
					}];
			     </pre>
		     */
		    var formatOptionList;
			/**
		     * @ngdoc method
		     * @name evtviewer.select.controller:SelectCtrl#formatOption
		     * @methodOf evtviewer.select.controller:SelectCtrl
		     *
		     * @description
		     * Prepare single option object in order to reflects generic model:
			     <pre>
					var option = {
						value: '',
						label: '',
						title: '',
						additionalClass: ''
					};
			     </pre>
		     */
		    var formatOption;

			var optionSelectAll;
			var scopeHelper = {};

			if (typeof(collection[currentId]) !== 'undefined') {
				return;
			}

			switch (currentType) {
				case 'page':
					callback = function(oldOption, newOption) {
						_console.log('page select callback ', newOption);
						if (newOption !== undefined) {
							vm.selectOption(newOption);
							var currentDocument = evtInterface.getState('currentDoc');
							evtInterface.updateState('currentPage', newOption.value);
							if (newOption.docs.length > 0 && newOption.docs.indexOf(currentDocument) < 0) { // The page is not part of the document
								evtInterface.updateState('currentDoc', newOption.docs[0]);
							}
							evtInterface.updateUrl();
						}
					};
					formatOptionList = function(optionList) {
						var formattedList = [];
						for (var i = 0; i < optionList.length; i++) {
							formattedList.push(optionList[optionList[i]]);
						}
						return formattedList;
					};
					formatOption = function(option) {
						return option;
					};
					optionList = formatOptionList(parsedData.getPages());
					break;
				case 'document':
					callback = function(oldOption, newOption) {
						// _console.log('document select callback ', newOption);
						if (newOption !== undefined) {
							vm.selectOption(newOption);
							var currentPage = evtInterface.getState('currentPage');
							evtInterface.updateState('currentDoc', newOption.value);
							if (newOption.pages.length > 0 && newOption.pages.indexOf(currentPage) < 0) { // The page is not part of the document
								evtInterface.updateState('currentPage', newOption.pages[0]);
							}
							evtInterface.updateUrl();
						}
					};
					formatOptionList = function(optionList) {
						var formattedList = [];
						for (var i = 0; i < optionList._indexes.length; i++) {
							formattedList.push(optionList[optionList._indexes[i]]);
						}
						return formattedList;
					};
					formatOption = function(option) {
						return option;
					};
					optionList = formatOptionList(parsedData.getDocuments());
					break;
				case 'edition':
				case 'comparingEdition':
					callback = function(oldOption, newOption) {
						if (newOption !== undefined && 
							(oldOption !== undefined && oldOption[0] !== undefined && 
								newOption.value !== oldOption[0].value)) {
							vm.selectOption(newOption);
							var stateToUpdate, oppositeStateName;
							if (currentType === 'edition') {
								stateToUpdate = 'currentEdition';
								// change currentComparingEdition if equal to selected
								oppositeStateName = 'currentComparingEdition';
							} else if (currentType === 'comparingEdition') {
								stateToUpdate = 'currentComparingEdition';
								// change currentEdition if equal to selected
								oppositeStateName = 'currentEdition';
							} 
							var oppositeState = evtInterface.getState(oppositeStateName);
							if (oppositeState === newOption.value) {
								evtInterface.updateState(oppositeStateName, oldOption[0].value);
							}
							evtInterface.updateState(stateToUpdate, newOption.value);
							evtInterface.updateUrl();
						}
					};
					formatOptionList = function(optionList) {
						return optionList;
					};
					formatOption = function(option) {
						return option;
					};
					optionList = formatOptionList(parsedData.getEditions());
					break;
				case 'named-entities':
					optionSelectedValue = initValue;
					optionSelectAll = {
						value: 'ALL',
						label: 'SELECTS.SELECT_ALL',
						title: 'SELECTS.SELECT_ALL_NAMED_ENTITIES',
						additionalClass: 'doubleBorderTop'
					};

					callback = function(oldOption, newOption) {
						if (newOption !== undefined) {
							//_console.log('Named Entities select callback ', newOption);
							vm.selectOption(newOption);
							if (newOption.value === 'ALL') {
								// SELECT ALL OPTIONS
								var optionListLength = optionList && optionList.length > 3 ? optionList.length - 2 : 0;
								for (var i = 0; i < optionListLength; i++) {
									var optionToSelect = optionList[i];

									if (!vm.isOptionSelected(optionToSelect)) {
										vm.selectOption(optionToSelect);
										if (optionToSelect.type === 'namedEntity') {
											evtNamedEntityRef.addActiveType(optionToSelect.value);
										} else if (optionToSelect.type !== 'groupTitle') {
											evtGenericEntity.addActiveType(optionToSelect.value, optionToSelect.color);
										}
									}
								}
								vm.selectOption(newOption);
							} else if (newOption.value === 'NONE') {
								// CLEAR SELECTION
								var optionSelected = vm.optionSelected ? vm.optionSelected : [];
								for (var j = 0; j < optionSelected.length; j++) {
									var option = optionList[j];
									if (option.value !== 'ALL') {
										if (option.type === 'namedEntity') {
											evtNamedEntityRef.removeActiveType(option.value);
										} else {
											evtGenericEntity.removeActiveType(option.value, option.color);
										}
									}
								}
								vm.optionSelected = [];
								vm.selectOption(newOption);
							} else if (newOption.type === 'namedEntity') {
								if (vm.isOptionSelected(newOption)) {
									evtNamedEntityRef.addActiveType(newOption.value);
								} else {
									evtNamedEntityRef.removeActiveType(newOption.value);
								}
							} else {
								if (vm.isOptionSelected(newOption)) {
									evtGenericEntity.addActiveType(newOption.value, newOption.color);
								} else {
									evtGenericEntity.removeActiveType(newOption.value, newOption.color);
								}
							}
						}
					};

					formatOptionList = function(optionList, type) {
						var formattedList = [];
						if (optionList) {
							for (var i = 0; i < optionList.length; i++) {
								var currentOption = optionList[i];
								if (currentOption.available) {
									var icon = 'fa-circle';
									if (type === 'namedEntity') {
										icon = parsedData.getNamedEntityTypeIcon(currentOption.tagName) || icon;
									}
									var option = {
										icon: icon,
										type: type,
										value: currentOption.tagName,
										label: currentOption.label,
										title: currentOption.label,
										color: currentOption.color
									};
									formattedList.push(option);
								}
							}
						}
						return formattedList;
					};

					formatOption = function(option) {
						return option;
					};
					var namedEntitiesList = formatOptionList(config.namedEntitiesToHandle, 'namedEntity'),
						otherEntitiesList = formatOptionList(config.otherEntitiesToHandle, '');
					optionList = [];
					if (namedEntitiesList.length > 0) {
						optionList.push({
							label: 'SELECTS.NAMED_ENTITIES',
							type: 'groupTitle'
						});
						optionList = optionList.concat(namedEntitiesList);
					}
					if (otherEntitiesList.length > 0) {
						optionList.push({
							label: 'SELECTS.OTHER_ENTITIES',
							type: 'groupTitle'
						});
						optionList = optionList.concat(otherEntitiesList);
					}
					if (optionList.length > 0) {
						optionList.push(optionSelectAll);
						optionList.push({
							value: 'NONE',
							label: 'SELECTS.CLEAR',
							title: 'SELECTS.CLEAR_SELECTION'
						});
					}
					break;
				case 'witness':
					optionSelectedValue = initValue;
					callback = function(optionSelected, newOption) {
						vm.collapse();
						if (optionSelected !== undefined && optionSelected[0] !== undefined) {
							if (newOption !== undefined) {
								evtInterface.switchWitnesses(optionSelected[0].value, newOption.value);
								evtInterface.updateUrl();
							}
						} else if (newOption !== undefined) {
							evtInterface.addWitness(newOption.value);
							evtInterface.updateUrl();
						}
					};
					formatOptionList = function(optionList) {
						var formattedList = [],
							witnesses = optionList._indexes.witnesses;
						for (var i = 0; i < witnesses.length; i++) {
							var currentOption = optionList[witnesses[i]];
							var option = {
								value: currentOption.id,
								label: currentOption.id,
								title: currentOption.description
							};
							if (config.versions.length > 0 && evtInterface.getProperty('availableWitnesses').indexOf(witnesses[i]) >= 0) {
								formattedList.push(option);
							} else if (config.versions.length <= 0) {
								formattedList.push(option);
							}
						}
						return formattedList;
					};
					formatOption = function(option) {
						var formattedOption = {};
						formattedOption = {
							value: option.id,
							label: option.id,
							title: option.description
						};
						return formattedOption;
					};
					optionList = formatOptionList(parsedData.getWitnesses());
					break;
				case 'witness-page':
					var witness = scope.$parent.vm.witness;
					optionSelectedValue = initValue;
					callback = function(oldOption, newOption) {
						if (newOption !== undefined) {
							vm.selectOption(newOption);
							evtInterface.updateWitnessesPage(witness, newOption.value.split('-')[1]);
							evtInterface.updateUrl();
							scope.$parent.vm.scrollToPage(newOption.value);
						}
					};
					formatOptionList = function(optionList) {
						var formattedList = [];
						for (var i = 0; i < optionList.length; i++) {
							formattedList.push(optionList[optionList[i]]);
						}
						return formattedList;
					};
					formatOption = function(option) {
						return option;
					};
					optionList = formatOptionList(parsedData.getWitnessPages(witness));
					break;
				case 'pinned-filter':
					optionSelectedValue = initValue;
					optionSelected = [];
					optionSelectAll = {
						value: 'ALL',
						label: 'SELECTS.SELECT_ALL',
						title: 'SELECTS.SELECT_ALL_TYPES',
						additionalClass: 'doubleBorderTop'
					};

					callback = function(oldOption, newOption) {
						if (newOption !== undefined) {
							//_console.log('Named Entities select callback ', newOption);
							vm.selectOption(newOption);
							if (newOption.value === 'ALL') {
								// SELECT ALL OPTIONS
								var optionListLength = optionList && optionList.length > 3 ? optionList.length - 2 : 0;
								for (var i = 0; i < optionListLength; i++) {
									var optionToSelect = optionList[i];

									if (!vm.isOptionSelected(optionToSelect)) {
										vm.selectOption(optionToSelect);
									}
								}
								//TODO: set all pinned visible + Add filters
								evtPinnedElements.setAllTypesVisible();
								vm.selectOption(newOption);
							} else if (newOption.value === 'NONE') {
								// CLEAR SELECTION
								vm.optionSelected = [];
								vm.selectOption(newOption);
								//TODO: set all pinned visible + clear filters
								evtPinnedElements.resetVisibleTypes();
							} else {
								if (vm.isOptionSelected(newOption)) {
									// TODO: set pinned type visible
									evtPinnedElements.addVisibleType(newOption.value);
								} else {
									// TODO: set pinned type invisible
									evtPinnedElements.removeVisibleType(newOption.value);
								}
							}
						}
					};

					formatOptionList = function(optionList) {
						var formattedList = [];
						if (optionList) {
							for (var i = 0; i < optionList.length; i++) {
								var currentOption = optionList[i];
								var option = {
									value: currentOption,
									label: currentOption,
									title: currentOption
								};
								formattedList.push(option);
							}
						}
						if (formattedList.length > 0) {
							formattedList.push(optionSelectAll);
							formattedList.push({
								value: 'NONE',
								label: 'SELECTS.CLEAR',
								title: 'SELECTS.CLEAR_SELECTION'
							});
						}
						return formattedList;
					};

					formatOption = function(option) {
						return option;
					};
					var availablePinnedTypes = evtPinnedElements.getAvailablePinnedTypes();
					optionList = formatOptionList(availablePinnedTypes);
					break;
				//Case added By CM
				case 'source':
					callback = function(oldOption, newOption) {
						if (newOption !== undefined) {
							vm.selectOption(newOption);
							evtInterface.updateCurrentSourceText(newOption.value);
							evtInterface.updateState('currentSource', newOption.value);
						}
					};
					formatOptionList = function(optionList) {
						var formattedList = [];
						for (var i = 0; i < optionList.length; i++) {
							var currentOption = optionList[i];
							var option = {
								value: currentOption.id,
								label: evtSourcesApparatus.getSourceAbbr(currentOption),
								title: 'SELECTS.SEE_FULL_TEXT'
							};
							formattedList.push(option);
						}
						return formattedList;
					};
					formatOption = function(option) {
						var formattedOption = {};
						formattedOption = {
							value: option.id,
							label: evtSourcesApparatus.getSourceAbbr(option),
							title: 'SELECTS.SEE_FULL_TEXT'
						};
						return formattedOption;
					};
					optionList = formatOptionList(parsedData.getSources()._indexes.availableTexts);
					break;
				// author --> CM //
				case 'version':
					optionSelectedValue = initValue;
					callback = function(oldOption, newOption) {
						vm.collapse();
						if (evtInterface.getState('currentViewMode') !== 'collation') {
							if (oldOption !== undefined) {
								if (newOption !== undefined) {
									evtInterface.switchVersions(oldOption[0].value, newOption.value);
								}
							} else if (newOption !== undefined) {
								evtInterface.addVersion(newOption.value);
							}
						} else {
							if (newOption !== undefined) {
								evtInterface.updateCurrentVersion(newOption.value);
								evtInterface.updateAvailableWitnessesByVersion(newOption.value);
							}
						}
					};
					formatOptionList = function(optionList) {
						var formattedList = [],
							versions = optionList._indexes.versionId;
						for (var i in versions) {
							var currentOption, option;
                            if (evtInterface.getState('currentViewMode') !== 'collation') {
								if (i !== config.versions[0] && i !== '_name') {
									currentOption = versions[i];
									option = {
										value: i,
										label: Utils.DOMutils.decodeHTMLEntities(currentOption),
										title: 'MESSAGES.SEE_VERSION_TEXT'
									};
									formattedList.push(option);
								}
							} else {
								var verWits = parsedData.getVersionEntries()._indexes.versionWitMap[i];
								if (verWits !== undefined && verWits.length > 0) {
									currentOption = versions[i];
									option = {
										value: i,
										label: Utils.DOMutils.decodeHTMLEntities(currentOption),
										title: 'MESSAGES.SEE_WITNESS'
									};
									formattedList.push(option);
								}
							}
						}
						return formattedList;
					};
					formatOption = function(option) {
						var formattedOption = {};
						var optionLabel = parsedData.getVersionEntries()._indexes.versionId[option];
						formattedOption = {
							value: option,
							label: Utils.DOMutils.decodeHTMLEntities(optionLabel),
							title: 'MESSAGES.SEE_VERSION_TEXT'
						};
						return formattedOption;
					};
					optionList = formatOptionList(parsedData.getVersionEntries());
					break;
			}

			scopeHelper = {
				// expansion
				uid: currentId,
				defaults: angular.copy(defaults),
				callback: callback,
				initValue: initValue,
				currentType: currentType,
				multiselect: multiselect,
				openUp: openUp,
				// model
				optionList: optionList,
				optionSelected: optionSelected,
				optionSelectedValue: optionSelectedValue,
				formatOptionList: formatOptionList,
				formatOption: formatOption
			};

			collection[currentId] = angular.extend(vm, scopeHelper);
			list.push({
				id: currentId,
				type: currentType
			});

			return collection[currentId];
		};


		//
		// Service function
		// 
		/**
	     * @ngdoc method
	     * @name evtviewer.select.evtSelect#getById
	     * @methodOf evtviewer.select.evtSelect
	     *
	     * @description
	     * Get the reference of the instance of a particular <code>&lt;evt-select&gt;</code>.
		 * 
		 * @param {string} currentId id of select to retrieve
		 *
		 * @returns {Object} reference of the instance of <code>&lt;evt-select&gt;</code> with given id
	     */
		select.getById = function(currentId) {
			if (collection[currentId] !== undefined) {
				return collection[currentId];
			}
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.select.evtSelect#getList
	     * @methodOf evtviewer.select.evtSelect
	     *
	     * @description
	     * Get the list of all the instance of <code>&lt;evt-select&gt;</code>.
		 *
		 * @returns {array} array of ids of all the instance of <code>&lt;evt-select&gt;</code>.
	     */
		select.getList = function() {
			return list;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.select.evtSelect#expandById
	     * @methodOf evtviewer.select.evtSelect
	     *
	     * @description
	     * <p>Expand select with a certain id.</p>
	     * <p>This function is useful if we want to trigger the expansion from an external service/controller.</p>
	     * <p> It eventually collapse all other <code>&lt;evt-select&gt;</code>.</p>
	     *
	     * @param {string} currentId id of select to expand
	     * @param {boolean=} closeSiblings whether or not to collapse all other expanded selectors.
	     */
		select.expandById = function(currentId, closeSiblings) {
			if (collection[currentId] !== 'undefined') {
				collection[currentId].expand();
				if (closeSiblings) {
					select.closeAll();
				}
			}
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.select.evtSelect#closeAll
	     * @methodOf evtviewer.select.evtSelect
	     *
	     * @description
	     * <p>Collapse all instantiated <code>&lt;evt-select&gt;</code>,
	     * expect that with given id.</p>
	     *
	     * @param {string} skipId id of select to skip from closing
	     */
		select.closeAll = function(skipId) {
			angular.forEach(collection, function(currentSelect, currentId) {
				if (currentId !== skipId) {
					currentSelect.collapse();
				}
			});
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.select.evtSelect#addOption
	     * @methodOf evtviewer.select.evtSelect
	     *
	     * @description
	     * <p>Add option to list.</p>
	     *
	     * @param {string} currentId id of select to which add a new option
	     * @param {Object} add new option, structured as follows
	     	<pre>
	            var selectedOption = {
	                value,
	                label,
	                title
	            };
	        </pre>
	     */
		select.addOption = function(currentId, option) {
			if (collection[currentId] !== 'undefined') {
				collection[currentId].optionList.push(option);
			}
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.select.evtSelect#setCallback
	     * @methodOf evtviewer.select.evtSelect
	     *
	     * @description
	     * <p>Set new callback to select.</p>
	     *
	     * @param {string} currentId id of select to handle
	     * @param {function} callback new function to use as callback
	     */
		select.setCallback = function(currentId, callback) {
			if (collection[currentId] !== 'undefined') {
				collection[currentId].callback = callback;
			}
		};
		/**
         * @ngdoc method
         * @name evtviewer.select.evtSelect#destroy
         * @methodOf evtviewer.select.evtSelect
         *
         * @description
         * Delete the reference of the instance of a particular <code>&lt;evt-select&gt;</code>
         * 
         * @param {string} tempId id of <code>&lt;evt-select&gt;</code> to destroy
         */
		select.destroy = function(tempId) {
			delete collection[tempId];
		};
		return select;
	};

});