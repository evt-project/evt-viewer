/**
 * @ngdoc service
 * @module evtviewer.buttonSwitch
 * @name evtviewer.buttonSwitch.evtButtonSwitch
 * @description
 * # evtButtonSwitch
 * This provider expands the scope of the
 * {@link evtviewer.buttonSwitch.directive:buttonSwitch buttonSwitch} directive
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires $timeout
 * @requires $log
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.dialog.evtDialog
 * @requires evtviewer.select.evtSelect
 * @requires evtviewer.core.Utils
 * @requires evtviewer.UItools.evtImageTextLinking
 * @requires evtviewer.dataHandler.evtSourcesApparatus
**/
angular.module('evtviewer.buttonSwitch')

.provider('evtButtonSwitch', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	/**
	 * @ngdoc object
	 * @module evtviewer.buttonSwitch
	 * @name evtviewer.buttonSwitch.controller:ButtonSwitchCtrl
	 * @description
	 * # ButtonSwitchCtrl
	 * <p>This is controller for the {@link evtviewer.buttonSwitch.directive:buttonSwitch buttonSwitch} directive. </p>
	 * <p>It is not actually implemented separately but its methods are defined in the
	 * {@link evtviewer.buttonSwitch.evtButtonSwitch evtButtonSwitch} provider
	 * where the scope of the directive is extended with all the necessary properties and methods
	 * according to specific values of initial scope properties.</p>
	 **/
	this.$get = function($q, $timeout, $log, config, baseData, parsedData, evtInterface, evtDialog, evtSelect, Utils, evtImageTextLinking, evtSourcesApparatus, evtBox, evtSearch, evtSearchBox, evtSearchResults, evtSearchResult, evtVirtualKeyboard, evtNavbar) {
		var button    = {},
			collection = {},
			list       = [],
			idx        = 0;

		var _console = $log.getInstance('buttonSwitch');

        /**
	     * @ngdoc method
	     * @name evtviewer.buttonSwitch.controller:ButtonSwitchCtrl#toggleActive
	     * @methodOf evtviewer.buttonSwitch.controller:ButtonSwitchCtrl
	     *
	     * @description
	     * <p>Toggle active state.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.buttonSwitch.evtButtonSwitch evtButtonSwitch} provider file.</p>
	     */
        var toggleActive = function() {
            var vm = this;
            vm.active = !vm.active;
        };
        /**
	     * @ngdoc method
	     * @name evtviewer.buttonSwitch.controller:ButtonSwitchCtrl#setActive
	     * @methodOf evtviewer.buttonSwitch.controller:ButtonSwitchCtrl
	     *
	     * @description
	     * <p>Update active state.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.buttonSwitch.evtButtonSwitch evtButtonSwitch} provider file.</p>
		 *
		 * @param {boolean} state whether the button should be active or not
	     */
        var setActive = function(state) {
            var vm = this;
            vm.active = state;
        };
        /**
	     * @ngdoc method
	     * @name evtviewer.buttonSwitch.controller:ButtonSwitchCtrl#disable
	     * @methodOf evtviewer.buttonSwitch.controller:ButtonSwitchCtrl
	     *
	     * @description
	     * <p>Disable button.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.buttonSwitch.evtButtonSwitch evtButtonSwitch} provider file.</p>
	     */
        var disable = function() {
            var vm = this;
            vm.disabled = true;
        };
        /**
	     * @ngdoc method
	     * @name evtviewer.buttonSwitch.controller:ButtonSwitchCtrl#enable
	     * @methodOf evtviewer.buttonSwitch.controller:ButtonSwitchCtrl
	     *
	     * @description
	     * <p>Enable button.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.buttonSwitch.evtButtonSwitch evtButtonSwitch} provider file.</p>
	     */
        var enable = function() {
            var vm = this;
            vm.disabled = false;
        };
        /**
	     * @ngdoc method
	     * @name evtviewer.buttonSwitch.controller:ButtonSwitchCtrl#disable
	     * @methodOf evtviewer.buttonSwitch.controller:ButtonSwitchCtrl
	     *
	     * @description
	     * <p>Remove instance from saved instances in {@link evtviewer.buttonSwitch.evtButtonSwitch evtButtonSwitch} provider.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.buttonSwitch.evtButtonSwitch evtButtonSwitch} provider file.</p>
	     */
        var destroy = function() {
            var tempId = this.uid;
            delete collection[tempId];
            // _console.log('vm - destroy ' + tempId);
        };

		// GET EVT ICON //
		/**
	     * @ngdoc function
	     * @name evtviewer.buttonSwitch.evtButtonSwitch#disable
	     * @methodOf evtviewer.buttonSwitch.evtButtonSwitch
	     *
	     * @description
	     * <p>[PRIVATE] Get EVT icon class name for a particular icon type.</p>
	     * <p>Handled cases:  **add**, **bookmark**, **color-legend**,
	     * **download**, **download-xml**, **filter**, **filters**, **font-size**, **font-size-minus**,
	     * **font-size-plus**, **font-size-reset**, **heatmap**, **info**, **info-alt**, **itl**,
	     * **language**, **list**, **menu**, **menu-vert**, **mode-imgtxt**, **mode-txttxt**,
	     * **reading-txt**, **mode-collation**, **mode-srctxt**, **mode-versions**, **mode-bookreader**,
	     * **pin**, **pin-off**, **pin-on**, **remove**, **search**, **thumb**, **thumbs**, **thumbnail**.
	     * **thumbnails**, **txt**, **v-align**, **witnesses**, **nextPage**, **beforePage**, **dropNavBar**.</p>
	     * <p>Output icons can be retrieve both from EVT font set of from font-awesome.
	     * If you want to add a custom icon set you should add it among font faces and remember to add the related css file.</p>
	     *
	     * @param {string} icon type of icon.
	     */
		var getIcon = function(icon) {
			var evtIcon = '';
			if (!icon) { return ''; }
			switch (icon.toLowerCase()) {
				case 'add':
					evtIcon = 'icon-evt_add';
					break;
				case 'bookmark':
					evtIcon = 'icon-evt_bookmark';
					break;
            case 'case-sensitive' :
               evtIcon = 'icon-evt_case-sensitive';
               break;
				case 'color-legend':
					evtIcon = 'icon-evt_color-legend';
					break;
            case 'close':
               evtIcon = 'icon-evt_close';
               break;
				case 'download':
					evtIcon = 'fa fa-download'; //TODO: add icon in EVT font
					break;
				case 'download-xml':
					evtIcon = 'fa fa-file-code-o'; //TODO: add icon in EVT font
					break;
            case 'exact-word':
               evtIcon = 'icon-evt_exact-match';
               break;
				case 'filter':
				case 'filters':
					evtIcon = 'icon-evt_filter';
					break;
				case 'font-size':
					evtIcon = 'icon-evt_font-size';
					break;
				case 'font-size-minus':
					evtIcon = 'icon-evt_font-size-minus-alt';
					break;
				case 'font-size-plus':
					evtIcon = 'icon-evt_font-size-plus-alt';
					break;
				case 'font-size-reset':
					evtIcon = 'icon-evt_font-size-reset-alt';
					break;
				case 'heatmap':
					evtIcon = 'icon-evt_heatmap-alt';
					break;
				case 'info':
					evtIcon = 'icon-evt_info';
					break;
				case 'info-alt':
					evtIcon = 'icon-evt_info-alt';
					break;
				case 'itl':
					evtIcon = 'icon-evt_link';
					break;
				case 'keyboard':
					evtIcon = 'icon-evt_keyboard';
					break;
				case 'hts':
					evtIcon = 'icon-evt_hts';
					break;
				case 'language':
					evtIcon = 'fa fa-language'; //TODO: add icon in EVT font
					break;
				case 'list':
					evtIcon = 'icon-evt_list';
					break;
				case 'list-alt':
					evtIcon = 'fa fa-list-alt';
					break;
				case 'menu':
				case 'menu-vert':
					evtIcon = 'icon-evt_more-vert';
					break;
				case 'mode-imgtxt':
					evtIcon = 'icon-evt_imgtxt';
					break;
				case 'mode-txttxt':
					evtIcon = 'icon-evt_txttxt';
					break;
				case 'reading-txt':
					evtIcon = 'icon-evt_txt';
					break;
				case 'mode-collation':
					evtIcon = 'icon-evt_collation';
					break;
				case 'mode-srctxt':
					evtIcon = 'iconbis-evt_srctxt';
					break;
				case 'mode-versions':
					evtIcon = 'iconbis-evt_versions';
					break;
				case 'mode-viscoll':
					evtIcon = 'iconbis-evt_srctxt';
					break;
				case 'mode-bookreader':
					evtIcon = 'icon-evt_bookreader';
					break;
				case 'next':
					evtIcon = 'icon-evt_next';
					break;
				case 'pin':
					evtIcon = 'icon-evt_pin-alt-on';
					break;
				case 'pin-off':
					evtIcon = 'icon-evt_pin-off';
					break;
				case 'pin-on':
					evtIcon = 'icon-evt_pin-on';
					break;
				case 'previous':
					evtIcon = 'icon-evt_previous';
					break;
				case 'remove':
					evtIcon = 'icon-evt_close';
					break;
				case 'search':
					evtIcon = 'icon-evt_search';
					break;
				case 'search-advanced':
					evtIcon = 'icon-evt_advanced-search';
					break;
				case 'search-results-hide':
					evtIcon = 'icon-evt_search-results-close';
					break;
				case 'search-results-show':
					evtIcon = 'icon-evt_search-results-open';
               break;
// Commented because related to the thumbnail button not working
					/*
				case 'thumb':
				case 'thumbs':
				case 'thumbnail':
				case 'thumbnails':
					evtIcon = 'icon-evt_thumbnails';
					break;*/
				case 'txt':
					evtIcon = 'icon-evt_txt';
					break;
				case 'v-align':
					evtIcon = 'icon-evt_align';
					break;
				case 'witnesses':
					evtIcon = 'icon-evt_books';
					break;
            case 'zoom-in':
               evtIcon = 'icon-evt_zoom-in';
               break;
            case 'zoom-out':
               evtIcon = 'icon-evt_zoom-out';
               break;
            case 'zoom-reset':
               evtIcon = 'icon-evt_zoom-reset';
               break;
				case 'next-page':
					evtIcon = 'fa fa-caret-right';
					break;
				case 'prev-page':
					evtIcon = 'fa fa-caret-left';
					break;
				case 'first-page':
					evtIcon = 'fa fa-step-backward';
					break;
				case 'last-page':
					evtIcon = 'fa fa-step-forward';
					break;
				case 'hide-bar':
					evtIcon = 'fa fa-caret-down';
					break;
				case 'show-bar':
					evtIcon = 'fa fa-caret-up';
					break;
				case 'thumb-nails':
					evtIcon = 'fa fa-th';
					break;
				case 'viscoll':
					evtIcon = 'fa fa-stack-overflow';
					break;
			}
			return evtIcon;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.buttonSwitch.evtButtonSwitch#build
	     * @methodOf evtviewer.buttonSwitch.evtButtonSwitch
	     *
	     * @description
	     * <p>This method will extend the scope of {@link evtviewer.buttonSwitch.directive:buttonSwitch buttonSwitch} directive
	     * according to selected configurations and parsed data.</p>
	     * <p>According to <code>type</code> it will set the output icon (if present), the icon position,
	     * the button type ('*standAlone*', that will not be connected to other switchers, and '*default*')
	     * and define the callback function to be used the user clicks on it.</p>
		 * <p>Handled types are: <ul>
		 * 		<li>'*addWit*': open selector of available witnesses to add a witness in collation view;</li>
		 * 		<li>'*alignReadings*': *callback not handled*; </li>
		 * 		<li>'*bookmark*': open bookmark dialog;</li>
		 * 		<li>'*changeViewMode*': change view mode;</li>
		 * 		<li>'*colorLegend*': open color legend for filters in scope parent box; </li>
		 * 		<li>'*closeDialog*': close scope parent dialog; </li>
		 * 		<li>'*closePinned*': close pinned panel; </li>
		 * 		<li>'*download-xml*': download XML edition source; </li>
		 * 		<li>'*fontSizeDecrease*', '*fontSizeIncrease*', '*fontSizeReset*': decrease, increase, reset font size in scope parent box;</li>
		 * 		<li>'*fontSizeTools*': open font size tools in scope parent box, </li>
		 * 		<li>'*front*': open front in scope parent box;</li>
		 * 		<li>'*heatmap*': activate Heat Map in scope parent box;</li>
		 * 		<li>'*itl*': activate Image Text linking;</li>
		 * 		<li>'*mainMenu*': open main global menu; </li>
		 * 		<li>'*openGlobalDialogInfo*': open global dialog for information about the edition;</li>
		 * 		<li>'*openGlobalDialogWitnesses*': open global dialog with list of witnesses;</li>
		 * 		<li>'*openGlobalDialogLists*': open global dialog with lists; </li>
		 * 		<li>'*pin*', '*pin-on*', '*pin-off*': handle pin on element;</li>
		 * 		<li>'*removeWit*': remove witness from collation view;</li>
		 * 		<li>'*searchInEdition*': activate search in Edition;</li>
		 * 		<li>'*searchInWit*': activate search in witness;</li>
		 * 		<li>'*share*': share link of current state of edition;</li>
		 * 		<li>'*toggleInfoWit*': open/close info Top Box on witness box; </li>
		 * 		<li>'*toggleFilterApp*': open/close filters box on scope parent box;</li>
		 * 		<li>'*togglePinned*': toggle pinned element;</li>
		 * 		<li>'*witList*': show list of witnesses in scope parent box;</li>
		 * 		<li>'*toggleInfoSrc*': open/close information box about source;</li>
		 * 		<li>'*addVer*': open selector of available witnesses to add a version in text-version view;</li>
		 * 		<li>'*removeVer*': remove version from view;</li>
		 * 		<li>'*cropText*': crop text.</li>
		 *		   <li>'*nextPage*': next page.</li>
		 *		   <li>'*beforePage*': before page.</li>
		 *		   <li>'*firstPage*': first page.</li>
		 *		   <li>'*lastPage*': last page.</li>
		 *		   <li>'*hideBar*': hide navBar.</li></ul></p>
		 * <p>To see details of callback function just open the file and read.</p>
		 * <p>You can add your own type of button, if the same button used in different places should always have the same behaviour.</p>
		 * <p>You can also overwrite the call back to trigger event with <code>ng-click</code> directive</p>
		 * <pre><button-switch ng-click="myCustomCallback()"></button-switch></pre>
		 *
		 * @param {Object} scope initial scope of the directive:
		 	<pre>
				var scope: {
		            title : '@',
		            label : '@',
		            icon  : '@',
		            type  : '@',
		            value : '@',
		            iconPos : '@'
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
					currentId,
					currentType,
					title,
					label,
					icon,
					iconPos,
					type,
					value,
					active,
					disabled,

					btnType,

					// function
					callback,
					doCallback,
					fakeCallback,
					toggleActive,
					setActive,
					disable,
					enable,
					destroy
				};
		 	</pre>
	     */
		button.build = function(scope, vm) {
			var currentId = scope.id || idx++,
				currentType = scope.type || 'default',
				title = scope.title || '',
				label = scope.label || '',
				icon = getIcon(scope.icon) || '',
				iconPos = scope.iconPos || 'right',
				type = scope.type || '',
				value = scope.value || '',
				active = scope.active || false,
				disabled = scope.disabled || false,
				btnType = scope.btnType || '',
                callback = function() { console.log('TODO ' + type); },
                fakeCallback = function() {};
			var scopeHelper = {};

			// SET CALLBACK //
			switch (type) {
				case 'addWit':
					btnType = 'standAlone';
					callback = function() {
						evtInterface.updateProperty('witnessSelector', true);
						scope.vm.active = false;
					};
					break;
				case 'alignReadings':
					break;
				case 'bookmark':
					callback = function() {
						var vm = this;
						evtInterface.updateState('secondaryContent', 'bookmark');
						evtDialog.openByType('bookmark');
						vm.active = !vm.active;
					};
					break;
				case 'changeViewMode':
					btnType = 'standAlone';
                    callback = function() {
                        var vm = this;
                        if (vm.value !== undefined) {
                            if (vm.value === 'srcTxt') {
                                var sourceId = evtInterface.getState('currentSourceText') ;
                                evtInterface.updateCurrentSourceText(sourceId);
                            }
                            evtInterface.updateState('currentViewMode', vm.value);
                            evtInterface.updateUrl();
							if (evtInterface.getToolState('ITL') === 'active') {
								if (vm.value === 'imgTxt') {
									evtImageTextLinking.activateITL();
								} else {
									evtImageTextLinking.deactivateITL();
								}
							}
                        }
                    };
					break;
				case 'colorLegend':
					btnType = 'toggler';
					callback = function() {
						var parentBox = scope.$parent.vm;
						if (parentBox.getState('topBoxOpened') && parentBox.getState('topBoxContent') === 'colorLegend') {
							parentBox.toggleTopBox();
						} else {
							var appFilters = parsedData.getCriticalEntriesFiltersCollection(),
								content = '';
							if (appFilters.length > 0) {
								content += '<div class="colorLegend">';
								for (var filter in appFilters.filters) {
									var filterObj = appFilters.filters[filter],
										values = '';
									for (var value in filterObj.values) {
										var valueName = filterObj.values[value].name,
											valueColor = '<i class="colorLegend-filter-color" style="background:' + filterObj.values[value].color + '"></i>';
										values += '<span class="colorLegend-filter-value">' + valueColor + valueName + '</span>';
									}
									if (values !== '') {
										content += '<span class="colorLegend-filter-name">' + filter + '</span>' + values;
									}
								}
								content += '</div>';
							} else {
								content = '<span>No filters available</span>';
							}
							var newTopBoxContent = content || '<span class="errorMsg">{{ \'MESSAGES.GENERIC_ERROR\' | translate }}</span>';
							parentBox.updateTopBoxContent(newTopBoxContent);
							parentBox.updateState('topBoxContent', 'colorLegend');
							if (!parentBox.getState('topBoxOpened')) {
								parentBox.toggleTopBox();
							}
						}
					};
					fakeCallback = function() {
						var parentBox = scope.$parent.vm;
						parentBox.updateState('topBoxOpened', false);
					};

					//TODO: toggle buttons already active in same box -> PROVIDER NEEDED!!
					break;
				case 'closeDialog':
					callback = function() {
                        var vm = this;
                        evtDialog.closeAll();
                        evtInterface.updateState('secondaryContent', '');
                        vm.active = !vm.active;
                    };

                    break;
				case 'closePinned':
                    callback = function() {
						evtInterface.toggleState('isPinnedAppBoardOpened') ;
					};
					break;
				case 'download-xml':
					callback = function() {
						window.open(config.dataUrl, '_blank');
					};
					break;
				case 'fontSizeDecrease':
					btnType = 'standAlone';
					callback = function() {
						var vm = this;
						scope.$parent.vm.fontSizeDecrease();
						vm.active = !vm.active;
					};
					break;
				case 'fontSizeIncrease':
					btnType = 'standAlone';
					callback = function() {
						var vm = this;
						scope.$parent.vm.fontSizeIncrease();
						vm.active = !vm.active;
					};
					break;
				case 'fontSizeReset':
					btnType = 'standAlone';
					callback = function() {
						var vm = this;
						scope.$parent.vm.fontSizeReset();
						vm.active = !vm.active;
					};
					break;
				case 'fontSizeTools':
					callback = function() {
						var zoomState = scope.$parent.vm.getState('fontSizeBtn') || false;
						scope.$parent.vm.updateState('fontSizeBtn', !zoomState);
					};
					fakeCallback = function() {
						scope.$parent.vm.updateState('fontSizeBtn', false);
					};
					break;
				case 'front':
					btnType = 'standAlone';
					callback = function() {
						var parentBox = scope.$parent.vm;
						if (parentBox.getState('topBoxOpened') && parentBox.getState('topBoxContent') === 'front') {
							parentBox.toggleTopBox();
						} else {
							var content;
							var currentDocument = evtInterface.getState('currentDoc');
							if (currentDocument) {
								var docObj = parsedData.getDocument(currentDocument),
									docFront = docObj ? docObj.front : undefined;

								content = docFront && docFront.parsedContent ? docFront.parsedContent : '<div class="warningMsg">{{ \'MESSAGES.FRONT_NOT_AVAILABLE\' | translate }}</div>';
								scope.$parent.vm.updateTopBoxContent(content);
								scope.$parent.vm.toggleTopBox();
							}
							var newTopBoxContent = content || '<span class="errorMsg">{{ \'MESSAGES.GENERIC_ERROR\' | translate }}</span>';
							parentBox.updateTopBoxContent(newTopBoxContent);
							parentBox.updateState('topBoxContent', 'front');
							if (!parentBox.getState('topBoxOpened')) {
								parentBox.toggleTopBox();
							}
						}
					};
					fakeCallback = function() {
						var parentBox = scope.$parent.vm;
						parentBox.updateState('topBoxOpened', false);
					};
					break;
				case 'msDesc':
				    btnType = 'standAlone';
				    callback = function() {
				        var parentBox = scope.$parent.vm;
				        var topBox=document.getElementsByClassName('box-top-box');
				        topBox[0].setAttribute('id','msDesc');
						if (parentBox.getState('topBoxOpened') && parentBox.getState('topBoxContent') === 'msDesc') {
							parentBox.toggleTopBox();
						} else {
							var content;
							var currentDocument = evtInterface.getState('currentDoc');
							if (currentDocument) {
								content = parsedData.getProjectInfo().msDesc ? parsedData.getProjectInfo().msDesc : '<div class="warningMsg">{{ \'MESSAGES.FRONT_NOT_AVAILABLE\' | translate }}</div>';
								scope.$parent.vm.updateTopBoxContent(content);
								scope.$parent.vm.toggleTopBox();
							}
							var newTopBoxContent = content || '<span class="errorMsg">{{ \'MESSAGES.GENERIC_ERROR\' | translate }}</span>';
							parentBox.updateTopBoxContent(newTopBoxContent);
							parentBox.updateState('topBoxContent', 'msDesc');
							if (!parentBox.getState('topBoxOpened')) {
								parentBox.toggleTopBox();
							}
						}
				    };
				    fakeCallback = function() {
						var parentBox = scope.$parent.vm;
						parentBox.updateState('topBoxOpened', false);
					};
				    break;
				case 'heatmap':
					btnType = 'standAlone';
					callback = function() {
						var heatMapState = scope.$parent.vm.getState('heatmap') || false;
						scope.$parent.vm.updateState('heatmap', !heatMapState);
					};
					break;
				case 'itl':
					active = evtInterface.getToolState('ITL') === 'active';
					btnType = 'standAlone';
					callback = function() {
						var vm = this;
						if (vm.active) { // Activate ITL
							evtImageTextLinking.turnOnITL();
						} else { // Deactivate ITL
							evtImageTextLinking.turnOffITL();
						}
					};
					break;
					case 'hts':
					active = evtInterface.getToolState('HTS') === 'active';
					btnType = 'standAlone';
					callback = function() {
						var vm = this;
						if (vm.active) {
							evtImageTextLinking.turnOnHTS();
						} else {
							evtImageTextLinking.turnOffHTS();
						}
					};
					break;
				case 'mainMenu':
					btnType = 'standAlone';
					callback = function() {
						var mainMenuState = evtInterface.getState('mainMenu');
						evtInterface.updateState('mainMenu', !mainMenuState);
					};
					break;
				case 'openEntity':
					callback = function() {
						var vm = this;
						vm.active = !vm.active;
					};
					break;
				case 'openGlobalDialogInfo':
					callback = function() {
						var vm = this;
						evtInterface.updateState('secondaryContent', 'globalInfo');
						evtDialog.openByType('globalInfo');
						vm.active = !vm.active;
					};
					break;
				case 'openGlobalDialogWitnesses':
					callback = function() {
						var vm = this;
						evtInterface.updateState('secondaryContent', 'witnessesList');
						evtDialog.openByType('witnessesList');
						vm.active = !vm.active;
					};
					break;
				case 'openGlobalDialogLists':
					callback = function() {
						var vm = this;
						evtInterface.updateState('secondaryContent', 'entitiesList');
						evtDialog.openByType('entitiesList');
						vm.active = !vm.active;
					};
					break;
				case 'openToc':
					btnType = 'standAlone';
					callback = function() {
						var vm = this;
						evtInterface.updateState('secondaryContent', 'toc');
						evtDialog.openByType('toc');
						vm.active = !vm.active;
					};
					break;
				/*case 'msDesc':
				    callback= function() {
				        var doc=evtInterface.getState('currentDoc');
				         var docElements = xmlParser.parse(doc);
                         if (docElements.documentElement.nodeName === 'TEI'){
                             console.log("dE "+docElements);
				             //evtProjectInfoParser.msDescription(docElements);
                         }
				    };
				    break;*/
				case 'pin':
				case 'pin-on':
				case 'pin-off':
					callback = function() {  };
					break;
				case 'removeWit':
					callback = function() {
						var wit = scope.$parent.vm.witness;
						evtInterface.removeWitness(wit);
						evtInterface.updateUrl();
					};
					break;
            case 'search':
               callback = function() {
                  var parentBoxId = scope.$parent.id,
                     inputValue = evtSearchBox.getInputValue(parentBoxId),
                     input,
                     placeholder = '';

                  evtSearchResult.setPlaceholder(parentBoxId, placeholder);
                  evtSearchBox.setSearchedTerm(parentBoxId, inputValue);

                  input = {
                     '': function() {
                        placeholder = 'Enter your query in the search box above';
                        evtSearchResult.setVisibleRes(parentBoxId, []);
                        evtSearchResult.setPlaceholder(parentBoxId, placeholder);
                     },
                     'default': function() {
                        var isCaseSensitive = evtSearchBox.getStatus(parentBoxId, 'searchCaseSensitive'),
                           isExactMatch = evtSearchBox.getStatus(parentBoxId, 'searchExactWord'),
                           results = evtSearchResults.getSearchResults(inputValue, isCaseSensitive, isExactMatch),
                           currentEdition = evtBox.getEditionById(parentBoxId),
                           currentEditionResults = evtSearchResults.getCurrentEditionResults(results, currentEdition),
                           visibleResults = evtSearchResults.getVisibleResults(currentEditionResults);

                        evtSearchResult.setCurrentEditionResults(parentBoxId, currentEditionResults);
                        evtSearchResult.setVisibleRes(parentBoxId, visibleResults);
                     }
                  };

                  (input[inputValue] || input['default'])();

                  evtSearchBox.setStatus(parentBoxId, 'searchResultBox', true);
                  evtSearchBox.hideBtn(parentBoxId, 'searchResultsShow');
                  evtSearchBox.showBtn(parentBoxId, 'searchResultsHide');
                  evtVirtualKeyboard.unselectCurrentKeyboard(button, parentBoxId);
               };
               break;
            case 'searchIndex':
               btnType = 'standAlone';
               disabled = (
                  function() {
                     if(evtInterface.getToolState('isDocumentIndexed') === 'true') {
                        return true;
                     }
                  })();
               active = (
                  function() {
                     if(evtInterface.getToolState('isDocumentIndexed') === 'true') {
                        return false;
                     }
                  }
               )();
               function indexingInProgress() {
                  var deferred = $q.defer();
                  evtInterface.updateState('indexingInProgress', true);
                  setTimeout(function() {
                     deferred.resolve();
                  }, 100);
                  return deferred.promise;
               }
               function indexingCallback() {
                  var promise = indexingInProgress();
                  promise.then(
                     function() {
                        var xmlDocDom = baseData.getXML(),
                           searchToolsBtn,
                           searchIndexBtn;

                        searchIndexBtn = button.getByType('searchIndex')[0];
                        searchIndexBtn.active = false;
                        searchIndexBtn.disable();
                        evtSearch.initSearch(xmlDocDom);
                        evtInterface.setToolStatus('isDocumentIndexed', 'true');

                        searchToolsBtn = button.getByType('searchInternal');
                        for(var z in searchToolsBtn) {
                           searchToolsBtn[z].disabled = false;
                        }

                        evtInterface.updateState('indexingInProgress', false);
                     }
                  );
               }

               callback = function () {
                  if(evtInterface.getToolState('isDocumentIndexed') === 'true') {
                     scope.vm.active = false;
                  }
                  else {
                     return indexingCallback();
                  }
               };
               break;
            case 'searchResultsShow':
               callback = function() {
                  var parentBoxId = scope.$parent.id,
                     placeholder = 'Enter your query in the search box above';

                  evtSearchResult.setPlaceholder(parentBoxId, placeholder);
                  evtSearchBox.updateStatus(parentBoxId, 'searchResultBox');
                  evtSearchBox.hideBtn(parentBoxId, 'searchResultsShow');
                  evtSearchBox.showBtn(parentBoxId, 'searchResultsHide');
                  evtVirtualKeyboard.unselectCurrentKeyboard(button, parentBoxId);
               };
               break;
            case 'searchResultsHide':
               callback = function() {
                  var parentBoxId = scope.$parent.id;

                  evtSearchBox.updateStatus(parentBoxId, 'searchResultBox');
                  evtSearchBox.hideBtn(parentBoxId, 'searchResultsHide');
                  evtSearchBox.showBtn(parentBoxId, 'searchResultsShow');
                  evtVirtualKeyboard.unselectCurrentKeyboard(button, parentBoxId);
               };
               break;
            case 'searchCaseSensitive':
               btnType = 'standAlone';
               callback = function() {
                  var parentBoxId = scope.$parent.id,
                     searchInput = evtSearchBox.getInputValue(parentBoxId);

                  evtSearchBox.updateStatus(parentBoxId, 'searchCaseSensitive');
                  evtSearchResults.highlightSearchResults(parentBoxId, searchInput);
               };
               break;
            case 'searchInternal':
               btnType = 'standAlone';
               disabled = (
                  function() {
                     if(evtInterface.getToolState('isDocumentIndexed') === 'true') {
                        return false;
                     }
                     else {
                        return true;
                     }
                  })();
               var activeCallback = function () {
                  var parentBoxId = scope.$parent.id,
                     searchBoxStatus = evtBox.getState(parentBoxId, 'searchBox');

                  evtBox.updateState(parentBoxId, 'searchBox', !searchBoxStatus);
                  evtSearchBox.closeBox(parentBoxId, 'searchResultBox');
                  evtSearchBox.showBtn(parentBoxId, 'searchResultsShow');
                  evtSearchBox.hideBtn(parentBoxId, 'searchResultsHide');
               };
               callback = function () {
                  if(evtInterface.getToolState('isDocumentIndexed') === 'true') {
                     return activeCallback();
                  }
                  else {
                     scope.vm.active = false;
                  }
               };
               break;
            case 'searchAdvanced':
               btnType = 'standAlone';
               callback = function() {
                  window.alert('Advanced search coming soon!');
               };
               break;
            case 'searchVirtualKeyboard':
               btnType='standAlone';
               callback = function() {
                  var vm = this,
                     parentBoxId = scope.$parent.id,
                     keyboardId = evtVirtualKeyboard.getKeyboardId(parentBoxId),
                     keyboard =  $('#'+keyboardId).getkeyboard(),
                     btnKeyboard = button.getByType('searchVirtualKeyboard');

                  if(keyboard.isOpen || vm.active === false) {
                     keyboard.close();
                  }
                  else {
                     keyboard.reveal();

                     if(btnKeyboard.length > 1) {
                        for(var i in btnKeyboard) {
                           if(btnKeyboard[i].uid !== vm.currentId) {
                              btnKeyboard[i].setActive(false);
                           }
                        }
                     }
                  }
               };
               break;
            case 'searchExactWord':
               btnType = 'standAlone';
               callback = function () {
                  var parentBoxId = scope.$parent.id,
                     searchInput = evtSearchBox.getInputValue(parentBoxId);

                  evtSearchBox.updateStatus(parentBoxId, 'searchExactWord');
                  evtSearchResults.highlightSearchResults(parentBoxId, searchInput);
               };
               break;
            case 'searchPrevResult':
               disabled = true;
               callback = function() {};
               break;
            case 'searchNextResult':
               disabled = true;
               callback = function() {};
               break;
            case 'searchClear':
               btnType = 'standAlone';
               callback = function () {
                  var parentBoxId = scope.$parent.id,
                     inputValue;
                  evtSearchBox.clearInputValue(parentBoxId);
                  inputValue = evtSearchBox.getInputValue(parentBoxId);
                  evtSearchResults.highlightSearchResults(parentBoxId, inputValue);
               };
               break;
				case 'share':
					callback = function() {
						alert(window.location);
					};
					break;
				case 'toggleInfoWit':
					btnType = 'toggler';
					callback = function() {
						var witness = parsedData.getWitness(scope.$parent.vm.witness);
						var newTopBoxContent = witness.description || scope.$parent.vm.topBoxContent;
						scope.$parent.vm.updateTopBoxContent(newTopBoxContent);
						scope.$parent.vm.toggleTopBox();
					};
					fakeCallback = function() {
						scope.$parent.vm.updateState('topBoxOpened', false);
					};
					break;
				case 'toggleFilterApp':
					callback = function() {
						scope.$parent.vm.toggleFilterBox();
					};
					fakeCallback = callback;
					break;
				case 'togglePinned':
					btnType = 'toggler';
					callback = function() {
						evtInterface.toggleState('isPinnedAppBoardOpened') ;
					};
					break;
				case 'witList':
					btnType = 'toggler';
					callback = function() {
						var parentBox = scope.$parent.vm;
						if (parentBox.getState('topBoxOpened') && parentBox.getState('topBoxContent') === 'witList') {
							parentBox.toggleTopBox();
						} else {
							var content = parsedData.getWitnessesListFormatted();
							var newTopBoxContent = content || '<span class="errorMsg">{{ \'MESSAGES.GENERIC_ERROR\' | translate }}</span>';
							parentBox.updateTopBoxContent(newTopBoxContent);
							parentBox.updateState('topBoxContent', 'witList');
							if (!parentBox.getState('topBoxOpened')) {
								parentBox.toggleTopBox();
							}
						}
					};
					fakeCallback = function() {
						var parentBox = scope.$parent.vm;
						parentBox.updateState('topBoxOpened', false);
					};
					//TODO: toggle buttons already active in same box -> PROVIDER NEEDED!!
					break;
                // Case toggleInfoSrc //
                // Button to show/hide the bibliographic reference of the source //
                // currently shown in the source-text view | @author --> CM      //
                case 'toggleInfoSrc':
                    btnType = 'toggler';
                    callback = function(){
                        var source = evtSourcesApparatus.getSource(parsedData.getSource(evtInterface.getState('currentSourceText') ));
                        //Garantire il collegamento del top box content con la fonte corretta, magari aggiungendo un watch nela direttiva
                        //TODO: Ok, ma come funziona per far sì che il top box content venga aggiornato anche nel momento in cui si cambia con il selettore?
												if (source) {
													var newTopBoxContent = source.bibl || scope.$parent.vm.topBoxContent;
													scope.$parent.vm.updateTopBoxContent(newTopBoxContent);
													scope.$parent.vm.toggleTopBox();
												}
                    };
                    fakeCallback = function(){
                        scope.$parent.vm.updateState('topBoxOpened', false);
                    };
                    break;
                case 'addVer':
                    btnType = 'standAlone';
                    callback  = function() {
                        evtInterface.updateProperty('versionSelector', true);
                        scope.vm.active = false;
                    };
                    break;
                case 'removeVer':
                    callback = function(){
                        var ver = scope.$parent.vm.version;
                        evtInterface.removeVersion(ver);
                    };
                    break;
                case 'cropText':
                    btnType = 'toggler';
                    callback = function() {
                        var s = scope.$parent.vm;
                        return s;
                    };
                    break;
                    case 'prevPage':
                    case 'nextPage':
                    case 'firstPage':
                    case 'lastPage':
                       callback = function() {
                          var vm = this;
                          vm.active = false;
                          if (type === 'prevPage') {
                             evtInterface.goToPrevPage();
                          } else if (type === 'nextPage') {
                             evtInterface.goToNextPage();
                          } else if (type === 'firstPage') {
                             evtInterface.goToFirstPage();
                          } else if (type === 'lastPage') {
                             evtInterface.goToLastPage();
                          }
                       };
                       if (type === 'prevPage' || type === 'firstPage') {
                          disabled = evtInterface.isCurrentPageFirst();
                       } else if (type === 'nextPage' || type === 'lastPage') {
                          disabled = evtInterface.isCurrentPageLast();
                       }
                       break;
                       case 'hideBar':
                          callback = function() {
                             var vm = this;
                             var startState = evtInterface.getState('isNavBarOpened');
                             evtInterface.updateState('isNavBarOpened', !startState);
                             vm.active = !vm.active;
                          };
                          break;
                          case 'thumbNails':
                             btnType = 'toggler';
                             callback = function() {
                                var vm = this;
                                evtInterface.updateState('isVisCollOpened', false);
                                var viscollBtn = button.getByType('visColl');
                                if (viscollBtn) {
                                   viscollBtn.forEach(function(btn){ btn.setActive(false) });
                                }
                                var startState = evtInterface.getState('isThumbNailsOpened');
                                evtInterface.updateState('isThumbNailsOpened', !startState);
                             };
                             break;
                             case 'visColl':
                                btnType = 'toggler';
                                callback = function() {
                                   var vm = this;
                                   evtInterface.updateState('isThumbNailsOpened', false);
                                   var thumbNailsBtn = button.getByType('thumbNails');
                                   if (thumbNailsBtn) {
                                      thumbNailsBtn.forEach(function(btn){ btn.setActive(false) });
                                   }
                                   var startState = evtInterface.getState('isVisCollOpened');
                                   evtInterface.updateState('isVisCollOpened', !startState);
                                };
                                break;
                                default:
                                   break;
			}

			/**
		     * @ngdoc method
		     * @name evtviewer.buttonSwitch.controller:ButtonSwitchCtrl#doCallback
		     * @methodOf evtviewer.buttonSwitch.controller:ButtonSwitchCtrl
		     *
		     * @description
		     * <p>Perform the callback associated to button.</p>
		     * <p>Remove "*selected*" class to all buttons that are not "*standAlone*"</p>
			 * <p>This method is defined and attached to controller scope in the
			 * {@link evtviewer.buttonSwitch.evtButtonSwitch evtButtonSwitch} provider file.</p>
		     */
			var doCallback = function() {
				var vm = this;
				if (!vm.disabled || vm.disabled === 'false') {
					button.unselectAllSkipByBtnType(vm.uid, 'standAlone');
					evtSelect.closeAll();
					vm.toggleActive();
					if (vm.callback) {
						vm.callback();
					}
					if (vm.onBtnClicked) {
						vm.onBtnClicked();
					}
				}
			};

			scopeHelper = {
				// expansion
				uid: currentId,
				defaults: angular.copy(defaults),

				// model
				currentId: currentId,
				currentType: currentType,
				title: title,
				label: label,
				icon: icon,
				iconPos: iconPos,
				type: type,
				value: value,
				active: active,
				disabled: disabled,

				btnType: btnType,

				// function
				callback: callback,
				onBtnClicked: scope.onBtnClicked,
				doCallback: doCallback,
				fakeCallback: fakeCallback,
				toggleActive: toggleActive,
				setActive: setActive,
				disable: disable,
				enable: enable,
				destroy: destroy
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
	     * @name evtviewer.buttonSwitch.evtButtonSwitch#getById
	     * @methodOf evtviewer.buttonSwitch.evtButtonSwitch
	     *
	     * @description
	     * Get the reference of the instance of a particular <code>&lt;button-switch&gt;</code>.
		 *
		 * @param {string} currentId id of button to retrieve
		 *
		 * @returns {Object} reference of the instance of <code>&lt;button-switch&gt;</code> with given id
	     */
		button.getById = function(currentId) {
			if (collection[currentId] !== 'undefined') {
				return collection[currentId];
			}
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.buttonSwitch.evtButtonSwitch#getList
	     * @methodOf evtviewer.buttonSwitch.evtButtonSwitch
	     *
	     * @description
	     * Get the list of all the instance of <code>&lt;button-switch&gt;</code>.
		 *
		 * @returns {array} array of ids of all the instance of <code>&lt;button-switch&gt;</code>.
	     */
		button.getList = function() {
			return list;
		};

		button.getByType = function(type) {
		   var buttons = [];
		   for(var i in collection) {
		      if(collection[i].type === type) {
		         buttons.push(collection[i]);
            }
         }
         return buttons;
      };
		/**
	     * @ngdoc method
	     * @name evtviewer.buttonSwitch.evtButtonSwitch#unselectAll
	     * @methodOf evtviewer.buttonSwitch.evtButtonSwitch
	     *
	     * @description
	     * Unselect all buttons instantiated
	     */
		button.unselectAll = function() {
			angular.forEach(collection, function(currentButton) {
				currentButton.setActive(false);
			});
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.buttonSwitch.evtButtonSwitch#unselectAllSkipByBtnType
	     * @methodOf evtviewer.buttonSwitch.evtButtonSwitch
	     *
	     * @description
	     * Unselect all buttons instantiated, skipping those with a certaing id or of a certain type
	     *
	     * @param {string} currentId id of button to skip
	     * @param {string} btnTypes list of types of buttons to skip
	     */
		button.unselectAllSkipByBtnType = function(currentId, btnTypes) {
			angular.forEach(collection, function(currentButton) {
				if (currentButton.uid !== currentId && btnTypes.indexOf(currentButton.btnType) < 0) {
					if (currentButton.active) {
						currentButton.fakeCallback();
					}
					currentButton.setActive(false);
				}
			});
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.buttonSwitch.evtButtonSwitch#selectById
	     * @methodOf evtviewer.buttonSwitch.evtButtonSwitch
	     *
	     * @description
	     * <p>Select button with a certain id.</p>
	     * <p>This function is useful if we want to trigger the selection from an external service/controller.</p>
	     *
	     * @param {string} currentId id of button to select
	     */
		button.selectById = function(currentId) {
			if (collection[currentId] !== 'undefined') {
				collection[currentId].setActive(true);
			}
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.buttonSwitch.evtButtonSwitch#destroy
	     * @methodOf evtviewer.buttonSwitch.evtButtonSwitch
	     *
	     * @description
	     * Remove from collection the reference of a certain button
	     *
	     * @param {string} currentId id of button to remove from collection
	     */
		button.destroy = function(tempId) {
			delete collection[tempId];
		};

		return button;
	};

});
