/**
 * @ngdoc service
 * @module evtviewer.apparatuses
 * @name evtviewer.apparatuses.evtApparatusesProvider
 * @description 
 * # evtApparatusesProvider
 * TODO: Add description and comments for every method
**/
angular.module('evtviewer.apparatuses')

.provider('evtApparatuses', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	var currentApparatuses = '';

	this.$get = function(parsedData, evtInterface) {
		var apparatuses = {},
			collection = {},
			list = [],
			idx = 0;

		apparatuses.build = function(scope) {
			var currentId = idx++;

			if (collection[currentId] !== undefined) {
				return;
			}
			//Aggiungere l'apparato da aprire per configurazione
			//Aggiungere nella configurazione, un array con l'ordine degli apparati
			//E la struttura dei tabs
			var currentApparatus = scope.currentApparatus || 'criticalApparatus', //l'apparato selezionato nell'interfaccia
				apparatuses = {
					_indexes: []
				},
				appStructure = defaults.appStructure,
                appList = [],
				quotesList = [],
				analoguesList = [],
				appEntriesCollection = parsedData.getCriticalEntries(),
				quotesEntries = parsedData.getQuotes(),
				analoguesEntries = parsedData.getAnalogues(); //tutti gli apparati disponibili

			if (appEntriesCollection._indexes.appEntries) {
				for (var i = 0; i < appEntriesCollection._indexes.appEntries.length; i++) {
					var entryId = appEntriesCollection._indexes.appEntries[i];
					if (appEntriesCollection[entryId] && (appEntriesCollection[entryId]._isInMainVersion === undefined || appEntriesCollection[entryId]._isInMainVersion === true)) {
						appList.push(entryId);
					}
				}
			}

			if (quotesEntries._indexes.encodingStructure) {
				for (var j = 0; j < quotesEntries._indexes.encodingStructure.length; j++) {
					var quoteId = quotesEntries._indexes.encodingStructure[j];
					if (quotesEntries[quoteId] && (quotesEntries[quoteId]._isInMainVersion === undefined || quotesEntries[quoteId]._isInMainVersion === true)) {
						quotesList.push(quoteId);
					}
				}
			}

			if (analoguesEntries._indexes.encodingStructure) {
				for (var h = 0; h < analoguesEntries._indexes.encodingStructure.length; h++) {
					var analogueId = analoguesEntries._indexes.encodingStructure[h];
					if (analoguesEntries[analogueId] && (analoguesEntries[analogueId]._isInMainVersion === undefined || analoguesEntries[analogueId]._isInMainVersion === true)) {
						analoguesList.push(analogueId);
					}
				}
			}

			// JSON.stringify(config.apparatusStructure) --> tabs || boxes


			if (!evtInterface.isCriticalApparatusInline() && appList.length > 0) {
				apparatuses.criticalApparatus = {
					label: 'APPARATUSES.CRITICAL_APPARATUS',
					visibleList: appList.slice(0, 10),
					list: appList
				};
				apparatuses._indexes.push('criticalApparatus');
			}
			if (!evtInterface.isSourcesInline() && quotesList.length > 0) {
				apparatuses.sources = {
					label: 'APPARATUSES.SOURCES',
					visibleList: quotesList.slice(0, 10),
					list: quotesList
				};
				apparatuses._indexes.push('sources');
			}
			if (!evtInterface.isAnaloguesInline() && analoguesList.length > 0) {
				apparatuses.analogues = {
					label: 'APPARATUSES.ANALOGUES',
					visibleList: analoguesList.slice(0, 10),
					list: analoguesList
				};
				apparatuses._indexes.push('analogues');
			}

			if (apparatuses._indexes.length > 0) {
				evtInterface.updateCurrentApparatus(apparatuses._indexes[0]);
			}

			var scopeHelper = {
				isLoading: true,
				uid: currentId,
				currentApparatus: apparatuses._indexes.length > 0 ? apparatuses._indexes[0] : '',
				apparatuses: apparatuses,
				appStructure: appStructure
			};
			collection[currentId] = angular.extend(scope.vm, scopeHelper);
			list.push({
				id: currentId
			});

			return collection[currentId];
		};

		apparatuses.setCurrentApparatus = function(app) {
			evtInterface.updateCurrentApparatus(app);
			currentApparatuses.currentApparatus = app;
			angular.forEach(collection, function(currentApparatuses) {
				currentApparatuses.setCurrentApparatus(app);
			});
		};

		apparatuses.getCurrentApparatus = function() {
			return currentApparatuses.currentApparatus;
		};

		apparatuses.alignScrollToApp = function(appId) {
			for (var i in collection) {
				if (collection[i].scrollToAppEntry !== undefined) {
					collection[i].scrollToAppEntry(appId);
				}
			}
		};

		// Methods added by CM //
		// For the alignment of the apparatuses panel, with the other boxes
		apparatuses.alignScrollToQuote = function(quoteId, segId) {
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

		apparatuses.alignScrollToAnalogue = function(analogueId) {
			for (var i in collection) {
				if (collection[i].scrollToAnaloguesEntry !== undefined) {
					collection[i].scrollToAnaloguesEntry(analogueId);
				}
			}
		};

		apparatuses.destroy = function(tempId) {
			delete collection[tempId];
		};

		apparatuses.unselectAllCriticalElements = function() {
			//
		};

		return apparatuses;
	};
});