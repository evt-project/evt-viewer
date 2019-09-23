/**
 * @ngdoc service
 * @module evtviewer.box
 * @name evtviewer.box.evtBox
 * @description
 * # evtBox
 * This provider expands the scope of the
 * {@link evtviewer.box.directive:box box} directive
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires $log
 * @requires $q
 * @requires $timeout
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtParser
 * @requires evtviewer.dataHandler.evtCriticalParser
 * @requires evtviewer.dataHandler.evtCriticalApparatusParser
 * @requires evtviewer.dataHandler.xmlParser
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.UItools.evtImageTextLinking
 * @requires evtviewer.namedEntity.evtNamedEntityRef
 * @requires evtviewer.namedEntity.evtGenericEntity
 * @requires evtviewer.apparatuses.evtApparatuses
 * @requires evtviewer.dataHandler.evtSourcesApparatus
 **/
angular.module('evtviewer.box')

.provider('evtBox', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	/**
	 * @ngdoc object
	 * @module evtviewer.box
	 * @name evtviewer.box.controller:BoxCtrl
	 * @description
	 * # BoxCtrl
	 * <p>This is controller for the {@link evtviewer.box.directive:box box} directive. </p>
	 * <p>It is not actually implemented separately but its methods are defined in the
	 * {@link evtviewer.box.evtBox evtBox} provider
	 * where the scope of the directive is extended with all the necessary properties and methods
	 * according to specific values of initial scope properties.</p>
	 **/
	this.$get = function($log, $q, $timeout, config, parsedData, evtParser, evtCriticalParser, evtCriticalApparatusParser, xmlParser, evtInterface, evtImageTextLinking, evtNamedEntityRef, evtGenericEntity, evtApparatuses, evtSourcesApparatus) {
		var box = {},
			collection = {},
			list = [],
			idx = 0;

		var _console = $log.getInstance('box');
		//
		// Control function
		//
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#updateState
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Update a property of the box state.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file.</p>
		 *
		 * @param {string} key key to update
		 * @param {any} value new value
		 *
		 * @returns {any} reference to new updated state property
	     */
		var updateState = function(key, value) {
			var vm = this;
			vm.state[key] = value;
			return vm.state[key];
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#getState
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Retrieve a property of the box state.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file.</p>
		 *
		 * @param {string} key key of property to retrieve
		 *
		 * @returns {any} reference to state property
	     */
		var getState = function(key) {
			var vm = this;
			return vm.state[key];
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#destroy
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Remove instance from saved instances in {@link evtviewer.box.evtBox evtBox} provider.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file.</p>
	     */
		var destroy = function() {
			var tempId = this.uid;
			// this.$destroy();
			delete collection[tempId];
			// _console.log('vm - destroy ' + tempId);
		};

		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#toggleCriticalAppFilter
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Toggle a certain filter on critical apparatus entries.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file, and will be acatually used only when
		 * box is of type **text** or **witness**.</p>
		 * <p>The internal properties in which active filters are stored is structure as follows:
			<pre>
				var filters = {
				    resp : {
				        any: false,
				        name: "resp",
				        totActive: 2,
				        values: {
				            0: "m1",
				            1: "CDP",
				            CDP: {
				                active: true,
				                color: "rgb(253, 153, 54)",
				                name: "CDP"
				            },
				            m1: {
				                active: true,
				                color: "rgb(52, 197, 173)",
				                name: "m1"
				            },
				            length: 2
				        }
				    },
				    _totActive: 2
				};
			</pre></p>
		 * @param {string} filter name of filter to toggle
		 * @param {string} value value of filter to toggle
	     */
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
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#clearFilter
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Clear all selecter values referring to a certain filter on critical apparatus entries.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file, and will be acatually used only when
		 * box is of type **text** or **witness**.</p>
		 * <p>The internal properties in which active filters are stored is structure as follows:
			<pre>
				var filters = {
				    resp : {
				        any: false,
				        name: "resp",
				        totActive: 2,
				        values: {
				            0: "m1",
				            1: "CDP",
				            CDP: {
				                active: true,
				                color: "rgb(253, 153, 54)",
				                name: "CDP"
				            },
				            m1: {
				                active: true,
				                color: "rgb(52, 197, 173)",
				                name: "m1"
				            },
				            length: 2
				        }
				    },
				    _totActive: 2
				};
			</pre></p>
		 * @param {string} filter name of filter to clear
	     */
		var clearFilter = function(filter) {
			var vm = this;
			vm.state.filters[filter].values = {
				length: 0
			};
			vm.state.filters._totActive -= vm.state.filters[filter].totActive;
			vm.state.filters[filter].totActive = 0;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#toggleTopBox
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>TOpen/close the Top Box, usually used to store secondary
	     * contents like header information about the shown text.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file.</p>
	     */
		var toggleTopBox = function() {
			var vm = this;
			if (vm.state.topBoxOpened !== undefined) {
				vm.state.topBoxOpened = !vm.state.topBoxOpened;
			}
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#toggleFilterBox
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Open/close the Box containing critical apparatus entries filters.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file, and will be acatually used only when
		 * box is of type **text** or **witness**.</p>
	     */
		var toggleFilterBox = function() {
			var vm = this;
			if (vm.state.filterBox !== undefined) {
				vm.state.filterBox = !vm.state.filterBox;
			}
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#updateTopBoxContent
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Update the content to be shown in Top Box.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file.</p>
		 *
		 * @param {string} newContent string representing the HTML of new content to be shown in Top Box
	     */
		var updateTopBoxContent = function(newContent) {
			var vm = this;
			vm.topBoxContent = newContent;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#fontSize
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Get CSS rule for current font size.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file.</p>
		 *
		 * @returns {string} CSS rule for current font size
	     */
		var fontSize = function() {
			var vm = this;
			return 'font-size:' + vm.state.fontSize + '%' || '';
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#fontSizeIncrease
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Increase font size.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file.</p>
	     */
		var fontSizeIncrease = function() {
			var vm = this;
			vm.state.fontSize = parseInt(vm.state.fontSize) + 4;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#fontSizeDecrease
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Decrease font size.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file.</p>
	     */
		var fontSizeDecrease = function() {
			var vm = this;
			vm.state.fontSize = parseInt(vm.state.fontSize) - 4;

		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#fontSizeReset
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Reset default font size.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file.</p>
	     */
		var fontSizeReset = function() {
			var vm = this;
			vm.state.fontSize = '100';
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#isITLactive
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Check if Image Text Linking UI Tool is active.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file.</p>
		 *
		 * @returns {boolean} whether the ITL UI Tool is active or not
	     */
		var isITLactive = function() { //TEMP
			return evtInterface.getToolState('ITL') === 'active';
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#getNamedEntitiesActiveTypes
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Get (Named) Entities active types.</p>
	     * <p>The names of active types will be set as class name of box body contentainer with
	     * the suffix <code>-active</code> and will be used in CSS stylesheets to highlight
	     * (named) entities occurrences of the specific selected type.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file.</p>
		 *
		 * @returns {string} names of active (named) entities
	     */
		var getNamedEntitiesActiveTypes = function() {
			var activeNamedEntityTypes = evtNamedEntityRef.getActiveEntityTypes(),
				newClassValue = '';
			for (var i = 0; i < activeNamedEntityTypes.length; i++) {
				newClassValue += activeNamedEntityTypes[i] + '-active ';
			}
			return newClassValue;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.controller:BoxCtrl#getAdditionalClass
	     * @methodOf evtviewer.box.controller:BoxCtrl
	     *
	     * @description
	     * <p>Get additional class names to be added to box-body container.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.box.evtBox evtBox} provider file.</p>
		 *
		 * @returns {string} class names to be added
	     */
		var getAdditionalClass = function() {
			var vm = this;
			var classNames = '';
			if (vm.bottomMenuList.buttons.length === 0 && vm.bottomMenuList.selectors.length === 0) {
				classNames = 'noBottomMenu';
			}
			return classNames;
		};
		//
		// Box builder
		//
		/**
	     * @ngdoc method
	     * @name evtviewer.box.evtBox#build
	     * @methodOf evtviewer.box.evtBox
	     *
	     * @description
	     * <p>This method will extend the scope of {@link evtviewer.box.directive:box box} directive
	     * according to selected configurations and parsed data.</p>
	     * <p>According to <code>type</code> it will set the buttons and selectors to be shown in header and footer
	     * and define the function to be used when the main content should be updated.</p>
		 *
		 * @param {Object} scope initial scope of the directive:
		 	<pre>
				var scope: {
		            id : '@',
		            type : '@',
		            subtype : '@',
		            witness : '@',
		            witpage : '@',
		            edition : '@',
		            source : '@',
		            version : '@'
		        };
		 	</pre>
		 *
		 * @returns {Object} extended scope:
		 	<pre>
				var scopeHelper = {
					// expansion
					uid,
					defaults,

					// model
					topMenuList,
					bottomMenuList,
					content,
					topBoxContent,
					state,
					appFilters,
					isLoading,
					genericTools,

					// function
					updateContent,
					updateTopBoxContent,
					updateState,
					getState,
					destroy,
					toggleCriticalAppFilter,
					toggleFilterBox,
					toggleTopBox,
					clearFilter,
					fontSize,
					fontSizeIncrease,
					fontSizeDecrease,
					fontSizeReset,
					getNamedEntitiesActiveTypes,
					getAdditionalClass,

					isITLactive
				};
		 	</pre>
	     */
		box.build = function(scope, vm) {
			var currentId = vm.id || idx++,
				currentType = vm.type || 'default',
            currentEdition = vm.edition,
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
					topBoxContent: '',
               searchBox: false
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
			var osdTools = {
				osdBtn: [{
					title: 'BUTTONS.ZOOM-RESET',
					label: '',
					icon: 'zoom-reset',
					type: 'zoomReset'
				}, {
					title: 'BUTTONS.ZOOM-OUT',
					label: '',
					icon: 'zoom-out',
					type: 'zoomOut'
				}, {
					title: 'BUTTONS.ZOOM-IN',
					label: '',
					icon: 'zoom-in',
					type: 'zoomIn'
				}]
			};

			var scopeHelper = {};

			if (typeof(collection[currentId]) !== 'undefined') {
				return;
			}

			// _console.log('vm - building box for ' + currentId);
			/**
		     * @ngdoc method
		     * @name evtviewer.box.controller:BoxCtrl#updateContent
		     * @methodOf evtviewer.box.controller:BoxCtrl
		     *
		     * @description
		     * <p>Update the content of the box.</p>
		     * <p>This method will differ from a box instance to another,
		     * depending on its type.: <ul>
			 * <li>If '*image*' it will change the image shown, and prepare the zones for the eventual Image-Text linking tool.</li>
			 * <li>If '*text*' it will change the text shown, depending on current edition level.
			 * If the text is not yet available it will parse it and save it in {@link evtviewer.dataHandler.parsedData parsedData}
			 * for future retrievements. After the new text is set it will eventually prepare the text for the correct
			 * functioning of tools like Image-Text Linking, Highlight of Named Entities, etc.</li>
			 * <li>if '*witness*' it will change the text shown, depending on the scope witness.
			 * * If the text is not yet available it will parse it and save it in {@link evtviewer.dataHandler.parsedData parsedData}
			 * for future retrievements.</li>
			 * <li>if '*source*' it will change the text shown, depending on the scope source.
			 * * If the text is not yet available it will parse it and save it in {@link evtviewer.dataHandler.parsedData parsedData}
			 * for future retrievements.</li>
			 * <li>if '*version*' it will change the text shown, depending on the scope version.
			 * * If the text is not yet available it will parse it and save it in {@link evtviewer.dataHandler.parsedData parsedData}
			 * for future retrievements.</li>
			 * <li>otherwise it will set as new content, the one that is passed as method parameter.</li>
			 * </ul></p>
			 * <p>For more details we suggest to see the implementation itself.</p>
			 * <p>This method is defined and attached to controller scope in the
			 * {@link evtviewer.box.evtBox evtBox} provider file.</p>
			 *
			 * @param {string} newContent HTML string representing the new content to be shown in the box.
			 * This will not be necessary for instances of box with type equal to "image", "text", "witness", "source" and "version".
			 * @returns {string} class names to be added
		     */
			var newContent;
			switch (currentType) {
				case 'image':
					topMenuList.selectors.push({
						id: 'page_' + currentId,
						type: 'page',
						initValue: evtInterface.getState('currentPage')
					});
   // Commented because related to the thumbnail button not working
					/*topMenuList.buttons.push({
						title: 'BUTTONS.THUMBNAILS',
						label: 'BUTTONS.THUMBS',
						icon: 'thumbnails',
						type: 'thumbs'
               });*/
   // Commented because related to the schema button not working
					/*topMenuList.buttons.push({
						title: 'BUTTONS.SCHEMA',
						label: 'BUTTONS.SCHEMA',
						icon: 'schema',
						type: 'schema'
					});*/
					if (parsedData.isITLAvailable()) {
						topMenuList.buttons.push({
							title: 'BUTTONS.IMAGE_TEXT_LINKING',
							label: '',
							icon: 'itl',
							type: 'itl'
						});
						topMenuList.buttons.push({
							title: 'BUTTONS.HOTSPOTS',
							label: '',
							icon: 'hts',
							type: 'hts'
						});
					}
					topMenuList.buttons.push({
						title: 'BUTTONS.MS',
						label: 'BUTTONS.MSD',
						type: 'msDesc'
					});


               updateContent = function() {
                  scope.vm.isLoading = true;
                  var currentPage = evtInterface.getState('currentPage'),
                     currentPageObj = currentPage ? parsedData.getPage(currentPage) : undefined,
                     pageSource = currentPageObj ? currentPageObj.source : '';
                  pageSource = pageSource === '' ? config.singleImagesUrl + currentPage + '.jpg' : pageSource;
                  scope.vm.content = '<img src="' + pageSource + '" alt="Image of page ' + currentPage + ' of ' + evtInterface.getState('currentDoc') + '" onerror="this.setAttribute(\'src\', \'images/fol_214v.jpg\')"/>';
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
               if(currentId === 'mainText' || currentId === 'mainText1') {
                  bottomMenuList.buttons.push({
                     title: 'Search',
                     label: 'Search',
                     icon: 'search',
                     type: 'searchInternal',
                     show: function() {
                        return true;
                     },
                     disabled: function() {
                        return true;
                     }
                  });
                  bottomMenuList.buttons.push({
                     title: 'Create index for enable search',
                     label: 'Create index',
                     icon: '',
                     type: 'searchIndex',
                     show: function() {
                        return true;
                     }
                  });
               }
               else {
                  bottomMenuList.buttons.push({
                     title: 'Search',
                     label: 'Search',
                     icon: 'search',
                     type: 'searchInternal',
                     show: function() {
                        return true;
                     },
                     disabled: function() {
                        return true;
                     }
                  });
               }

					if ((config.showDocumentSelector && parsedData.getDocuments()._indexes.length > 0) || parsedData.getDocuments()._indexes.length > 1) {
						topMenuList.selectors.push({
							id: 'document_' + currentId,
							type: 'document',
							initValue: evtInterface.getState('currentDoc')
						});
					}
					if (!parsedData.isCriticalEditionAvailable()) {
						topMenuList.selectors.push({
							id: 'page_' + currentId,
							type: 'page',
							initValue: evtInterface.getState('currentPage')
						});
					} else {
						if (parsedData.getDivs().length > 0) {
							var docId = evtInterface.getState('currentDocument');
							var currentDiv = docId ? evtInterface.getState('currentDivs')[docId] || parsedData.getDocument(docId).divs.find(function(id) { return parsedData.getDiv(id).section === 'body'})
							: parsedData.getDocument(parsedData.getDocuments()._indexes[0]).divs.find(function(id) { return parsedData.getDiv(id).section === 'body'});
							if (currentDiv) {
								topMenuList.selectors.push({
									id: 'div_' + currentId,
									type: 'div',
									initValue: currentDiv
								});
							}
						}
						topMenuList.buttons.push({
							title: 'BUTTONS.WITNESSES_LIST',
							label: '',
							icon: 'witnesses',
							type: 'witList'
						});
						if (evtInterface.getState('currentViewMode') === 'collation' && config.versions.length > 1 && Object.keys(parsedData.getVersionEntries()._indexes.versionWitMap > 0)) {
							// if (scope.vm.version === undefined || scope.vm.version === '') {
							//     evtInterface.updateCurrentVersion(config.versions[0]);
							//     scope.vm.version = evtInterface.getState('currentVersion');
							// }
							topMenuList.selectors.push({
								id: 'version_' + currentId,
								type: 'version',
								initValue: evtInterface.getState('currentVersion')
							});
						}
					}


					if ((config.showEditionLevelSelector && config.availableEditionLevel.length > 0) || config.availableEditionLevel.length > 1) {
						if (scope.subtype === 'comparing') {
							topMenuList.selectors.push({
								id: 'comparingEditionLevel_' + currentId,
								type: 'comparingEdition',
								initValue: evtInterface.getState('currentComparingEdition')
							});
						} else {
							topMenuList.selectors.push({
								id: 'editionLevel_' + currentId,
								type: 'edition',
								initValue: evtInterface.getState('currentEdition')
							});
						}
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
					state.docId = evtInterface.getState('currentDoc');
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
						if (scope.vm.edition && scope.vm.edition === 'critical' && !vm.version) { // Critical edition
							newDoc = parsedData.getCriticalText(scope.vm.state.docId);
							if (!newDoc) {
								newDoc = parsedData.getDocument(scope.vm.state.docId);

								if (newDoc !== undefined) {
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
								}
							} else {
								scope.vm.content = newDoc || noTextAvailableMsg;
								scope.vm.isLoading = false;
								$timeout(function() {
									evtGenericEntity.highlightActiveTypes();
								});
							}
						} else if (scope.vm.edition && scope.vm.edition === 'critical' && scope.vm.version) {
							var currentDocId = evtInterface.getState('currentDoc');
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
							var currentPage = evtInterface.getState('currentPage'),
								currentDoc = evtInterface.getState('currentDoc'),
								currentEdition = scope.subtype === 'comparing' ? evtInterface.getState('currentComparingEdition') : evtInterface.getState('currentEdition');
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

					if (parsedData.getDivs().length > 0) {
						var docId = evtInterface.getState('currentDocument');
						var currentDiv = docId ? evtInterface.getState('currentDivs')[docId] || parsedData.getDocument(docId).divs.find(function(id) { return parsedData.getDiv(id).section === 'body'})
						: parsedData.getDocument(parsedData.getDocuments()._indexes[0]).divs.find(function(id) { return parsedData.getDiv(id).section === 'body'});
						if (currentDiv) {
							topMenuList.selectors.push({
								id: 'div_' + currentId + '_' + vm.witness,
								type: 'div',
								initValue: currentDiv
							});
						}
					}

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
							noTextAvailableMsg = '<span class="alert-msg alert-msg-error">{{ \'MESSAGES.TEXT_OF_WITNESS_NOT_AVAILABLE\' | translate:\'{ witness:  "' + vm.witness + '" }\' }}</span>';

						if (vm.witness !== undefined) {
							// Main content
							var currentDocId = evtInterface.getState('currentDoc'),
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
					// /////////// //
					// Case source //
					// ////////////////////////////////////////////////////////////////////////////
					// It loads the parsed text of the current source text. Available a selector //
					// to choose the source to show, a button for bibliographic reference and a  //
					// button to change font size. | author --> CM                               //
					// ////////////////////////////////////////////////////////////////////////////
				case 'source':
					topMenuList.selectors.push({
						id: 'sources_' + currentId,
						type: 'source',
						initValue: evtInterface.getState('currentSourceText')
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
							noTextAvailableMsg = '<span class="alert-msg alert-msg-error">{{ \'MESSAGES.TEXT_OF_SOURCE_NOT_AVAILABLE\' | translate:\'{ source:  "' + scope.vm.source + '" }\' }}</span>';

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
									var sourceBibl = evtSourcesApparatus.getSource(parsedData.getSource(evtInterface.getState('currentSourceText')));
									if (sourceBibl) { updateTopBoxContent(sourceBibl); }
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
				// //////////// //
				// Case version //
				// /////////////////////////////////////////////////////////////////////
				// It loads the parsed texts of the main text different versions.     //
				// There are a selector to choose the version, a button to remove     //
				// the version and a button to handle the font size. | author --> CM //
				// /////////////////////////////////////////////////////////////////////
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
							noTextAvailableMsg = '<span class="alert-msg alert-msg-error">{{ \'MESSAGES.TEXT_OF_VERSION_NOT_AVAILABLE\' | translate:\'{ version:  "' + vm.version + '" }\' }}</span>';

						if (vm.version !== undefined) {
							var currentDocId = evtInterface.getState('currentDoc'),
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
            currentEdition: currentEdition,
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
				osdTools: osdTools,

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
		/**
	     * @ngdoc method
	     * @name evtviewer.box.evtBox#getById
	     * @methodOf evtviewer.box.evtBox
	     *
	     * @description
	     * Get the reference of the instance of a particular <code>&lt;box&gt;</code>.
		 *
		 * @param {string} currentId id of box to retrieve
		 *
		 * @returns {Object} reference of the instance of <code>&lt;box&gt;</code> with given id
	     */
		box.getById = function(currentId) {
			if (collection[currentId] !== 'undefined') {
				return collection[currentId];
			}
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.evtBox#getList
	     * @methodOf evtviewer.box.evtBox
	     *
	     * @description
	     * Get the list of all the instance of <code>&lt;box&gt;</code>.
		 *
		 * @returns {array} array of ids of all the instance of <code>&lt;box&gt;</code>.
	     */
		box.getList = function() {
			return list;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.evtBox#getListByType
	     * @methodOf evtviewer.box.evtBox
	     *
	     * @description
	     * Get the references of the instance of a all <code>&lt;box&gt;</code>s of a particular type.
		 *
		 * @param {string} type type of boxes to retrieve
		 *
		 * @returns {array} array of references of the instance of <code>&lt;box&gt;</code>s of given type
	     */
		box.getListByType = function(type) {
			var listType = [];
			for (var i in collection) {
				if (collection[i].type === type) {
					listType.push(collection[i]);
				}
			}
			return listType;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.evtBox#getElementByValueOfParameter
	     * @methodOf evtviewer.box.evtBox
	     *
	     * @description
	     * Get the references of the instance of the <code>&lt;box&gt;</code> that present a particular property
	     * with a particular value
		 *
		 * @param {string} parameter property that box should have
		 * @param {string} value value of property that box should have
		 *
		 * @returns {array} array of references of requested <code>&lt;box&gt;</code>
	     */
		box.getElementByValueOfParameter = function(parameter, value) {
			var element;
			for (var i in collection) {
				if (collection[i][parameter] === value) {
					element = collection[i];
				}
			}
			return element;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.evtBox#alignScrollToApp
	     * @methodOf evtviewer.box.evtBox
	     *
	     * @description
	     * <p>Align box body container of all box instances to a particular critical apparatus entry.</p>
		 * <p>For each box reference, the provider will trigger the function
		 * {@link evtviewer.box.controller:BoxCtrl#scrollToAppEntry} of controller.</p>
		 *
		 * @param {string} appId critical apparatus entry to consider during alignment
		 *
		 * @author CDP
	     */
		box.alignScrollToApp = function(appId) {
			for (var i in collection) {
				if (collection[i].scrollToAppEntry !== undefined) {
					collection[i].scrollToAppEntry(appId);
				}
			}
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.box.evtBox#alignScrollToQuote
	     * @methodOf evtviewer.box.evtBox
	     *
	     * @description
	     * <p>Align box body container of all box instances to a particular quote or source entry.</p>
		 * <p>For each box reference, the provider will trigger the function
		 * {@link evtviewer.box.controller:BoxCtrl#scrollToQuotesEntry} of controller.</p>
		 * <p>This function will be used for the alignment of the apparatuses panel with all other visible boxes.</p>
		 * @param {string} quoteId quote to consider during alignment
		 * @param {string} segId source entry to consider during alignment
		 *
		 * @author CM
	     */
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
		/**
	     * @ngdoc method
	     * @name evtviewer.box.evtBox#alignScrollToAnalogue
	     * @methodOf evtviewer.box.evtBox
	     *
	     * @description
	     * <p>Align box body container of all box instances to a particular analogue entry.</p>
		 * <p>For each box reference, the provider will trigger the function
		 * {@link evtviewer.box.controller:BoxCtrl#scrollToAnaloguesEntry} of controller.</p>
		 * <p>This function will be used for the alignment of the apparatuses panel with all other visible boxes.</p>
		 * @param {string} analogueId analogue to consider during alignment
		 *
		 * @author CM
	     */
		box.alignScrollToAnalogue = function(analogueId) {
			for (var i in collection) {
				if (collection[i].scrollToAnaloguesEntry !== undefined) {
					collection[i].scrollToAnaloguesEntry(analogueId);
				}
			}
		};

		//TODO Add documentation
		box.getEditionById = function (currentBoxId) {
         return collection[currentBoxId].edition;
      };

		box.getState = function (currentBoxId, key) {
         return collection[currentBoxId].state[key];
      };

		box.updateState = function (currentBoxId, key, value) {
        collection[currentBoxId].state[key] = value;
      };

		return box;
	};
});
