/**
 * @ngdoc directive
 * @module evtviewer.criticalApparatusEntry
 * @name evtviewer.criticalApparatusEntry.directive:evtWitnessRef
 * @description 
 * # evtWitnessRef
 * TODO: Add description!
 * It require the {@link evtviewer.criticalApparatusEntry.directive:evtCriticalApparatusEntry evtCriticalApparatusEntry} directive.
 * @scope
 * @param {string=} witness sigla of witness ref to be shown
 * @param {string=} scopeWit id of scope witness
 *
 * @restrict E
 * 
 * @require evtviewer.criticalApparatusEntry.directive:evtCriticalApparatusEntry
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
			scope.openWit = function() {
				var newWit = scope.witness,
					scopeWit = scope.scopeWit;

				if (newWit !== scopeWit) {
					// Check if there are more than one version of the text (@author --> CM)
					if (config.versions.length > 0) {
						var currentVersion = evtInterface.getCurrentVersion(),
							versionWitMap = parsedData.getVersionEntries()._indexes.versionWitMap,
							versionOfSelectedWit;
						for (var i in versionWitMap) {
							if (versionWitMap[i].indexOf(newWit) >= 0) {
								versionOfSelectedWit = i;
							}
						}
						if (currentVersion !== versionOfSelectedWit) {
							evtInterface.updateCurrentVersion(versionOfSelectedWit);
							evtInterface.resetCurrentWitnesses();
							evtInterface.updateAvailableWitnessesByVersion(versionOfSelectedWit);
						}

					}
					var witnesses = evtInterface.getCurrentWitnesses(),
						scopeWitnessIndex = witnesses.indexOf(scopeWit);
					if (witnesses.indexOf(newWit) >= 0) {
                        evtInterface.removeWitness(newWit);
					}
					if (scopeWitnessIndex !== undefined) {
						evtInterface.addWitnessAtIndex(newWit, scopeWitnessIndex + 1);
					}
					if (evtInterface.getCurrentView !== 'collation') {
						evtInterface.updateCurrentViewMode('collation');
					}
					evtInterface.updateUrl();
					var currentAppId = evtInterface.getCurrentAppEntry() || '';
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