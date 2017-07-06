angular.module('evtviewer.box')

.provider('evtBox', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	this.$get = function($log, $q, $timeout, config, parsedData, evtParser, evtCriticalParser, evtCriticalApparatusParser, xmlParser, evtInterface, evtImageTextLinking, evtNamedEntityRef, evtGenericEntity, evtApparatuses, evtSourcesApparatus) {
		var box = {},
			collection = {},
			list = [],
			idx = 0;

		var _console = $log.getInstance('box');
		//
		// Control function
		//
		var updateState = function(key, value) {
			// _console.log('vm - updating state '+key+': '+value);
			var vm = this;
			vm.state[key] = value;
			return vm.state[key];
		};

		var getState = function(key) {
			var vm = this;
			return vm.state[key];
		};

		var destroy = function() {
			var tempId = this.uid;
			// this.$destroy();
			delete collection[tempId];
			// _console.log('vm - destroy ' + tempId);
		};

		// Critical edition control
		// Critical App Filters look like this:
		// {
		//     resp : {
		//         any: false,
		//         name: "resp",
		//         totActive: 2,
		//         values: {
		//             0: "m1",
		//             1: "CDP", 
		//             CDP: {
		//                 active: true,
		//                 color: "rgb(253, 153, 54)",
		//                 name: "CDP"
		//             },
		//             m1: {
		//                 active: true,
		//                 color: "rgb(52, 197, 173)",
		//                 name: "m1"
		//             },
		//             length: 2
		//         }
		//     },
		//     _totActive: 2
		// }
		var toggleCriticalAppFilter = function(filter, value) {
			var vm = this,
				filters = vm.state.filters;
			if (filters[filter] === undefined) {
				filters[filter] = {
					name: filter,
					any: true,
					totActive: 0,
					values: {
						length: 0
					}
				};
			}
			if (filters[filter].totActive === undefined) {
				filters[filter].totActive = 0;
			}

			var values = filters[filter].values;
			if (values[value] === undefined) {
				values[values.length] = value;
				values[value] = {
					name: value,
					active: true,
					color: parsedData.getCriticalEntriesFilterColor(filter, value)
				};
				values.length++;
			} else {
				values[value].active = !values[value].active;
			}

			if (values[value].active) {
				filters[filter].totActive++;
				filters._totActive++;
			} else {
				filters[filter].totActive--;
				filters._totActive--;
			}

			filters[filter].any = (filters[filter].totActive === 0);
		};

		var clearFilter = function(filter) {
			var vm = this;
			vm.state.filters[filter].values = {
				length: 0
			};
			vm.state.filters._totActive -= vm.state.filters[filter].totActive;
			vm.state.filters[filter].totActive = 0;
		};


		var toggleTopBox = function() {
			var vm = this;
			if (vm.state.topBoxOpened !== undefined) {
				vm.state.topBoxOpened = !vm.state.topBoxOpened;
			}
		};

		var toggleFilterBox = function() {
			var vm = this;
			if (vm.state.filterBox !== undefined) {
				vm.state.filterBox = !vm.state.filterBox;
			}
		};

		var updateTopBoxContent = function(newContent) {
			var vm = this;
			vm.topBoxContent = newContent;
		};

		var fontSize = function() {
			var vm = this;
			return 'font-size:' + vm.state.fontSize + '%' || '';
		};

		var fontSizeIncrease = function() {
			var vm = this;
			vm.state.fontSize = parseInt(vm.state.fontSize) + 4;
		};

		var fontSizeDecrease = function() {
			var vm = this;
			vm.state.fontSize = parseInt(vm.state.fontSize) - 4;

		};

		var fontSizeReset = function() {
			var vm = this;
			vm.state.fontSize = '100';
		};

		var toggleBtnGroup = function(groupState) {
			groupState = !groupState;
		};

		var isITLactive = function() { //TEMP
			return evtInterface.getToolState('ITL') === 'active';
		};

		var getNamedEntitiesActiveTypes = function() {
			var activeNamedEntityTypes = evtNamedEntityRef.getActiveEntityTypes(),
				newClassValue = '';
			for (var i = 0; i < activeNamedEntityTypes.length; i++) {
				newClassValue += activeNamedEntityTypes[i] + '-active ';
			}
			return newClassValue;
		};

		var getAdditionalClass = function() {
			var vm = this;
			var classNames = '';
			if (vm.bottomMenuList.buttons.length === 0 && vm.bottomMenuList.selectors.length === 0) {
				classNames = 'noBottomMenu';
			}
			return classNames;
		}
		//
		// Box builder
		//
		box.build = function(scope, vm) {
			var currentId = vm.id || idx++,
				currentType = vm.type || 'default',
				topMenuList = {
					selectors: [],
					buttons: [],
					appLabels: []
				},
				bottomMenuList = {
					selectors: [],
					buttons: []
				},
				content,
				topBoxContent = '<span class="alert-msg">No info available</span>',
				state = {
					topBoxOpened: false,
					fontSizeBtn: false,
					fontSize: '100',
					topBoxContent: ''
				},
				appFilters = [],
				updateContent,
				isLoading = true;

			var genericTools = {
				fontSizeBtn: [{
					title: 'BUTTONS.FONT_RESET',
					label: '',
					icon: 'font-size-reset',
					type: 'fontSizeReset'
				}, {
					title: 'BUTTONS.FONT_DECREASE',
					label: '',
					icon: 'font-size-minus',
					type: 'fontSizeDecrease'
				}, {
					title: 'BUTTONS.FONT_INCREASE',
					label: '',
					icon: 'font-size-plus',
					type: 'fontSizeIncrease'
				}]
			};

			var scopeHelper = {};

			if (typeof(collection[currentId]) !== 'undefined') {
				return;
			}

			// _console.log('vm - building box for ' + currentId);
			var newContent;
			switch (currentType) {
				case 'image':
					topMenuList.selectors.push({
						id: 'page_' + currentId,
						type: 'page',
						initValue: evtInterface.getCurrentPage()
					});
					
					topMenuList.buttons.push({
						title: 'BUTTONS.THUMBNAILS',
						label: 'BUTTONS.THUMBS',
						icon: 'thumbnails',
						type: 'thumbs'
					});
					if (parsedData.isITLAvailable()) {
						topMenuList.buttons.push({
							title: 'BUTTONS.IMAGE_TEXT_LINKING',
							label: '',
							icon: 'itl',
							type: 'itl'
						});
					}

					updateContent = function() {
						scope.vm.isLoading = true;
						var currentPage = evtInterface.getCurrentPage(),
							currentPageObj = currentPage ? parsedData.getPage(currentPage) : undefined,
							pageSource = currentPageObj ? currentPageObj.source : '';
						pageSource = pageSource === '' ? 'data/images/' + currentPage + '.png' : pageSource;
						scope.vm.content = '<img src="' + pageSource + '" alt="Image of page ' + currentPage + ' of ' + evtInterface.getCurrentDocument() + '" onerror="this.setAttribute(\'src\', \'images/empty-image.jpg\')"/>';
						// TODO: Add translation for alt text
						// TEMP... TODO: creare direttiva per gestire le zone sull'immagine
						var zonesHTML = '',
							zones = parsedData.getZones();
						for (var zoneId in zones._indexes) {
							var zone = zones[zones._indexes[zoneId]];
							if (zone) {
								if (zone.page === currentPage) {
									zonesHTML += '<div class="zoneInImg" data-zone-id="' + zone.id + '" data-zone-name="' + zone.rendition + '"';
									if (zone.corresp && zone.corresp !== '') {
										var correspId = zone.corresp.replace('#', '');
										zonesHTML += ' data-corresp-id="' + correspId + '"';
										if (zone.rendition === 'Line') {
											zonesHTML += ' data-line="' + correspId + '"';
										} else if (zone.rendition === 'HotSpot') {
											zonesHTML += ' data-hs="' + correspId + '"';
										}
									}
									zonesHTML += '>' + zone.id + ' (' + zone.lrx + ', ' + zone.lry + ') (' + zone.ulx + ', ' + zone.uly + ') </div>';
								}
							}
						}
						scope.vm.content += zonesHTML;
						// =/ END TEMP
						scope.vm.isLoading = false;
					};
					break;
				case 'text':
					//TODO: Differentiate main text from second one
					if ((config.showDocumentSelector && parsedData.getDocuments()._indexes.length > 0) || parsedData.getDocuments()._indexes.length > 1) {
						topMenuList.selectors.push({
							id: 'document_' + currentId,
							type: 'document',
							initValue: evtInterface.getCurrentDocument()
						});
					};
					if (!parsedData.isCriticalEditionAvailable()) {
						topMenuList.selectors.push({
							id: 'page_' + currentId,
							type: 'page',
							initValue: evtInterface.getCurrentPage()
						});
					} else {
						topMenuList.buttons.push({
							title: 'BUTTONS.WITNESSES_LIST',
							label: '',
							icon: 'witnesses',
							type: 'witList'
						});
						if (evtInterface.getCurrentViewMode() === 'collation' && config.versions.length > 1 && Object.keys(parsedData.getVersionEntries()._indexes.versionWitMap > 0)) {
							/*if (scope.vm.version === undefined || scope.vm.version === '') {
							    evtInterface.updateCurrentVersion(config.versions[0]);
							    scope.vm.version = evtInterface.getCurrentVersion();
							}  */
							topMenuList.selectors.push({
								id: 'version_' + currentId,
								type: 'version',
								initValue: evtInterface.getCurrentVersion()
							});
						}
					}


					if ((config.showEditionLevelSelector && config.availableEditionLevel.length > 0) || config.availableEditionLevel.length > 1) {
						topMenuList.selectors.push({
							id: 'editionLevel_' + currentId,
							type: 'edition',
							initValue: evtInterface.getCurrentEdition()
						});
					}

					topMenuList.buttons.push({
						title: 'BUTTONS.INFO_ABOUT_TEXT',
						label: 'BUTTONS.INFO',
						icon: 'info-alt',
						type: 'front'
					});

					appFilters = parsedData.getCriticalEntriesFiltersCollection();
					if (appFilters.forLemmas > 0) {
						topMenuList.buttons.push({
							title: 'BUTTONS.COLOR_KEY',
							label: '',
							icon: 'color-legend',
							type: 'colorLegend'
						});
						bottomMenuList.buttons.push({
							title: 'BUTTONS.FILTERS',
							label: 'BUTTONS.FILTERS',
							icon: 'filters',
							type: 'toggleFilterApp',
							show: function() {
								return vm.edition === 'critical';
							}
						});
						appFilters = appFilters.filters;
					}

					if (config.namedEntitiesSelector) {
						//TODO: Check if there are Named Entities available in config.namedEntitiesToHandle
						bottomMenuList.selectors.push({
							id: 'namedEntities_' + currentId,
							type: 'named-entities',
							initValue: 'NONE',
							multiselect: true
						});
					}

					state.filters = {
						_totActive: 0
					};
					state.filterBox = false;
					state.docId = evtInterface.getCurrentDocument();
					if (config.toolHeatMap) {
						bottomMenuList.buttons.push({
							title: 'BUTTONS.HEAT_MAP',
							label: 'BUTTONS.HEAT_MAP',
							icon: 'heatmap',
							type: 'heatmap',
							show: function() {
								return vm.type === 'text' && vm.edition === 'critical';
							}
						});
					}
					bottomMenuList.buttons.push({
						title: 'BUTTONS.FONT_CHANGE',
						label: '',
						icon: 'font-size',
						type: 'fontSizeTools',
						show: function() {
							return true;
						}
					});

					updateContent = function() {
						scope.vm.isLoading = true;
						var newDoc,
							promises = [],
							isITLon = evtInterface.getToolState('ITL') === 'active',
							errorMsg = '<span class="alert-msg alert-msg-error">{{ \'MESSAGES.ERROR_IN_PARSING_TEXT\' | translate }} <br /> {{ \'MESSAGES.TRY_DIFFERENT_BROWSER_OR_CONTACT_DEVS\' | translate }}</span>',
							noTextAvailableMsg = '<span class="alert-msg alert-msg-error">{{ \'MESSAGES.TEXT_NOT_AVAILABLE\' | translate }}</span>';

						if (scope.vm.edition !== undefined && scope.vm.edition === 'critical' && (vm.version === '' || vm.version === undefined)) { // Critical edition
							newDoc = parsedData.getCriticalText(scope.vm.state.docId);
							if (newDoc === undefined) {
								newDoc = parsedData.getDocument(scope.vm.state.docId);
								try {
									if (config.versions.length > 2) {
										promises.push(evtCriticalParser.parseCriticalText(newDoc.content, scope.vm.state.docId, config.versions[0]).promise);
									} else {
										promises.push(evtCriticalParser.parseCriticalText(newDoc.content, scope.vm.state.docId).promise);
									}
									$q.all(promises).then(function() {
										scope.vm.content = parsedData.getCriticalText(scope.vm.state.docId) || noTextAvailableMsg;
										scope.vm.isLoading = false;
										$timeout(function() {
											evtGenericEntity.highlightActiveTypes();
										});
									});
								} catch (err) {
									_console.log(err);
									newContent = errorMsg;
									scope.vm.isLoading = false;
								}
							} else {
								scope.vm.content = newDoc || noTextAvailableMsg;
								scope.vm.isLoading = false;
								$timeout(function() {
									evtGenericEntity.highlightActiveTypes();
								});
							}
						} else if (scope.vm.edition !== undefined && scope.vm.edition === 'critical' && (scope.vm.version !== '' && scope.vm.version !== undefined)) {
							var currentDocId = evtInterface.getCurrentDocument();
							if (scope.vm.version === config.versions[0]) {
								newDoc = parsedData.getCriticalText(currentDocId) || undefined;
							} else {
								newDoc = parsedData.getVersionText(vm.version, currentDocId) || undefined;
							}
							if (newDoc === undefined) {
								newDoc = parsedData.getDocument(scope.vm.state.docId);
								try {
									promises.push(evtCriticalParser.parseCriticalText(newDoc.content, scope.vm.state.docId, scope.vm.version).promise);
									$q.all(promises).then(function() {
										if (config.versions[0] === scope.vm.version) {
											scope.vm.content = parsedData.getCriticalText(scope.vm.state.docId) || noTextAvailableMsg;
										} else {
											scope.vm.content = parsedData.getVersionText(vm.version, currentDocId) || noTextAvailableMsg;
										}
										scope.vm.isLoading = false;
									});
								} catch (err) {
									_console.log(err);
									newContent = errorMsg;
									scope.vm.isLoading = false;
								}
							} else {
								scope.vm.content = newDoc || noTextAvailableMsg;
								scope.vm.isLoading = false;
							}
						} else { // Other edition level
							// parsedData.getDocument(scope.vm.state.docId).content
							var currentPage = evtInterface.getCurrentPage(),
								currentDoc = evtInterface.getCurrentDocument(),
								currentEdition = evtInterface.getCurrentEdition();
							newDoc = parsedData.getPageText(currentPage, currentDoc, currentEdition);
							if (newDoc === undefined) {
								newDoc = parsedData.getPageText(currentPage, currentDoc, 'original');
								try {
									promises.push(evtParser.parseTextForEditionLevel(currentPage, currentDoc, currentEdition, newDoc).promise);
									$q.all(promises).then(function() {
										scope.vm.content = parsedData.getPageText(currentPage, currentDoc, currentEdition) || noTextAvailableMsg;
										scope.vm.isLoading = false;
										if (isITLon) {
											$timeout(function() {
												evtImageTextLinking.prepareLines();
												evtImageTextLinking.prepareZoneInImgInteractions();
											});
										}
										$timeout(function() {
											evtGenericEntity.highlightActiveTypes();
										});
									});
								} catch (err) {
									_console.log(err);
									newContent = errorMsg;
									scope.vm.isLoading = false;
								}
							} else {
								scope.vm.content = newDoc || noTextAvailableMsg;
								scope.vm.isLoading = false;
								if (isITLon) {
									$timeout(function() {
										evtImageTextLinking.prepareLines();
										evtImageTextLinking.prepareZoneInImgInteractions();
									});
								}
								$timeout(function() {
									evtGenericEntity.highlightActiveTypes();
								});
							}
							scope.vm.isLoading = false;
						}
					};
					break;
				case 'witness':
					var witPageId = vm.witPage !== undefined && vm.witPage !== '' ? vm.witness + '-' + vm.witPage : '';
					topMenuList.selectors.push({
						id: 'witnesses_' + currentId,
						type: 'witness',
						initValue: vm.witness
					}, {
						id: 'page_' + currentId,
						type: 'witness-page',
						initValue: witPageId
					});

					topMenuList.buttons.push({
						title: 'BUTTONS.INFO_ABOUT_TEXT',
						label: 'BUTTONS.INFO',
						icon: 'info-alt',
						type: 'toggleInfoWit'
					}, {
						title: 'BUTTONS.WITNESS_CLOSE',
						label: '',
						icon: 'remove',
						type: 'removeWit'
					});

					appFilters = parsedData.getCriticalEntriesFiltersCollection();
					if (appFilters.forVariants > 0) {
						bottomMenuList.buttons.push({
							title: 'BUTTONS.FILTERS',
							label: 'BUTTONS.FILTERS',
							icon: 'filters',
							type: 'toggleFilterApp',
							show: function() {
								return 'true';
							}
						});
						appFilters = appFilters.filters;
					}
					state.filters = {
						_totActive: 0
					};
					state.filterBox = false;

					bottomMenuList.buttons.push({
						title: 'BUTTONS.FONT_CHANGE',
						label: '',
						icon: 'font-size',
						type: 'fontSizeTools',
						show: function() {
							return true;
						}
					});
					updateContent = function() {
						scope.vm.isLoading = true;
						var errorMsg = '<span class="alert-msg alert-msg-error">{{ \'MESSAGES.ERROR_IN_PARSING_TEXT\' | translate }} <br /> {{ \'MESSAGES.TRY_DIFFERENT_BROWSER_OR_CONTACT_DEVS\' | translate }}</span>',
							noTextAvailableMsg = '<span class="alert-msg alert-msg-error">{{ \'MESSAGES.TEXT_OF_WITNESS_NOT_AVAILABLE\' | translate:\'{ witness:  "'+vm.witness+'" }\' }}</span>';

						if (vm.witness !== undefined) {
							// Main content
							var currentDocId = evtInterface.getCurrentDocument(),
								newContent = parsedData.getWitnessText(vm.witness, currentDocId) || undefined;
							if (newContent === undefined) {
								var documents = parsedData.getDocuments(),
									currentDoc = '';
								if (documents._indexes.length > 0) {
									currentDoc = documents[currentDocId];
								}
								if (currentDoc !== undefined) {
									try {
										var promises = [];
										promises.push(evtCriticalParser.parseWitnessText(currentDoc.content, currentDocId, vm.witness).promise);
										$q.all(promises).then(function() {
											scope.vm.content = parsedData.getWitnessText(vm.witness, currentDocId) || noTextAvailableMsg;
											scope.vm.isLoading = false;
										});
									} catch (err) {
										_console.log(err);
										scope.vm.content = errorMsg;
										scope.vm.isLoading = false;
									}
								} else {
									scope.vm.content = noTextAvailableMsg;
									scope.vm.isLoading = false;
								}
							} else {
								scope.vm.content = newContent;
								scope.vm.isLoading = false;
							}
						}
					};
					break;
					/**************** */
					/*Case apparatuses*/
					/************************************************************ */
					/*It creates the labels for every type of apparatus available.*/
					/*It updates the currentApparatus inside of Interface.        */
					/*Then it loads the apparatuses directive. | @author --> CM   */
					/************************************************************ */
				case 'apparatuses':
					isLoading = true;
					var appList = parsedData.getCriticalEntries()._indexes.encodingStructure,
						quotesList = parsedData.getQuotes()._indexes.encodingStructure,
						analoguesList = parsedData.getAnalogues()._indexes.encodingStructure;

					if (!evtInterface.isCriticalApparatusInline() && appList.length > 0) {
						topMenuList.appLabels.push({
							label: 'APPARATUSES.CRITICAL_APPARATUS',
							id: 'criticalApparatus'
						});
					}
					if (!evtInterface.isSourcesInline() && quotesList.length > 0) {
						topMenuList.appLabels.push({
							label: 'APPARATUSES.SOURCES',
							id: 'sources'
						});
					}
					if (!evtInterface.isAnaloguesInline() && analoguesList.length > 0) {
						topMenuList.appLabels.push({
							label: 'APPARATUSES.ANALOGUES',
							id: 'analogues'
						});
					}
					//method to get the currentApparatus inside of Interface, to initialize or change the apparatuses directive
					vm.getCurrentApparatus = function() {
						return evtInterface.getCurrentApparatus();
					};
					//method to update the current apparatus inside of interface
					vm.updateApparatus = function(app) {
						evtApparatuses.setCurrentApparatus(app);
					};
					//The updateContent function loads the evt-apparatuses directive
					updateContent = function() {
						scope.vm.content = '<evt-apparatuses data-current-apparatus="{{vm.getCurrentApparatus()}}"></evt-apparatuses>';
					};
					isLoading = false;
					break;
					/*************/
					/*Case source*/
					/****************************************************************************/
					/* It loads the parsed text of the current source text. Available a selector*/
					/* to choose the source to show, a button for bibliographic reference and a */
					/* button to change font size. | @author --> CM                             */
					/****************************************************************************/
				case 'source':
					topMenuList.selectors.push({
						id: 'sources_' + currentId,
						type: 'source',
						initValue: evtInterface.getCurrentSourceText()
					});
					topMenuList.buttons.push({
						title: 'BUTTONS.BIBLIOGRAPHIC_REF',
						label: '',
						icon: 'info',
						type: 'toggleInfoSrc'
					});

					bottomMenuList.buttons.push({
						title: 'BUTTONS.FONT_CHANGE',
						label: '',
						icon: 'font-size',
						type: 'fontSizeTools',
						show: function() {
							return true;
						}
					});

					updateContent = function() {
						scope.vm.isLoading = true;
						var errorMsg = '<span class="alert-msg alert-msg-error">{{ \'MESSAGES.ERROR_IN_PARSING_TEXT\' | translate }} <br /> {{ \'MESSAGES.TRY_DIFFERENT_BROWSER_OR_CONTACT_DEVS\' | translate }}</span>',
							noTextAvailableMsg = '<span class="alert-msg alert-msg-error">{{ \'MESSAGES.TEXT_OF_SOURCE_NOT_AVAILABLE\' | translate:\'{ source:  "'+scope.vm.source+'" }\' }}</span>';

						// Main content
						var sourceObj = parsedData.getSource(scope.vm.source),
							newContent = sourceObj ? sourceObj.text : undefined;

						if (!sourceObj || Object.keys(sourceObj.text).length === 0 || newContent === undefined) {

							var sourceDoc = parsedData.getSourceDocument(scope.vm.source);

							if (sourceDoc !== undefined) {
								try {
									var promises = [];
									promises.push(evtCriticalParser.parseSourceText(sourceDoc.content, scope.vm.source).promise);
									$q.all(promises).then(function() {
										scope.vm.content = parsedData.getSource(scope.vm.source).text || noTextAvailableMsg;
										scope.vm.isLoading = false;
									});
									var sourceBibl = evtSourcesApparatus.getSource(parsedData.getSource(evtInterface.getCurrentSourceText()));
									updateTopBoxContent(sourceBibl);
								} catch (err) {
									_console.log(err);
									scope.vm.content = errorMsg;
									scope.vm.isLoading = false;
								}
							} else {
								scope.vm.content = errorMsg;
								scope.vm.isLoading = false;
							}

						} else {
							scope.vm.content = newContent;
							scope.vm.isLoading = false;
						}
					};
					break;
					/**************/
					/*Case version*/
					/*********************************************************************/
					/* It loads the parsed texts of the main text different versions.    */
					/* There are a selector to choose the version, a button to remove    */
					/* the version and a button to handle the font size. | @author --> CM*/
					/*********************************************************************/
				case 'version':
					var versionId = parsedData.getVersionEntries()._indexes.versionId[vm.version];
					topMenuList.selectors.push({
						id: 'version_' + currentId,
						type: 'version',
						initValue: vm.version
					});
					if (evtInterface.getAllVersionsNumber() > 2) {
						topMenuList.buttons.push({
							title: 'BUTTONS.VERSION_CLOSE',
							label: '',
							icon: 'remove',
							type: 'removeVer'
						});
					}
					bottomMenuList.buttons.push({
						title: 'BUTTONS.FONT_CHANGE',
						label: '',
						icon: 'font-size',
						type: 'fontSizeTools',
						show: function() {
							return true;
						}
					});

					updateContent = function() {
						scope.vm.isLoading = true;
						var errorMsg = '<span class="alert-msg alert-msg-error">{{ \'MESSAGES.ERROR_IN_PARSING_TEXT\' | translate }} <br /> {{ \'MESSAGES.TRY_DIFFERENT_BROWSER_OR_CONTACT_DEVS\' | translate }}</span>',
							noTextAvailableMsg = '<span class="alert-msg alert-msg-error">{{ \'MESSAGES.TEXT_OF_VERSION_NOT_AVAILABLE\' | translate:\'{ version:  "'+vm.version+'" }\' }}</span>';

						if (vm.version !== undefined) {
							var currentDocId = evtInterface.getCurrentDocument(),
								newContent = parsedData.getVersionText(vm.version, currentDocId) || undefined;
							if (newContent === undefined) {
								var documents = parsedData.getDocuments(),
									currentDoc = '';
								if (documents._indexes.length > 0) {
									currentDoc = documents[currentDocId];
								}
								if (currentDoc !== undefined) {
									try {
										var promises = [];
										promises.push(evtCriticalParser.parseCriticalText(currentDoc.content, currentDocId, vm.version).promise);
										$q.all(promises).then(function() {
											scope.vm.content = parsedData.getVersionText(vm.version, currentDocId) || noTextAvailableMsg;
											scope.vm.isLoading = false;
										});
									} catch (err) {
										_console.log(err);
										scope.vm.content = errorMsg;
										scope.vm.isLoading = false;
									}
								} else {
									scope.vm.content = noTextAvailableMsg;
									scope.vm.isLoading = false;
								}
							} else {
								scope.vm.content = newContent;
								scope.vm.isLoading = false;
							}
						}
					};
					break;
				default:
					isLoading = false;
					if (currentType === 'pinnedBoard') {
						topMenuList.buttons.push({
							title: 'BUTTONS.BOARD_CLOSE',
							label: '',
							icon: 'remove',
							type: 'closePinned'
						});
						if (config.toolPinAppEntries) {
							bottomMenuList.selectors.push({
								id: 'pinnedFilter_' + currentId,
								type: 'pinned-filter',
								initValue: 'NONE',
								multiselect: true
							});
						}
					} else {
						topMenuList.buttons.push({
							title: 'BUTTONS.BOX_CLOSE',
							label: '',
							icon: 'remove',
							type: 'removeBox'
						});
					}
					updateContent = function(newContent) {
						scope.vm.content = newContent;
					};
					break;
			}

			scopeHelper = {
				// expansion
				uid: currentId,
				defaults: angular.copy(defaults),

				// model
				topMenuList: topMenuList,
				bottomMenuList: bottomMenuList,
				content: content,
				topBoxContent: topBoxContent,
				state: state,
				appFilters: appFilters,
				isLoading: isLoading,
				genericTools: genericTools,

				// function
				updateContent: updateContent,
				updateTopBoxContent: updateTopBoxContent,
				updateState: updateState,
				getState: getState,
				destroy: destroy,
				toggleCriticalAppFilter: toggleCriticalAppFilter,
				toggleFilterBox: toggleFilterBox,
				toggleTopBox: toggleTopBox,
				clearFilter: clearFilter,
				fontSize: fontSize,
				fontSizeIncrease: fontSizeIncrease,
				fontSizeDecrease: fontSizeDecrease,
				fontSizeReset: fontSizeReset,
				toggleBtnGroup: toggleBtnGroup,
				getNamedEntitiesActiveTypes: getNamedEntitiesActiveTypes,
				getAdditionalClass: getAdditionalClass,

				isITLactive: isITLactive //TEMP
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
		box.getById = function(currentId) {
			if (collection[currentId] !== 'undefined') {
				return collection[currentId];
			}
		};

		box.getList = function() {
			return list;
		};

		box.getListByType = function(type) {
			var listType = [];
			for (var i in collection) {
				if (collection[i].type === type) {
					listType.push(collection[i]);
				}
			}
			return listType;
		};

		box.getElementByValueOfParameter = function(parameter, value) {
			var element;
			for (var i in collection) {
				if (collection[i][parameter] === value) {
					element = collection[i];
				}
			}
			return element;
		};

		box.alignScrollToApp = function(appId) {
			for (var i in collection) {
				if (collection[i].scrollToAppEntry !== undefined) {
					collection[i].scrollToAppEntry(appId);
				}
			}
		};

		/*Methods added by CM*/
		/*For the alignment of the apparatuses panel, with the other boxes*/
		box.alignScrollToQuote = function(quoteId, segId) {
			for (var i in collection) {
				if (collection[i].scrollToQuotesEntry !== undefined) {
					if (collection[i].type === 'source') {
						collection[i].scrollToQuotesEntry(segId);
					} else {
						collection[i].scrollToQuotesEntry(quoteId);
					}
				}
			}
		};

		box.alignScrollToAnalogue = function(analogueId) {
			for (var i in collection) {
				if (collection[i].scrollToAnaloguesEntry !== undefined) {
					collection[i].scrollToAnaloguesEntry(analogueId);
				}
			}
		};

		return box;
	};

});