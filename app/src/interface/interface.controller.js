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
         * @returns {string} current view mode
         */
		$scope.getCurrentViewMode = function() {
			return evtInterface.getState('currentViewMode');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentPage
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current page from evtInterface states ({@link evtviewer.interface.evtInterface#getState evtInterface.getState()})
         * @returns {string} current page
         */
		$scope.getCurrentPage = function() {
			return evtInterface.getState('currentPage');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentDocument
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current document from evtInterface states ({@link evtviewer.interface.evtInterface#getState evtInterface.getState()})
         * @returns {string} current document
         */
		$scope.getCurrentDocument = function() {
			return evtInterface.getState('currentDoc');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentEdition
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current edition from evtInterface states ({@link evtviewer.interface.evtInterface#getState evtInterface.getState()})
         * @returns {string} current edition
         */
		$scope.getCurrentEdition = function() {
			return evtInterface.getState('currentEdition');
		};
      /**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentEdition
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current edition from evtInterface states ({@link evtviewer.interface.evtInterface#getState evtInterface.getState()})
         * @returns {string} current edition
         */
      $scope.getCurrentComparingEdition = function() {
         return evtInterface.getState('currentComparingEdition');
      };
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getAvailableWitnesses
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get available witnesses from evtInterface properties ({@link evtviewer.interface.evtInterface#getProperty evtInterface.getProperty()})
         * @returns {array} current available witnesses list
         */
		$scope.getAvailableWitnesses = function() {
			return evtInterface.getProperty('availableWitnesses');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#isWitnessSelectorActive
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Check whether witnesses selector is active or not. Get information from evtInterface properties ({@link evtviewer.interface.evtInterface#getProperty evtInterface.getProperty()})
         * @returns {boolean} whether witnesses selector is active or not
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
         * @description Copy of ({@link evtviewer.UItools.evtPinnedElements evtPinnedElements}) service.
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

		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getSecondaryContentOpened
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get name of secondary content opened
         * @returns {string} name of secondary content opened
         */
        $scope.getSecondaryContentOpened = function() {
			return evtInterface.getState('secondaryContent');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getProjectInfo
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get project info from {@link evtviewer.dataHandler.parsedData parsedData}
         * @returns {Object} json object containing project info parsed from edition text
         */
		$scope.getProjectInfo = function() {
			return parsedData.getProjectInfo();
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getWitnessesListFormatted
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get list of witnesses from {@link evtviewer.dataHandler.parsedData parsedData} properly formatted
         * @returns {string} HTML string containing the formatted list of parsed witnesses
         */
		$scope.getWitnessesListFormatted = function() {
			return parsedData.getWitnessesListFormatted();
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getAvailableLists
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get available lists of named entities from {@link evtviewer.dataHandler.parsedData parsedData}
         * @returns {array} array of indexes referring to lists of named entities parsed from edition text
         */
		$scope.getAvailableLists = function() {
			return parsedData.getNamedEntitiesCollection()._indexes;
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getProperty
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get property from {@link evtviewer.interface.evtInterface}
         * @param {string} name name of property to get
         * @returns {any} current value of given property
         */
		$scope.getProperty = function(name) {
			return evtInterface.getProperty(name);
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getState
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get state from {@link evtviewer.interface.evtInterface}
         * @param {string} name name of state property to get
         * @returns {any} current value of given state property
         */
		$scope.getState = function(name) {
			return evtInterface.getState(name);
		};
      /**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getWebSite
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get the external web site of the edition.
         * Add 'http://' if not included in path.
         * @returns {string} URL of external web site of edition
         */
      $scope.getWebSite= function() {
         var webSite = evtInterface.getProperty('webSite');
         return webSite.indexOf('http://') < 0 ? 'http://' + webSite : webSite;
      };
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#handleGenericClick
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Handle click on page.
         * - If target is not a directive evt-select, close all opened selects.
         * - If target is not a directive evt-buttonSwitch, close all selects that are not switchers, but are "stand alone" buttons.
         * - If target is not a directive evt-popover, close all opened popover.
         * - If target is a witness selector (selector appearing in collation view), hide it.
         * @param {event} $event click event
         * @todo: Add more cases
         */
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
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#handleKeydownEvent
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Handle a key down event on page.
         * - If keyCode = 27 [ESC], close all opened dialogs
         * @param {event} $event keydown event
         * @todo: Add more cases. Think about creating a dedicated directive
         */
		$scope.handleKeydownEvent = function($event) {
			if ($event.keyCode === 27) {
				evtDialog.closeAll();
			}
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getBookmark
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Generate the bookmark of the current view using information about project
         * (author, title and publisher of the edition) and the current URL,
         * which can contain info about current document, current page, current edition level,
         * current view, current apparatus entry selected and all other data that are saved in the URL during navigation.
         * Information about the project (or the edition) are retrieved from {@link evtviewer.dataHandler.parsedData parsedData}.
         * @returns {string} HTML of the generated bookmark to be compiled and shown to the user.
         */
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
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getErrorMsg
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get the current error generated from the {@link evtviewer.communication.evtCommunication evtCommunication} service.
         * @returns {Object} object representing the current communication error:
         <pre>
			var currentError = {
		        code  : '',
		        title : '',
		        msg   : ''
		    }
         </pre>
         */
		$scope.getErrorMsg = function() {
			return evtCommunication.getError();
		};

		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getAvailableSourcesTexts
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get available sources texts
         * @returns {array} list of available sources texts
         * @author CM
         */
         // Method to get available sources texts
		$scope.getAvailableSourcesTexts = function() {
			return evtInterface.getProperty('availableSourcesTexts');
		};

		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentSourceText
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get the id of the source text shown in the interface.
         * @returns {string} id of the source text shown in the interface
         * @author CM
         */
		$scope.getCurrentSourceText = function() {
			return evtInterface.getState('currentSourceText') ;
		};

		//TODO: add methods for source, quote and analogue?

		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#isApparatusBoxOpen
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Check if the apparatuses box is open
         * @returns {boolean} whether the apparatuses box is opened or not
         * @author CM
         */
		$scope.isApparatusBoxOpen = function() {
			return evtInterface.getState('isApparatusBoxOpen') ;
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#showApparatusesBox
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Check if the apparatuses box should be shown.
         * @returns {boolean} whether the apparatuses box should be shown or not
         * @author CM
         */
		$scope.showApparatusesBox = function() {
			return evtInterface.getState('isApparatusBoxOpen') && evtInterface.getState('currentEdition') === 'critical';
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentVersions
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current versions selected
         * @returns {string} id of current versions selected
         * @author CM
         */
		$scope.getCurrentVersions = function() {
			return evtInterface.getState('currentVersions');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getAvailableVersions
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get available versions
         * @returns {array} list of available versions
         * @author CM
         */
		$scope.getAvailableVersions = function() {
			return evtInterface.getProperty('availableVersions');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#isVersionSelectorActive
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Check if the selector for the versions is active
         * @returns {boolean} whether the selector for the versions is active or not
         * @author CM
         */
		$scope.isVersionSelectorActive = function() {
			return evtInterface.getProperty('versionSelector');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getAllVersionsNumber
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get number of total versions available
         * @returns {number} number of versions available
         * @author CM
         */
		$scope.getAllVersionsNumber = function() {
			return evtInterface.getAllVersionsNumber();
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getVersion
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get description of a given version
         * @param {string} ver id of version to retrieve
         * @returns {string} HTML of given version description to be compiled in UI
         * @author CM
         */
		$scope.getVersion = function(ver) {
			var versionEntries = parsedData.getVersionEntries(),
				versionIds = versionEntries ? versionEntries._indexes : {};
			return (versionIds && versionIds.versionId ? versionIds.versionId[ver] : '');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#addVersion
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Add version in comparing box
         * @param {string} ver id of version to add
         * @author CM
         */
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

		// MAIN MANU ACTIONS
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#openGlobalDialogInfo
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Open Global Dialog containing project info
         */
		$scope.openGlobalDialogInfo = function() {
			evtInterface.updateState('secondaryContent', 'globalInfo');
			evtDialog.openByType('globalInfo');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#openGlobalDialogLists
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Open Global Dialog containing named entities lists
         */
		$scope.openGlobalDialogLists = function() {
			evtInterface.updateState('secondaryContent', 'entitiesList');
			evtDialog.openByType('entitiesList');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#generateBookmark
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Open Global Dialog containing generated bookmark
         */
		$scope.generateBookmark = function() {
			evtInterface.updateState('secondaryContent', 'bookmark');
			evtDialog.openByType('bookmark');
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#downloadXML
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Open (in new window) path to the edition URL
         * @todo: create generic function for edition that are not encoded in XML
         */
		$scope.downloadXML = function() {
			window.open(evtInterface.getProperty('dataUrl'), '_blank');
		};

		// UI Translation
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getAvailableLanguages
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get available languages for interface translation
         * @returns {array} list of languages available for interface translation
         */
		$scope.getAvailableLanguages = function() {
			return evtTranslation.getLanguages();
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#getCurrentLanguage
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Get current selected language
         * @returns {string} id of current selected language
         */
		$scope.getCurrentLanguage = function() {
			return evtTranslation.getCurrentLanguage();
		};
		/**
         * @ngdoc method
         * @name evtviewer.interface.controller:InterfaceCtrl#setLanguage
         * @methodOf evtviewer.interface.controller:InterfaceCtrl
         * @description Change interface translation
         * @param {string} langKey key of new language to set
         */
		$scope.setLanguage = function(langKey) {
			evtTranslation.setLanguage(langKey);
		};

		_console.log('InterfaceCtrl running');
	})

/**
 * @ngdoc directive
 * @module evtviewer.interface
 * @name evtviewer.interface.directive:g
 * @description
 * # g
 * Directive to transform encoded gliph into actual text depending on parsed data about the referenced item
 *
 * @scope
 * @param {string=} ref id of referred element
 *
 * @restrict E
 *
 * @todo Move this directive in a proper file
 * @todo Decide if simply use html content to be compiled
 * (in this case the same HTML will be used for each occurrence of glyph)
 * or if parse the glyph content deeperand use only the character needed.
**/
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
			scope.content = sContent;
		}
	};
});
