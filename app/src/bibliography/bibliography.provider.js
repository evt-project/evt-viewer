angular.module('evtviewer.bibliography')

.provider('evtBibliography', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	this.$get = function($log, config, parsedData, evtBibliographyParser, evtHighlight) {
		var bibliography = {},
			collection = {},
			list = [],
			idx = 0;

		var _console = $log.getInstance('bibliography');

		// 
		// Control function
		// 
		var destroy = function() {
			var tempId = this.uid;
			// this.$destroy();
			delete collection[tempId];
			// _console.log('vm - destroy ' + tempId);
		};

		var getFormattedBibl = function(biblId) {
			var vm = this;
			var biblElement = vm.getBibliographicRefById(biblId);
			if (vm.initialSelectedStyle) {
				if (!biblElement.outputs[vm.initialSelectedStyle.label]) {
					evtBibliographyParser.formatResult(vm.initialSelectedStyle.label, biblElement);
				}
				return biblElement.outputs[vm.initialSelectedStyle.label];
			}
			return '';
		};

		var pubblicationType = function(biblId) {
			var vm = this;
			var biblElement = vm.getBibliographicRefById(biblId),
				type = evtBibliographyParser.getType(biblElement);
			type = type ? type : 'unknown';
			return type;
		};

		var isEntryHighlighted = function(entryId) {
			return (evtHighlight.getHighlighted() !== '' && evtHighlight.getHighlighted() === entryId);
		};

		var getBibliographicRefById = function(biblId) {
			return parsedData.getBibliographicRefById(biblId);
		};

		// 
		// Bibliography builder
		// 
		bibliography.build = function(scope) {
			var currentId = scope.id || idx++,
				biblRefsCollection,
				//recupero stili bibliografici
				styles = config.allowedBibliographicStyles || {},
				initialSelectedStyle, 
				selectedSorting,
				biblSortSelectVisibility = true,
				biblSortStyleSelectVisibility = true,
				biblSortOrderSelectVisibility = true,
				sortBy,
				sortOrder,
				selectedSortOrder;

			if (config.defaultBibliographicStyle !== '' && styles[config.defaultBibliographicStyle] !== undefined && styles[config.defaultBibliographicStyle].enabled) {
				initialSelectedStyle = styles[config.defaultBibliographicStyle];
			}
			
			for (var key in styles) {
				if (!initialSelectedStyle && styles[key].enabled && !initialSelectedStyle) {
					initialSelectedStyle = styles[key];
				}
				if (!styles[key].enabled) {
					delete styles[key];
				}
			}
			
			if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

			//controlliamo quali info possiamo usare, in base a quelli mostriamo/nascondiamo elementi
			if (!evtBibliographyParser.bibliographicStyleInfoDetected()) {
				biblSortStyleSelectVisibility = false;
				initialSelectedStyle = '';
			}

			//recupero i criteri di ordinamento (le label)
			sortBy = config.bibliographicEntriesSortBy || {};
			//controlliamo quali info possiamo usare, in base a quelli mostriamo/nascondiamo elementi
			if (!evtBibliographyParser.authorInfoDetected()) {
				delete sortBy.Author;
			}
			if (!evtBibliographyParser.yearInfoDetected()) {
				delete sortBy.Year;
			}
			if (!evtBibliographyParser.titleInfoDetected()) {
				delete sortBy.Title;
			}
			if (!evtBibliographyParser.publisherInfoDetected()) {
				delete sortBy.Publisher;
			}
			if (sortBy && Object.keys(sortBy).length > 0) {
				biblSortSelectVisibility = true;
				//setting the first sorting entry (if existing)
				var firstKey;
				if (typeof sortBy.Author !== 'undefined') {
					firstKey = sortBy.Author;
				} else {
					firstKey = Object.keys(sortBy)[0];
				}
				selectedSorting = sortBy[firstKey];
			} else {
				biblSortSelectVisibility = false;
			}

			//recupero l'ordine per  l'ordinamento (le label)
			sortOrder = config.bibliographySortOrder;
			selectedSortOrder = sortOrder.ASC;
			//se le select per stile/ordinamento sono nascoste, nascondiamo anche quella per il reverse sorting
			if (!biblSortSelectVisibility) {
				biblSortOrderSelectVisibility = false;
			}

			//recupero collezione bibliografica
			biblRefsCollection = parsedData.getBibliographicRefsCollection();

			var scopeHelper = {};

			if (typeof(collection[currentId]) !== 'undefined') {
				return;
			}

			scopeHelper = {
				// expansion
				uid: currentId,
				biblRefsCollection 		  : biblRefsCollection,
				//recupero stili bibliografici
				styles: styles,
				initialSelectedStyle 		  : initialSelectedStyle,
				selectedSorting				  : selectedSorting,
				biblSortStyleSelectVisibility : biblSortStyleSelectVisibility,
				biblSortSelectVisibility 	  : biblSortSelectVisibility,
				biblSortOrderSelectVisibility : biblSortOrderSelectVisibility,
				sortBy 					      : sortBy,
				sortOrder 					  : sortOrder,
				selectedSortOrder 			  : selectedSortOrder,

				// functions
				getFormattedBibl 		: getFormattedBibl,
				pubblicationType 		: pubblicationType,
				isEntryHighlighted 		: isEntryHighlighted,
				getBibliographicRefById : getBibliographicRefById,
				destroy					: destroy
			};

			collection[currentId] = angular.extend(scope.vm, scopeHelper);
			list.push({
				id: currentId
			});

			return collection[currentId];
		};


		//
		// Service function
		// 

		return bibliography;
	};

});