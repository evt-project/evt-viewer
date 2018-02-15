/**
 * @ngdoc directive
 * @module evtviewer.criticalApparatusEntry
 * @name evtviewer.criticalApparatusEntry.directive:evtWitnessRef
 * @description 
 * # evtWitnessRef
 * Custom element that identifies the sigla of a witness to be used within the critical apparatus entry as an "access point"
 * to the context of a specific reading.
 *
 * @scope
 * @param {string} witness sigla of witness ref to be shown
 * @param {string} scopeWit id of scope witness
 *
 * @restrict E
 * 
 * @requires evtviewer.criticalApparatusEntry.directive:evtCriticalApparatusEntry
 * @requires evtviewer.core.config
 * @requires evtviewer.box.evtBox
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.interface.evtInterface
 *
**/
angular.module('evtviewer.criticalApparatusEntry')

.directive('evtWitnessRef', function(evtCriticalApparatusEntry, evtBox, parsedData, evtInterface, config) {
	return {
		restrict: 'E',
		require: '^?evtCriticalApparatusEntry',
		scope: {
			witness: '@',
			scopeWit: '@'
		},
		transclude: true,
		templateUrl: 'src/criticalApparatusEntry/criticalApparatusEntry.witnessRef.directive.tmpl.html',
		link: function(scope, element, attrs) {
			scope.translationData = {
				witness: scope.witness
			};
			if (scope.scopeWit === scope.witness) {
				scope.title = 'CRITICAL_APPARATUS.WITNESS_REF_CURRENT'; 
			} else {
				scope.title = 'CRITICAL_APPARATUS.WITNESS_REF_OPEN';
			}
			/**
		     * @ngdoc method
		     * @name evtviewer.criticalApparatusEntry.directive:evtWitnessRef#openWit
		     * @methodOf evtviewer.criticalApparatusEntry.directive:evtWitnessRef
		     *
		     * @description
		     * <p>Open the context of a reading of a particular witness, in a particular version of the text.</p>
		     * <p>It checks if there is more than one version of the text, 
		     * and eventually updates the list of visible and available witnesses in version mode.</p>
		     * <p>It opens the "*Collation View Mode*"" and add the selected witness to the list of collated ones,
		     * scrolling the text until the current selected critical apparatus entry and updating the global URL
		     * with information about the new added witness.</p>
		     * <p>It updates the list of visibile and available witnesses for the "*Collation View mode*".</p>
		     *
		     * @author CDP
		     * @author CM
		     */
			scope.openWit = function() {
				var newWit = scope.witness,
					scopeWit = scope.scopeWit;

				if (newWit !== scopeWit) {
					// Check if there is more than one version of the text (@author --> CM)
					if (config.versions.length > 0) {
						var currentVersion = evtInterface.getState('currentVersion'),
							versionWitMap = parsedData.getVersionEntries()._indexes.versionWitMap,
							versionOfSelectedWit;
						for (var i in versionWitMap) {
							if (versionWitMap[i].indexOf(newWit) >= 0) {
								versionOfSelectedWit = i;
							}
						}
						if (currentVersion !== versionOfSelectedWit) {
							evtInterface.updateCurrentVersion(versionOfSelectedWit);
							evtInterface.updateState('currentWits', []);
							evtInterface.updateAvailableWitnessesByVersion(versionOfSelectedWit);
						}

					}
					var witnesses = evtInterface.getState('currentWits'),
						scopeWitnessIndex = witnesses.indexOf(scopeWit);
					if (witnesses.indexOf(newWit) >= 0) {
                        evtInterface.removeWitness(newWit);
					}
					if (scopeWitnessIndex !== undefined) {
						evtInterface.addWitnessAtIndex(newWit, scopeWitnessIndex + 1);
					}
					if (evtInterface.getCurrentView !== 'collation') {
						evtInterface.updateState('currentViewMode', 'collation');
					}
					evtInterface.updateUrl();
					var currentAppId = evtInterface.getState('currentAppEntry') || '';
					if (currentAppId !== '') {
						var newBox = evtBox.getElementByValueOfParameter('witness', newWit);
						if (newBox !== undefined) {
							newBox.scrollToAppEntry(currentAppId);
						}
					}
				}
			};
		}
	};
});