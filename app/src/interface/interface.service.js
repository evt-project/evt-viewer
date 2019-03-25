/**
 * @ngdoc service
 * @module evtviewer.interface
 * @name evtviewer.interface.evtInterface
 * @description
 * # evtInterface
 * The evtInterface service is encharged of storing information about the status of the application,
 * and it exposes function to retrieve and change particular status data.
 *
 *
 * @requires $rootScope
 * @requires $timeout
 * @requires $routeParams
 * @requires $q
 * @requires evtviewer.core.config
 * @requires evtviewer.communication.evtCommunication
 * @requires evtviewer.dataHandler.evtAnaloguesParser
 * @requires evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
 * @requires evtviewer.dataHandler.evtCriticalApparatusParser
 * @requires evtviewer.dataHandler.evtCriticalParser
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.reading.evtReading
 * @requires evtviewer.UItools.evtPinnedElements
 * @requires evtviewer.translation.evtTranslation
 *
**/
angular.module('evtviewer.interface')

.service('evtInterface', function($rootScope, $timeout, evtTranslation, evtCommunication, evtCriticalApparatusParser, evtCriticalParser, evtPinnedElements, evtCriticalApparatusEntry, evtAnaloguesParser, config, $routeParams, parsedData, evtReading, $q) {
    var mainInterface = {};
    /**
     * @ngdoc property
     * @name evtviewer.interface.evtInterface#state
     * @propertyOf evtviewer.interface.evtInterface
     * @description [Private] Internal property where information about interface state are stored.
     * Default:
     <pre>
        var state = {
            currentViewMode : undefined,
            currentDoc : undefined,
            currentPage : undefined,
            currentWits : undefined,
            currentWitsPages : undefined,
            currentEdition : undefined,
            currentComparingEdition: undefined,
            currentAppEntry : undefined,
            currentHighlightedZone : undefined,
            isLoading : true,
            isPinnedAppBoardOpened : false,
            secondaryContent : '',
            dialog : {
                home : ''
            },
            isApparatusBoxOpen : true,
            currentApparatus : undefined,
            currentQuote : undefined,
            currentAnalogue : undefined,
            currentSource : undefined,
            currentSourceText : undefined,
            currentVersions : undefined,
            currentVersionEntry : undefined,
            currentVersion : undefined,
            mainMenu : false
        };
     </pre>
     */
    var state = {
        currentViewMode  : undefined,
        currentDoc       : undefined,
        currentPage      : undefined,
        currentWits      : undefined,
        currentWitsPages : undefined,
        currentEdition   : undefined,
        currentComparingEdition: undefined,
        currentAppEntry  : undefined,
        currentHighlightedZone: undefined,
        isLoading        : true,
        isPinnedAppBoardOpened : false,
        indexingInProgress : false,
        secondaryContent : '',
		dialog : {
			home : ''
		},
        //ADDED BY CM//
        isApparatusBoxOpen : true,
        currentApparatus   : undefined,
        currentQuote       : undefined,
        currentAnalogue    : undefined,
        currentSource      : undefined,
        currentSourceText  : undefined,
        currentVersions    : undefined,
        currentVersionEntry: undefined,
        currentVersion     : undefined,

        mainMenu           : false
    };
    /**
     * @ngdoc property
     * @name evtviewer.interface.evtInterface#properties
     * @propertyOf evtviewer.interface.evtInterface
     * @description [Private] Internal property where information about interface properties are stored.
     * Default:
     <pre>
        var properties = {
            indexTitle : '',
            webSite            : '',
            dataUrl : '',
            logoUrl : '',
            enableXMLdownload : false,
            availableViewModes : [ ],
            availableWitnesses : [ ],
            witnessSelector : false,
            namedEntitiesLists : false,
            availableSourcesTexts : [ ],
            isSourceLoading : false,
            parsedSourcesTexts : [ ],
            availableVersions : [ ],
            versionSelector : false
        };
        </pre>
     */
    var properties = {
        indexTitle         : '',
        webSite            : '',
        dataUrl            : '',
        logoUrl            : '',
        enableXMLdownload  : false,
        availableViewModes : [ ],
        availableWitnesses : [ ],
        witnessSelector    : false,
        namedEntitiesLists : false,
        availableSourcesTexts : [ ],
        isSourceLoading    : false,
        parsedSourcesTexts : [ ],
        availableVersions  : [ ],
        versionSelector    : false
    };
    /**
     * @ngdoc property
     * @name evtviewer.interface.evtInterface#tools
     * @propertyOf evtviewer.interface.evtInterface
     * @description [Private] Internal property where information about interface tools status are stored.
     * Default:
     <pre>
        var tools = {

        };
     </pre>
     */
    var tools = {

    };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#boot
         * @methodOf evtviewer.interface.evtInterface
         *
         * @description
         * Main interface boot.
         * During this phase, after reading the JSON configuration file ({@link evtviewer.communication.evtCommunication#getExternalConfig evtCommunication.getExternalConfig})
         * and updating the appropriate parameters in the internal model,
         * the system initiates an Ajax request in order to retrieve the edition data, contained in the file specified by the publisher,
         * which can either be a local file or an online resource ({@link evtviewer.communication.evtCommunication#getData evtCommunication.getData}).
         * If the publisher has indicated a URL for sources and/or analogues, the system initiates one (or more) other Ajax requests in order
         * to retrive this external material ({@link evtviewer.communication.evtCommunication#getExternalData evtCommunication.getExternalData}).
         * If no errors are raised, the interface will update its status and available features,
         * eventually launch other parser to get data not yet retrieved and update url parameters depending either on previous paramenter set or on the default values.
         *
         */
        mainInterface.boot = function() {
            evtCommunication.getExternalConfig(config.configUrl).then(function(){
                properties.indexTitle         = config.indexTitle;
                properties.logoUrl            = config.logoUrl;
                properties.webSite            = config.webSite;
                properties.enableXMLdownload  = config.enableXMLdownload;
                properties.availableViewModes = config.availableViewModes;

                // Setting available languages and defaults
                evtTranslation.setLanguages(config.languages);
                var userLangKey = evtTranslation.getUserLanguage(),
                    fallbackLangKey = evtTranslation.getFallbackLanguage();
                evtTranslation.setFallbackLanguage(fallbackLangKey);
                evtTranslation.setLanguage(userLangKey);

                //TODO: object containing all the external files in globaldefault

                // Parse the external Sources file, if defined (@author: CM)
                if (config.sourcesUrl !== '') {
                        evtCommunication.getExternalData(config.sourcesUrl);
                    }
                // Parse the external Analogues file, if defined (@author: CM)
                if (config.analoguesUrl !== '') {
                        evtCommunication.getExternalData(config.analoguesUrl);
                }
                mainInterface.updateProperty('dataUrl', config.dataUrl);
                if (config.dataUrl === '') {
                    evtCommunication.err('', '', 'dataUrlEmpty', false);
                    $rootScope.$applyAsync(state.isLoading = false);
                } else {
                  evtCommunication.getData(config.dataUrl).then(function () {
                      // Remove Collation View Mode if Witnesses List Empty
                      for (var i = 0, totViews = properties.availableViewModes.length; i < totViews; i++) {
                          var viewModeName = properties.availableViewModes[i].viewMode;
                          if (viewModeName === 'collation' && parsedData.getWitnessesList().length === 0) {
                              properties.availableViewModes[i].visible = false;
                          }
                          if (viewModeName === 'versions' && mainInterface.getAllVersionsNumber() < 2) {
                              properties.availableViewModes[i].visible = false;
                          }
                          if (viewModeName === 'srcTxt' && (!parsedData.getSources()._indexes.availableTexts || parsedData.getSources()._indexes.availableTexts.length === 0)) {
                              properties.availableViewModes[i].visible = false;
                          }
                      }

                      // Remove Named Entities Lists button if Named Entities Lists Collection is Empty
                      properties.namedEntitiesLists = parsedData.getNamedEntitiesCollection()._indexes.length > 0;

                      if (config.availableEditionLevel) {
                          for (var e = 0; e < config.availableEditionLevel.length; e++) {
                              var edition = config.availableEditionLevel[e];
                              if (edition.visible) {
                                  parsedData.addEdition(edition);
                              }
                          }
                      }

                      mainInterface.updateParams($routeParams);

                      var promises = [];

                      var currentDocFirstLoad = parsedData.getDocument(state.currentDoc);
                      if (currentDocFirstLoad !== undefined){

                          // Parse critical entries
                          if (config.loadCriticalEntriesImmediately){
                              promises.push(evtCriticalApparatusParser.parseCriticalEntries(currentDocFirstLoad.content).promise);
                          }

                          // Parse the versions entries
                          if (config.versions.length > 1) {
                              promises.push(evtCriticalApparatusParser.parseVersionEntries(currentDocFirstLoad.content).promise);
                          }

                          // Parse critical text
                          if ((config.editionType === 'critical' || config.editionType === 'multiple') && parsedData.isCriticalEditionAvailable()) {
                              if (config.versions.length > 0 && config.versions[0] !== undefined) {
                                  promises.push(evtCriticalParser.parseCriticalText(currentDocFirstLoad.content, state.currentDoc, config.versions[0]).promise);
                              } else {
                                  promises.push(evtCriticalParser.parseCriticalText(currentDocFirstLoad.content, state.currentDoc).promise);
                              }
                          }

                          $q.all(promises).then(function() {
                              // Update current app entry
                              if (state.currentAppEntry !== undefined &&
                                  parsedData.getCriticalEntryById(state.currentAppEntry) === undefined) {
                                  mainInterface.updateState('currentAppEntry', '');
                              }

                              // Temp | TODO: add to updateParams? //
                              // Prepare the sources texts available and the source text to show as default
                              // in the src-Txt view
                              var sourcesTexts = parsedData.getSources()._indexes.availableTexts;
                              if (Object.keys(sourcesTexts).length !== 0) {
                                  for (var i in sourcesTexts) {
                                      properties.availableSourcesTexts.push(sourcesTexts[i].id);
                                  }
                                  mainInterface.updateCurrentSourceText(properties.availableSourcesTexts[0]);
                              }

                              // Temp | TODO: add to updateParams? //
                              // Prepare version to show as default in the versions view if there
                              // are only two versions of the text, and available versions
                              state.currentVersions = [];
                              if (config.versions.length === 2) {
                                  state.currentVersions.push(config.versions[1]);
                              } else {
                                  for (var v = 1; v < config.versions.length; v++) {
                                      properties.availableVersions.push(config.versions[v]);
                                  }
                              }

                              mainInterface.updateUrl();

                              var quotesList = parsedData.getQuotes()._indexes.encodingStructure || [],
                                  quotesInBox = !config.showInlineSources && quotesList.length > 0,
                                  analoguesList = parsedData.getAnalogues()._indexes.encodingStructure || [],
                                  analoguesInBox = !config.showInlineAnalogues && analoguesList.length > 0;
                              state.isApparatusBoxOpen = (!config.showInlineCriticalApparatus || quotesInBox || analoguesInBox);

                              $rootScope.$applyAsync(state.isLoading = false);

                              // Update Pinned entries
                              $timeout(function() {
                                  evtPinnedElements.getElementsFromCookies();
                              }, 10);
                          });
                      }
                  });
                }
            });
        };

        // ////////// //
        // PARAMS GET //
        // ////////// //

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#setTabContainerPanel
         * @methodOf evtviewer.interface.evtInterface
         * @description Set Tab Container active panel
         * @param {string} arr panel to be set
         */
		mainInterface.setTabContainerPanel = function(arr){
			state.dialog.tabContainerPanel = arr;
		};

		/**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#getTabContainerPanel
         * @methodOf evtviewer.interface.evtInterface
         * @description Get active Tab Container panel
         * @returns {string} active tab container panel name
         */
		mainInterface.getTabContainerPanel = function(){
			return state.dialog.tabContainerPanel;
		};

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#setHomePanel
         * @methodOf evtviewer.interface.evtInterface
         * @description Set Home Panel
         * @param {string} string panel to be set
         */
		mainInterface.setHomePanel = function(string){
			state.dialog.home = string;
		};

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#getHomePanel
         * @methodOf evtviewer.interface.evtInterface
         * @description Get Home Panel
         * @returns {string} home panel name
         */
		mainInterface.getHomePanel = function(){
			return state.dialog.home;
		};

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#isLoading
         * @methodOf evtviewer.interface.evtInterface
         * @description Check if interface is in "loading" status
         * @returns {boolean} interface loading status
         */
        mainInterface.isLoading = function() {
            return state.isLoading;
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#isToolAvailable
         * @methodOf evtviewer.interface.evtInterface
         * @description Check if the tool "toolName" is available or not
         * @param {string} toolName name of tool to check
         * @returns {boolean} availability of tool "toolName"
         */
        mainInterface.isToolAvailable = function(toolName){
            return config[toolName];
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#getToolState
         * @methodOf evtviewer.interface.evtInterface
         * @description Get the status of tool "toolName"
         * @param {string} toolName name of tool to check
         * @returns {boolean} status of tool "toolName"
         */
        mainInterface.getToolState = function(toolName) {
            return (tools[toolName] ? tools[toolName].status : undefined);
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#getProperties
         * @methodOf evtviewer.interface.evtInterface
         * @description Get the update properties of interface
         * @returns {Object} update properties object. Example:
         * <pre>
            var properties = {
                indexTitle : '',
                dataUrl : '',
                logoUrl : '',
                enableXMLdownload : false,
                availableViewModes : [ ],
                availableWitnesses : [ ],
                witnessSelector : false,
                namedEntitiesLists : false,
                availableSourcesTexts : [ ],
                isSourceLoading : false,
                parsedSourcesTexts : [ ],
                availableVersions : [ ],
                versionSelector : false
            };
            </pre>
         */
        mainInterface.getProperties = function(){
            return properties;
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#getProperty
         * @methodOf evtviewer.interface.evtInterface
         * @description Get the updated value of property "name"
         * @param {string} name name of property to get
         * @returns {any} value of property "name"
         */
        mainInterface.getProperty = function(name){
            return properties[name];
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#getStates
         * @methodOf evtviewer.interface.evtInterface
         * @description Get the updated statues values of interface
         * @returns {Object} updated status values object. Example:
         <pre>
            var state = {
                currentViewMode : undefined,
                currentDoc : undefined,
                currentPage : undefined,
                currentWits : undefined,
                currentWitsPages : undefined,
                currentEdition : undefined,
                currentComparingEdition: undefined,
                currentAppEntry : undefined,
                currentHighlightedZone : undefined,
                isLoading : true,
                isPinnedAppBoardOpened : false,
                secondaryContent : '',
                dialog : {
                    home : ''
                },
                isApparatusBoxOpen : true,
                currentApparatus : undefined,
                currentQuote : undefined,
                currentAnalogue : undefined,
                currentSource : undefined,
                currentSourceText : undefined,
                currentVersions : undefined,
                currentVersionEntry : undefined,
                currentVersion : undefined,
                mainMenu : false
            };
         </pre>
         */
        mainInterface.getStates = function(){
            return state;
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#getState
         * @methodOf evtviewer.interface.evtInterface
         * @description Get the updated status of property "name"
         * @param {string} name name of property to get
         * @returns {any} value of property "name"
         */
        mainInterface.getState = function(name){
            return state[name];
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#getCurrentWitnessPage
         * @methodOf evtviewer.interface.evtInterface
         * @description Get the current page of witness "wit"
         * @param {string} wit id of witness
         * @returns {string} id of current page of witness "wit"
         */
        mainInterface.getCurrentWitnessPage = function(wit){
            return state.currentWitsPages[wit];
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#existCriticalText
         * @methodOf evtviewer.interface.evtInterface
         * @description Check if critical text exists for current document
         * @returns {boolean} availability of critical text for current document
         */
        mainInterface.existCriticalText = function(){
            return parsedData.getCriticalText(state.currentDoc) !== undefined;
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#isCriticalApparatusInline
         * @methodOf evtviewer.interface.evtInterface
         * @description Check if critical apparatus is inline or in a dedicated box
         * @returns {boolean} whether the critical apparatus is inline or not
         */
        mainInterface.isCriticalApparatusInline = function() {
            return config.showInlineCriticalApparatus || mainInterface.getState('currentViewMode') !== 'readingTxt';
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#isSourcesInline
         * @methodOf evtviewer.interface.evtInterface
         * @description Check if sources apparatus is inline or in a dedicated box
         * @returns {boolean} whether the sources apparatus is inline or not
         */
		mainInterface.isSourcesInline = function() {
            return config.showInlineSources || mainInterface.getState('currentViewMode') !== 'readingTxt';
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#isAnaloguesInline
         * @methodOf evtviewer.interface.evtInterface
         * @description Check if analogues apparatus is inline or in a dedicated box
         * @returns {boolean} whether the analogues apparatus is inline or not
         */
        mainInterface.isAnaloguesInline = function() {
            return config.showInlineAnalogues || mainInterface.getState('currentViewMode') !== 'readingTxt';
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#setToolStatus
         * @methodOf evtviewer.interface.evtInterface
         * @description Update the status of a given tool
         * @param {string} toolName name of tool to update
         * @param {string} status new status of tool
         */
        mainInterface.setToolStatus = function(toolName, status) {
            if (!tools[toolName]) {
                tools[toolName] = {};
            }
            tools[toolName].status = status;
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#updateProperty
         * @methodOf evtviewer.interface.evtInterface
         * @description Update the value of a given property
         * @param {string} property name of property to update
         * @param {any} value new value of property
         */
        mainInterface.updateProperty = function(property, value){
            properties[property] = value;
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#updateState
         * @methodOf evtviewer.interface.evtInterface
         * @description Update the value of a given status property
         * @param {string} property name of property to update
         * @param {any} value new value of property
         */
        mainInterface.updateState = function(property, value){
            state[property] = value;
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#toggleState
         * @methodOf evtviewer.interface.evtInterface
         * @description Toggle the value of a given property.
         * NB: Use this method only with boolean parameters!
         * @param {string} property name of property to update
         */
        mainInterface.toggleState = function(property){
            state[property] = ! state[property];
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#updateCurrentHighlightedZone
         * @methodOf evtviewer.interface.evtInterface
         * @description Update current highlighted zone if different from current
         * @todo: Eventually change once the image viewer has been implemented
         * @param {Object} zone object representing new zone
         */
        mainInterface.updateCurrentHighlightedZone = function(zone) {
            var currentZone = state.currentHighlightedZone;
            if ( !currentZone || !zone || !(currentZone.id === zone.id && currentZone.name === zone.name) ) {
                state.currentHighlightedZone = zone;
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#updateCurrentSourceText
         * @methodOf evtviewer.interface.evtInterface
         * @description Update current source text. If text of required source has not been parsed yet,
         * launch {@evtviewer.communication.evtCommunication#getSourceTextFile evtCommunication.getSourceTextFile} to retrieve it.
         * @param {string} sourceId id of source to set as current source text
         * @author CM
         */
        mainInterface.updateCurrentSourceText = function(sourceId) {
            var source = parsedData.getSource(sourceId),
                isTextAvailable = source !== undefined && source._textAvailable;
            if (isTextAvailable) {
                var isTextParsed = (Object.keys(parsedData.getSource(sourceId).text).length > 0);
                if (!isTextParsed) {
                    properties.isSourceLoading = !properties.isSourceLoading;
                    evtCommunication.getSourceTextFile(config.sourcesTextsUrl+sourceId+'.xml', sourceId).then(function() {
                        properties.isSourceLoading = !properties.isSourceLoading;
                        properties.parsedSourcesTexts.push(sourceId);
                    });
                }
            }
            state.currentSourceText = sourceId;
        };

        // //////// //
        // VERSIONS //
        // //////// //
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#removeAvailableVersion
         * @methodOf evtviewer.interface.evtInterface
         * @description Remove a version from the available versions list
         * @param {string} version id of the version that has to be removed
         * @author CM
         */
        mainInterface.removeAvailableVersion = function(version) {
            var index = properties.availableVersions.indexOf(version);
            if (index !== undefined) {
                properties.availableVersions.splice(index, 1);
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#addAvailableVersion
         * @methodOf evtviewer.interface.evtInterface
         * @description Add a new version in the available versions list
         * @param {string} version id of the version that has to be added
         * @author CM
         */
        mainInterface.addAvailableVersion = function(version) {
            var index = properties.availableVersions.indexOf(version);
            if (index === -1) {
                properties.availableVersions.push(version);
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#addVersion
         * @methodOf evtviewer.interface.evtInterface
         * @description Add a version box in the interface
         * @param {string} version id of the version to add
         * @param {string} index index of the position, if undefined the version is added at the end of the array
         * @author CM
         */
        mainInterface.addVersion = function(version, index) {
            if (index === undefined) {
                state.currentVersions.push(version);
            } else {
                state.currentVersions.splice(index, 0, version);
            }
            mainInterface.removeAvailableVersion(version);
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#removeVersion
         * @methodOf evtviewer.interface.evtInterface
         * @description Remove a vesion box from the interface
         * @param {string} version id of the version to remove
         * @author CM
         */
        mainInterface.removeVersion = function(version) {
            var index = state.currentVersions.indexOf(version);
            if (index >= 0) {
                state.currentVersions.splice(index, 1);
            }
            if (properties.availableVersions.indexOf(version) < 0) {
                properties.availableVersions.push(version);
            }
        };

        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#switchVersions
         * @methodOf evtviewer.interface.evtInterface
         * @description Change the version viewed inside of a version box
         * @param {string} oldVer the old version to change
         * @param {string} newVer the new version to view
         * @author CM
         */
        mainInterface.switchVersions = function(oldVer, newVer) {
            var newVerOldIndex = state.currentVersions.indexOf(newVer),
                oldVerOldIndex = state.currentVersions.indexOf(oldVer);
            if (newVerOldIndex >= 0) {
                state.currentVersions[newVerOldIndex] = oldVer;
            } else {
                mainInterface.addAvailableVersion(oldVer);
            }
            state.currentVersions[oldVerOldIndex] = newVer;
            mainInterface.removeAvailableVersion(newVer);
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#getAllVersionsNumber
         * @methodOf evtviewer.interface.evtInterface
         * @description Get how many different versions have been encoded by the editor
         * @author CM
         */
        mainInterface.getAllVersionsNumber = function() {
            return (config.versions ? config.versions.length : 0);
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#updateCurrentVersionEntry
         * @methodOf evtviewer.interface.evtInterface
         * @description Update current version entry if given entry id is not undefined
         * @param {string} appId id of entry to be set as current version entry
         * @author CM
         */
        mainInterface.updateCurrentVersionEntry = function(appId) {
            if (appId !== undefined) {
                state.currentVersionEntry = appId;
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#getCurrentVersionEntry
         * @methodOf evtviewer.interface.evtInterface
         * @description Update current version entry if given entry id is not undefined
         * @param {string} appId id of entry to be set as current version entry
         * @author CM
         */
        mainInterface.getCurrentVersionEntry = function(appId) {
            return state.currentVersionEntry;
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#updateCurrentVersion
         * @methodOf evtviewer.interface.evtInterface
         * @description Update current version if given version is not undefined and is contained in initial version array
         * @param {string} ver id of version to be set as current version
         * @author CM
         */
        mainInterface.updateCurrentVersion = function(ver) {
            if (ver !== undefined && config.versions.indexOf(ver) !== -1) {
                state.currentVersion = ver;
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#getCurrentVersion
         * @methodOf evtviewer.interface.evtInterface
         * @description Get current version displayed in the text main box
         * @author CM
         */
        mainInterface.getCurrentVersion = function(ver) {
            return state.currentVersion;
        };
        // WITNESS
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#removeAvailableWitness
         * @methodOf evtviewer.interface.evtInterface
         * @description Remove given witness from the available witness list, only if given witness is already in the list
         * @param {string} witness id of witness to be removed from available witnesses list
         * @author CDP
         */
        mainInterface.removeAvailableWitness = function(witness) {
            var index = properties.availableWitnesses.indexOf(witness);
            if (index !== undefined){
                properties.availableWitnesses.splice(index, 1);
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#updateWitnessesPage
         * @methodOf evtviewer.interface.evtInterface
         * @description Update current page of a given witness
         * @param {string} witness id of witness to be updated
         * @param {string} pageId id of page to be set as current for given witness
         * @author CDP
         */
        mainInterface.updateWitnessesPage = function(witness, pageId) {
            state.currentWitsPages[witness] = pageId;
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#addWitness
         * @methodOf evtviewer.interface.evtInterface
         * @description Add witness in current witnesses list and remove it from available ones.
         * @param {string} newWit id of witness to be added
         * @author CDP
         * @todo Decide where to add the new witness: either before or after the others
         * @todo Add scroll to new box added
         */
        mainInterface.addWitness = function(newWit) {
            // if (mainInterface.existCriticalText()) {
            //     state.currentWits.unshift(newWit);
            // } else {
                state.currentWits.push(newWit);
            // }
            mainInterface.removeAvailableWitness(newWit);
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#addWitnessAtIndex
         * @methodOf evtviewer.interface.evtInterface
         * @description Add witness at a particular index in in current witnesses list
         * @param {string} newWit id of witness to be added
         * @param {string} index where to add new witness
         * @author CDP
         */
        mainInterface.addWitnessAtIndex = function(newWit, index) {
            state.currentWits.splice(index, 0, newWit);
            mainInterface.removeAvailableWitness(newWit);
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#removeWitness
         * @methodOf evtviewer.interface.evtInterface
         * @description Remove witness from current witnesses list and add it in available ones
         * @param {string} wit id of witness to be removed
         * @author CDP
         */
         mainInterface.removeWitness = function(wit) {
            var witIndex = state.currentWits.indexOf(wit);
            if (witIndex >= 0) {
                state.currentWits.splice(witIndex, 1);
                delete state.currentWitsPages[wit];
            }
            if (properties.availableWitnesses.indexOf(wit) < 0) {
                properties.availableWitnesses.push(wit);
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#switchWitnesses
         * @methodOf evtviewer.interface.evtInterface
         * @description Switch positions of given witnesses.
         * If the witness is already in the current witnesses list, it will be switched with the old one.
         * @param {string} oldWit the old witness to change
         * @param {string} newWit the new witness to view
         * @author CDP
         * @todo update box scroll to page on switching...
         */
         mainInterface.switchWitnesses = function(oldWit, newWit) {
            // se il testimone che sto selezionando è già visualizzato
            // lo scambio con il vecchio testimone
            var newWitOldIndex = state.currentWits.indexOf(newWit),
                oldWitOldIndex = state.currentWits.indexOf(oldWit);
            if (newWitOldIndex >= 0) {
                state.currentWits[newWitOldIndex] = oldWit;
            }
            if (oldWitOldIndex >= 0) {
                state.currentWits[oldWitOldIndex] = newWit;
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#updateAvailableWitnessesByVersion
         * @methodOf evtviewer.interface.evtInterface
         * @description Update available witness by version.
         * Remove from current wits those that are not in current version.
         * Set available witnesses depending on those in current version that are not selected yet.
         * Remove from current wits those that are not in current version.
         * Set available witnesses depending on those in current version that are not selected yet
         * @param {string} scopeVer id of scope version
         * @author CM
         */
        mainInterface.updateAvailableWitnessesByVersion = function(scopeVer) {
            var scopeVerWits = parsedData.getVersionEntries()._indexes.versionWitMap[scopeVer];
            var currentWits = [],
                availableWitnesses = [];
            if (scopeVerWits !== undefined && scopeVerWits.length > 0) {
                // Remove from current wits those that are not in current version
                for (var i = 0; i < state.currentWits.length; i++) {
                    if (scopeVerWits.indexOf(state.currentWits[i]) >= 0) {
                        currentWits.push(state.currentWits[i]);
                    }
                }
                state.currentWits = currentWits;
                // Set available witnesses depending on those in current version that are not selected yet
                for (var j = 0; j < scopeVerWits.length; j++) {
                    if (currentWits.indexOf(scopeVerWits[j]) < 0) {
                        availableWitnesses.push(scopeVerWits[j]);
                    }
                }
                properties.availableWitnesses = availableWitnesses;
            } else if (scopeVer === config.versions[0]) {
                var allWits = parsedData.getWitnessesList();
                // Remove from current wits those that are not in current version
                for (var k = 0; k < state.currentWits.length; k++) {
                    if (allWits.indexOf(state.currentWits[k]) >= 0) {
                        currentWits.push(state.currentWits[k]);
                    }
                }
                state.currentWits = currentWits;
                // Set available witnesses depending on those in current version that are not selected yet
                for (var h = 0; h < allWits.length; h++) {
                    if (currentWits.indexOf(allWits[h]) < 0) {
                        availableWitnesses.push(allWits[h]);
                    }
                }
                properties.availableWitnesses = availableWitnesses;
            }
            mainInterface.updateUrl();
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#isViewModeAvailable
         * @methodOf evtviewer.interface.evtInterface
         * @description Check whether given viewMode is available or not.
         * @param {string} viewMode view mode to be checked
         * @returns {boolean} whether given viewMode is available or not
         * @author CDP
         */
        mainInterface.isViewModeAvailable = function(viewMode) {
            for (var i = 0, totViews = properties.availableViewModes.length; i < totViews; i++) {
                if (properties.availableViewModes[i].viewMode === viewMode) {
                    return properties.availableViewModes[i].visible;
                }
            }
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#updateParams
         * @methodOf evtviewer.interface.evtInterface
         * @description Update current state values depending on parameters in URL and available parsed data
         * @param {params} params URL parameters
         * @author CDP
         * @todo Add q(citazione), s(fonte), an(passo parallelo) e ap(apparato)
         */
        mainInterface.updateParams = function(params) {
            var viewMode = config.defaultViewMode,
                edition  = config.defaultEdition,
                comparingEdition,
                pageId,
                docId,
                witnesses,
                witIds = [],
                witPageIds = {},
                appId,
                quoteId,
                analogueId,
                sourceId,
                apparatusId;

            // VIEW MODE
            if (params.viewMode !== undefined) {
                // Check if view mode is available
                if (mainInterface.isViewModeAvailable(params.viewMode)) {
                    viewMode = params.viewMode;
                }
            }

            // EDITION
            var availableEditionLevel = parsedData.getEditions();
            if (params.e !== undefined ) {
                if (parsedData.getEdition(params.e)) {
                    edition = params.e;
                } else {
                    if (availableEditionLevel && availableEditionLevel.length > 0) {
                        edition = availableEditionLevel[0].value;
                    }
                }
            } else {
                if (parsedData.getEdition(edition)) {
                    if (viewMode === 'readingTxt' && edition === 'critical' && parsedData.isCriticalEditionAvailable()) {
                        if (parsedData.getEdition('critical')) {
                            edition = 'critical';
                        } else {
                            edition = availableEditionLevel[0].value;
                        }
                    }
                } else {
                    if (availableEditionLevel && availableEditionLevel.length > 0) {
                        edition = availableEditionLevel[0].value;
                    }
                }
            }

            if (params.ce !== undefined ) { 
              comparingEdition = params.ce;
            } else {
              var i = 0;
              while (!comparingEdition && i < availableEditionLevel.length) {
                if (availableEditionLevel[i].value !== edition) {
                  comparingEdition = availableEditionLevel[i].value;
                }
                i++;
              }
            }

            // PAGE
            if ( params.p !== undefined && parsedData.getEdition(params.ce)) {
                pageId = params.p;
            } else {
                var pages = parsedData.getPages();
                if (pages.length > 0) {
                    pageId = pages[pages[0]].value || undefined;
                }
            }

            // DOCUMENT
            if ( params.d !== undefined && parsedData.getDocument(params.d) !== undefined ) {
                docId  = params.d;
            } else {
                var documents = parsedData.getDocuments();
                if (documents._indexes.length > 0) {
                    docId = documents[documents._indexes[0]].value || undefined;
                }
            }
            // WITNESSES
            var totWits;
            if (params.ws !== undefined) {
                witnesses = params.ws.split(',').filter(function(el) {return el.length !== 0;});
                totWits = parsedData.getWitnessesList();
                properties.availableWitnesses = totWits.slice(0, totWits.length);
                for (var w in witnesses) {
                    var wit     = witnesses[w].split('@')[0],
                        witPage = witnesses[w].split('@')[1];
                    if (parsedData.getWitness(wit) !== undefined){
                        witIds.push(wit);
                        mainInterface.removeAvailableWitness(wit);
                        if (witPage !== undefined && parsedData.getPage(wit+'-'+witPage) !== undefined){
                            witPageIds[wit] = witPage;
                        }
                    }
                }
            } else {
                if (viewMode === 'collation'){
                    // Check if there are multiple versions of the text
                    if (config.versions.length > 1) {
                        witIds = parsedData.getVersionEntries()._indexes.versionWitMap[config.versions[0]];
                    } else {
                        witIds = parsedData.getWitnessesList();
                        if (witIds !== undefined && witIds.length > config.maxWitsLoadTogether) {
                            properties.availableWitnesses = witIds.slice(config.maxWitsLoadTogether);
                            witIds = witIds.slice(0, config.maxWitsLoadTogether);
                        } else {
                            properties.availableWitnesses = [];
                        }
                    }
                } else {
                    if (config.versions.length > 1) {
                        // Check if the main version of the text refers to some particular witnesses
                        var mainVerWits = parsedData.getVersionEntries()._indexes.versionWitMap[config.versions[0]];
                        if (mainVerWits!== undefined && mainVerWits.length > 0) {
                            properties.availableWitnesses = mainVerWits.slice(0, mainVerWits.length);
                        }
                    } else {
                        totWits = parsedData.getWitnessesList();
                        properties.availableWitnesses = totWits.slice(0, totWits.length);
                    }
                }
            }
            // APP ENTRY
            if ( params.app !== undefined ) {
                appId  = params.app;
            }

            if ( viewMode !== undefined ) {
                mainInterface.updateState('currentViewMode', viewMode);
            }

            if ( edition !== undefined ) {
                mainInterface.updateState('currentEdition', edition);
            } else if (viewMode === 'collation'){
                mainInterface.updateState('currentEdition', 'critical');
            }
    
            mainInterface.updateState('currentComparingEdition', comparingEdition)
            
            if ( pageId !== undefined ) {
                mainInterface.updateState('currentPage', pageId);
            }

            if ( docId !== undefined ) {
                mainInterface.updateState('currentDoc', docId);
            }

            if ( witIds !== undefined) {
                mainInterface.updateState('currentWits', witIds);
            }

            if ( witPageIds !== {}) {
                mainInterface.updateState('currentWitsPages', witPageIds);
            }

            if ( appId !== undefined) {
                mainInterface.updateState('currentAppEntry', appId);
                evtReading.setCurrentAppEntry(appId);
            }
            mainInterface.updateUrl();
        };
        /**
         * @ngdoc method
         * @name evtviewer.interface.evtInterface#updateUrl
         * @methodOf evtviewer.interface.evtInterface
         * @description Update URL depending on current value state
         * @author CDP
         * @todo Add q(citazione), s(fonte), an(passo parallelo) e ap(apparato)
         */
        mainInterface.updateUrl = function() {
            var viewMode   = state.currentViewMode,
                searchPath = '';

                searchPath += state.currentDoc === undefined ? '' : (searchPath === '' ? '' : '&')+'d='+state.currentDoc;
                searchPath += state.currentPage === undefined ? '' : (searchPath === '' ? '' : '&')+'p='+state.currentPage;
                searchPath += state.currentEdition === undefined ? '' : (searchPath === '' ? '' : '&')+'e='+state.currentEdition;
                searchPath += state.currentComparingEdition === undefined ? '' : (searchPath === '' ? '' : '&')+'ce='+state.currentComparingEdition;
                if (viewMode === 'collation') {
                    if (state.currentWits !== undefined && state.currentWits.length > 0) {
                        if (searchPath !== '') {
                          searchPath += '&';
                        }
                        searchPath += 'ws=';
                        for (var w in state.currentWits){
                            var wit = state.currentWits[w],
                                currentPage = mainInterface.getCurrentWitnessPage(wit);
                            searchPath += wit;
                            if (currentPage !== undefined){
                                searchPath += '@'+currentPage;
                            }
                            if (w < state.currentWits.length-1) {
                                searchPath += ',';
                            }
                        }
                    }
                }
                if (state.currentAppEntry !== undefined && state.currentAppEntry !== '') {
                    if (searchPath !== '') {
                      searchPath += '&';
                    }
                    searchPath += 'app='+state.currentAppEntry;
                }

            if (viewMode !== undefined) {
                // window.history.pushState(null, null, '#/'+viewMode+'?'+searchPath.substr(1));
                window.location = '#/'+viewMode+'?'+searchPath;
            }
        };
    return mainInterface;
});
