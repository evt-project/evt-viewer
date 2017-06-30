angular.module('evtviewer.apparatuses')

.provider('evtApparatuses', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	var currentApparatuses = '';

	this.$get = function(parsedData, evtInterface, evtVersionReading, evtReading) {
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
			var currentApparatus = scope.currentApparatus || 'Critical Apparatus', //l'apparato selezionato nell'interfaccia
				apparatuses = [],
				appStructure = 'tabs',
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

			if (currentApparatus === 'Critical Apparatus') {
				evtInterface.updateCurrentApparatus('Critical Apparatus');
			}
			/*JSON.stringify(config.apparatusStructure) --> tabs || boxes*/


			if (appList.length > 0) {
				apparatuses.push({
					label: 'Critical Apparatus',
					visibleList: appList.slice(0, 10),
					list: appList
				});
			}
			if (quotesList.length > 0) {
				apparatuses.push({
					label: 'Sources',
					visibleList: quotesList.slice(0, 10),
					list: quotesList
				});
			}
			if (analoguesList.length > 0) {
				apparatuses.push({
					label: 'Analogues',
					visibleList: analoguesList.slice(0, 10),
					list: analoguesList
				});
			}

			var scopeHelper = {
				uid: currentId,
				currentApparatus: currentApparatus,
				apparatuses: apparatuses,
				appStructure: appStructure
			};
			console.log(apparatuses)
			collection[currentId] = angular.extend(scope.vm, scopeHelper);
			list.push({
				id: currentId
			});

			return collection[currentId];
		};

		apparatuses.setCurrentApparatus = function(app) {
			evtInterface.updateCurrentApparatus(app);
			angular.forEach(collection, function(currentApparatuses) {
				currentApparatuses.currentApparatus = app;
			});
		};

		apparatuses.getCurrentApparatus = function() {
			return currentApparatuses.currentApparatus;
		};

		apparatuses.alignScrollToApp = function(appId) {
			console.log('alignScrollToApp', appId);
			for (var i in collection) {
				if (collection[i].scrollToAppEntry !== undefined) {
					collection[i].scrollToAppEntry(appId);
				}
			}
		};

		/*Methods added by CM*/
		/*For the alignment of the apparatuses panel, with the other boxes*/
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