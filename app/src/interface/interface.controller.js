/**
 * @ngdoc object
 * @module evtviewer.interface
 * @name evtviewer.interface.controller:InterfaceCtrl
 *
 * @description 
 * # InterfaceCtrl
 * The InterfaceCtrl controller handles the upper level user interface.
 *
 * @requires $log
 * @requires $timeout
 * @requires $injector
 * @requires $scope
 * @requires $route
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.communication.evtCommunication
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.apparatuses.evtApparatuses
 * @requires evtviewer.buttonSwitch.evtButtonSwitch
 * @requires evtviewer.box.evtBox
 * @requires evtviewer.dialog.evtDialog
 * @requires evtviewer.popover.evtPopover
 * @requires evtviewer.select.evtSelect
 * @requires evtviewer.UItools.evtPinnedElements
 * @requires evtviewer.translationevtTranslation
 *
**/
angular.module('evtviewer.interface')

	.controller('InterfaceCtrl', function($log, $timeout, $injector, $scope, $route, evtInterface, evtTranslation, evtPinnedElements, evtButtonSwitch, evtBox, evtApparatuses, parsedData, evtSelect, evtPopover, evtCommunication, evtDialog) {
		var _console = $log.getInstance('interface');
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentViewMode
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current view mode from evtInterface states ({@link evtviewer.interface.evtInterface#getState evtInterface.getState()})
         * @return {string} current view mode
         */
		$scope.getCurrentViewMode = function() {
			return evtInterface.getState('currentViewMode');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentPage
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current page from evtInterface states ({@link evtviewer.interface.evtInterface#getState evtInterface.getState()})
         * @return {string} current page
         */
		$scope.getCurrentPage = function() {
			return evtInterface.getState('currentPage');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentDocument
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current document from evtInterface states ({@link evtviewer.interface.evtInterface#getState evtInterface.getState()})
         * @return {string} current document
         */
		$scope.getCurrentDocument = function() {
			return evtInterface.getState('currentDoc');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentEdition
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current edition from evtInterface states ({@link evtviewer.interface.evtInterface#getState evtInterface.getState()})
         * @return {string} current edition
         */
		$scope.getCurrentEdition = function() {
			return evtInterface.getState('currentEdition');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getAvailableWitnesses
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get available witnesses from evtInterface properties ({@link evtviewer.interface.evtInterface#getProperty evtInterface.getProperty()})
         * @return {array} current available witnesses list
         */
		$scope.getAvailableWitnesses = function() {
			return evtInterface.getProperty('availableWitnesses');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#isWitnessSelectorActive
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Check whether witnesses selector is active or not. Get information from evtInterface properties ({@link evtviewer.interface.evtInterface#getProperty evtInterface.getProperty()})
         * @return {boolean} whether witnesses selector is active or not
         */
		$scope.isWitnessSelectorActive = function() {
			return evtInterface.getProperty('witnessSelector');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#addWitness
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Add witness among current ones. Update URL. Scroll horizontally to new witness if collation mode is active.
         * @param {string} wit id of witness to add
         */
		$scope.addWitness = function(wit) {
			if (wit !== undefined) {
				evtInterface.addWitness(wit);
				evtInterface.updateUrl();
			}
			$timeout(function() {
				var singleBoxWidth = window.getComputedStyle(document.getElementsByClassName('box')[0]).width.replace('px', '');
				document.getElementById('compareWits_box').scrollLeft = singleBoxWidth * (evtInterface.getState('currentWits').length + 1);
			});
			evtInterface.updateProperty('witnessSelector', false);
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getWitness
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get witness description. Text will be reduced if longer than 30 characters
         * @param {string} wit id of witness to get
         * @returns {string} description of given witness
         */
		$scope.getWitness = function(wit) {
			var desc = wit + ' - ' + parsedData.getWitness(wit).description.textContent.trim() || wit;
			desc = desc.length > 30 ? desc.substr(0, 30) + '...' : desc;
			return desc;
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentWitnesses
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current witnesses list from evtInterface states ({@link evtviewer.interface.evtInterface#getState evtInterface.getState()}).
         * @returns {array} list of current witnesses
         */
		$scope.getCurrentWitnesses = function() {
			return evtInterface.getState('currentWits');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentWitnessPage
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current page of given witness. Information is stored in evtInterface states property.
         * @param {string} wit id of witness of whom we want to know the current page
         * @returns {string} current page of given witness
         */
		$scope.getCurrentWitnessPage = function(wit) {
			return evtInterface.getCurrentWitnessPage(wit);
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getAvailableViewModes
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get available view modes from evtInterface states ({@link evtviewer.interface.evtInterface#getState evtInterface.getState()}).
         * @returns {array} list of available view modes
         */
		$scope.getAvailableViewModes = function() {
			return evtInterface.getProperty('availableViewModes');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#existCriticalText
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Check whether or not critical text exists.
         * @returns {boolean} whether or not critical text exists
         */
		$scope.existCriticalText = function() {
			return evtInterface.existCriticalText();
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentAppEntry
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current critical apparatus entry from evtInterface states ({@link evtviewer.interface.evtInterface#getState evtInterface.getState()}).
         * @returns {string} id of current critical apparatus entry
         */
		$scope.getCurrentAppEntry = function() {
			return evtInterface.getState('currentAppEntry');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#updateCurrentAppEntry
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Update current critical apparatus entry. Update URL.
         * @param {string} entry id of critical apparatus entry to be set as current
         */
		$scope.updateCurrentAppEntry = function(entry) {
			evtInterface.updateState('currentAppEntry', entry);
			if (evtInterface.getState('currentViewMode') === 'readingTxt') {
				evtBox.alignScrollToApp(entry);
				evtApparatuses.alignScrollToApp(entry);
			}
			evtInterface.updateUrl();
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#updateCurrentQuote
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Update current quote entry.
         * @param {string} quote id of quote entry to be set as current
         * @todo update url
         */
		$scope.updateCurrentQuote = function(quote) {
			evtInterface.updateState('currentQuote', quote);
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentApparatus
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current apparatus from evtInterface states ({@link evtviewer.interface.evtInterface#getState evtInterface.getState()}).
         * @returns {string} id of current apparatus
         */
		$scope.getCurrentApparatus = function() { 
			return evtInterface.getState('currentApparatus') ; 
		};
		/**
         * @ngdoc property
         * @name evtviewer.interface.controller:InterfaceCtrl#evtPinnedElements
         * @propertyOf evtviewer.interface.controller:InterfaceCtrl
         * @description Copy of ({@link evtviewer.UItool.evtPinnedElements evtPinnedElements}) service.
         */
		$scope.evtPinnedElements = evtPinnedElements;
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#isLoading
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Check whether or not the interface is in loading status.
         * @returns {boolean} whether or not the interface is in loading status
         */
		$scope.isLoading = function() {
			var error = evtCommunication.getError();
			return evtInterface.isLoading() && error.title === '';
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#isPinnedAppBoardOpened
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Check whether or not the pinned entries board is opened.
         * @returns {boolean} whether or not the pinned entries board is opened
         */
		$scope.isPinnedAppBoardOpened = function() {
			return evtInterface.getState('isPinnedAppBoardOpened');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#isToolAvailable
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Check whether or a given tool is available or not
         * @param {string} toolName name of tool to be checked
         * @returns {boolean} whether or not the given tool is available or not
         */
		$scope.isToolAvailable = function(toolName) {
			return evtInterface.isToolAvailable(toolName);
		};

		$scope.getSecondaryContentOpened = function() {
			return evtInterface.getState('secondaryContent');
		};

		$scope.getProjectInfo = function() {
			return parsedData.getProjectInfo();
		};

		$scope.getWitnessesListFormatted = function() {
			return parsedData.getWitnessesListFormatted();
		};

		$scope.getAvailableLists = function() {
			return parsedData.getNamedEntitiesCollection()._indexes;
		};

		$scope.getProperty = function(name) {
			return evtInterface.getProperty(name);
		};

		$scope.getState = function(name) {
			return evtInterface.getState(name);
		};		
		
		$scope.handleGenericClick = function($event) {
			var target = $event.target;
			if ($(target).parents('evt-select').length === 0) {
				evtSelect.closeAll();
			}
			if ($(target).parents('button-switch').length === 0) {
				var skipBtnTypes = ['standAlone', 'toggler'];
				evtButtonSwitch.unselectAllSkipByBtnType('', skipBtnTypes);
				evtInterface.updateState('mainMenu', false);
			}
			if ($(target).parents('evt-popover').length === 0) {
				evtPopover.closeAll();
			}
			//Temp
			if ($(target).parents('.witnessSelector').length === 0) {
				if (evtInterface.getProperty('witnessSelector')) {
					evtInterface.updateProperty('witnessSelector', false);
				}
			}

		};

		$scope.handleKeydownEvent = function($event) {
			if ($event.keyCode === 27) {
				evtDialog.closeAll();
			}
		};

		$scope.getBookmark = function() {
			var projectRef = parsedData.getProjectInfo().editionReference || {};
			var output = '<div class="bookmark">';
			output += projectRef.author ? projectRef.author + '. ' : '';
			output += projectRef.title ? '<em>' + projectRef.title + '</em>. ' : '';
			output += projectRef.publisher ? '{{ \'PUBLISHED_BY\' | translate }} ' + projectRef.publisher + '. ' : '';
			output += '<<a href="' + window.location + '" target="blank">' + window.location + '</a>>';
			output += '</div>';
			return output;
		};

		$scope.getErrorMsg = function() {
			return evtCommunication.getError();
		};

		// METHODS ADDED BY CM //

		// Method to get available sources texts
		$scope.getAvailableSourcesTexts = function() {
			return evtInterface.getProperty('availableSourcesTexts');
		};

		// Method to get the id the source text viewed in the interface
		$scope.getCurrentSourceText = function() {
			return evtInterface.getState('currentSourceText') ;
		};

		//TODO: add methods for source, quote and analogue?

		// Method to check if the apparatuses box is open
		$scope.isApparatusBoxOpen = function() {
			return evtInterface.getState('isApparatusBoxOpen') ;
		};

		$scope.showApparatusesBox = function() {
			return evtInterface.getState('isApparatusBoxOpen')  && evtInterface.getState('currentEdition') === 'critical';
		};

		$scope.getCurrentVersions = function() {
			return evtInterface.getState('currentVersions');
		};

		$scope.getAvailableVersions = function() {
			return evtInterface.getProperty('availableVersions');
		};

		// Method to check if the selector for the versions is active
		$scope.isVersionSelectorActive = function() {
			return evtInterface.getProperty('versionSelector');
		};

		$scope.getAllVersionsNumber = function() {
			return evtInterface.getAllVersionsNumber();
		};

		$scope.getVersion = function(ver) {
			//CHECKME
			return parsedData.getVersionEntries()._indexes.versionId[ver];
		};

		$scope.addVersion = function(ver) {
			if (ver !== undefined) {
				evtInterface.addVersion(ver);
			}
			$timeout(function() {
				var singleBoxWidth = window.getComputedStyle(document.getElementsByClassName('box')[0]).width.replace('px', '');
				document.getElementById('compareVer_box').scrollLeft = singleBoxWidth * (evtInterface.getState('currentVersions').length + 1);
			});
			evtInterface.updateProperty('versionSelector', false);
		};

		// END OF ADDITION //
		
		// MAIN MANU ACTIONS
		$scope.openGlobalDialogInfo = function() {
			evtInterface.updateState('secondaryContent', 'globalInfo');
			evtDialog.openByType('globalInfo');
		};
		
		$scope.openGlobalDialogLists = function() {
			evtInterface.updateState('secondaryContent', 'entitiesList');
			evtDialog.openByType('entitiesList');
		};

		$scope.generateBookmark = function() {
			evtInterface.updateState('secondaryContent', 'bookmark');
			evtDialog.openByType('bookmark');
		};

		$scope.downloadXML = function() {
			window.open(evtInterface.getProperty('dataUrl'), '_blank');
		};

		// UI Translation
		$scope.getAvailableLanguages = function() {
			return evtTranslation.getLanguages();
		};

		$scope.getCurrentLanguage = function() {
			return evtTranslation.getCurrentLanguage();
		};

		$scope.setLanguage = function(langKey) {
			evtTranslation.setLanguage(langKey);
		};

		_console.log('InterfaceCtrl running');
	})

//TODO: Move this directive in a proper file 
.directive('g', function(parsedData) {
	return {
		restrict: 'E',
		scope: {
			ref: '@'
		},
		template: '<span class="glyph" compile="::content"></span>',
		replace: true,
		link: function(scope, iElement, iAttrs) {
			var sRef = scope.ref,
				sContent = '[' + scope.ref + ']';
			if (sRef && sRef !== '') {
				sRef = sRef.replace('#', '');
				var glyphObj = parsedData.getGlyph(sRef);
				if (glyphObj && glyphObj.parsedXml !== '') {
					sContent = glyphObj.parsedXml;
				}
			}
			// TODO: Decide if simply use html content to be compiled  
			// (in this case the same HTML will be used for each occurrence of glyph) 
			// or if parse the glyph content deeperand use only the character needed  
			scope.content = sContent;
		}
	};
});