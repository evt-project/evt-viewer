/**
 * @ngdoc object
 * @module evtviewer.interface
 * @name evtviewer.interface.controller:InterfaceCtrl
 * @description 
 * # InterfaceCtrl
 * TODO: Add description and list of dependencies!
**/
angular.module('evtviewer.interface')

	.controller('InterfaceCtrl', function($log, $timeout, $injector, $scope, $route, evtInterface, evtTranslation, evtPinnedElements, evtButtonSwitch, evtBox, evtApparatuses, parsedData, evtSelect, evtPopover, evtCommunication, evtDialog) {
		var _console = $log.getInstance('interface');

		$scope.getCurrentViewMode = function() {
			return evtInterface.getCurrentViewMode();
		};

		$scope.getCurrentPage = function() {
			return evtInterface.getCurrentPage();
		};

		$scope.getCurrentDocument = function() {
			return evtInterface.getCurrentDocument();
		};

		$scope.getCurrentEdition = function() {
			return evtInterface.getCurrentEdition();
		};

		$scope.getAvailableWitnesses = function() {
			return evtInterface.getAvailableWitnesses();
		};

		$scope.isWitnessSelectorActive = function() {
			return evtInterface.getProperty('witnessSelector');
		};

		$scope.addWitness = function(wit) {
			if (wit !== undefined) {
				evtInterface.addWitness(wit);
				evtInterface.updateUrl();
			}
			$timeout(function() {
				var singleBoxWidth = window.getComputedStyle(document.getElementsByClassName('box')[0]).width.replace('px', '');
				document.getElementById('compareWits_box').scrollLeft = singleBoxWidth * (evtInterface.getCurrentWitnesses().length + 1);
			});
			evtInterface.updateProperty('witnessSelector', false);
		};

		$scope.getWitness = function(wit) {
			var desc = wit + ' - ' + parsedData.getWitness(wit).description.textContent.trim() || wit;
			desc = desc.length > 30 ? desc.substr(0, 30) + '...' : desc;
			return desc;
		};

		$scope.getCurrentWitnesses = function() {
			return evtInterface.getCurrentWitnesses();
		};

		$scope.getCurrentWitnessPage = function(wit) {
			return evtInterface.getCurrentWitnessPage(wit);
		};

		$scope.getAvailableViewModes = function() {
			return evtInterface.getAvailableViewModes();
		};

		$scope.existCriticalText = function() {
			return evtInterface.existCriticalText();
		};

		$scope.getCurrentAppEntry = function() {
			return evtInterface.getCurrentAppEntry();
		};

		$scope.updateCurrentAppEntry = function(entry) {
			evtInterface.updateCurrentAppEntry(entry);
			if (evtInterface.getCurrentViewMode() === 'readingTxt') {
				evtBox.alignScrollToApp(entry);
				evtApparatuses.alignScrollToApp(entry);
			}
			evtInterface.updateUrl();
		};

		$scope.updateCurrentQuote = function(quote) {
			evtInterface.updateCurrentQuote(quote);
		};

		$scope.getCurrentApparatus = function() { 
			return evtInterface.getCurrentApparatus(); 
		};
		$scope.evtPinnedElements = evtPinnedElements;

		$scope.isLoading = function() {
			var error = evtCommunication.getError();
			return evtInterface.isLoading() && error.title === '';
		};

		$scope.isPinnedAppBoardOpened = function() {
			return evtInterface.isPinnedAppBoardOpened();
		};

		$scope.isToolAvailable = function(toolName) {
			return evtInterface.isToolAvailable(toolName);
		};

		$scope.getSecondaryContentOpened = function() {
			return evtInterface.getSecondaryContentOpened();
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
			return evtInterface.getAvailableSourcesTexts();
		};

		// Method to get the id the source text viewed in the interface
		$scope.getCurrentSourceText = function() {
			return evtInterface.getCurrentSourceText();
		};

		//TODO: add methods for source, quote and analogue?

		// Method to check if the apparatuses box is open
		$scope.isApparatusBoxOpen = function() {
			return evtInterface.isApparatusBoxOpen();
		};

		$scope.showApparatusesBox = function() {
			return evtInterface.isApparatusBoxOpen() && evtInterface.getCurrentEdition() === 'critical';
		};

		$scope.getCurrentVersions = function() {
			return evtInterface.getCurrentVersions();
		};

		$scope.getAvailableVersions = function() {
			return evtInterface.getAvailableVersions();
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
				document.getElementById('compareVer_box').scrollLeft = singleBoxWidth * (evtInterface.getCurrentVersions().length + 1);
			});
			evtInterface.updateProperty('versionSelector', false);
		};

		// END OF ADDITION //
		
		// MAIN MANU ACTIONS
		$scope.openGlobalDialogInfo = function() {
			evtInterface.updateSecondaryContentOpened('globalInfo');
			evtDialog.openByType('globalInfo');
		};
		
		$scope.openGlobalDialogLists = function() {
			evtInterface.updateSecondaryContentOpened('entitiesList');
			evtDialog.openByType('entitiesList');
		};

		$scope.generateBookmark = function() {
			evtInterface.updateSecondaryContentOpened('bookmark');
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