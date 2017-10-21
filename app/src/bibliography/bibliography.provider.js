/**
 * @ngdoc service
 * @module evtviewer.bibliography
 * @name evtviewer.bibliography.evtBibliography
 * @description
 * # evtBibliography
 * Provider that will manage all instances of {@link evtviewer.bibliography.directive:evtBibliography evtBibliography} directive.
 *
 * @requires $log
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtBibliographyParser
 * @requires evtviewer.bibliography.evtHighlight
 *
 * @author MR
**/
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
		/**
	     * @ngdoc method
	     * @name evtviewer.bibliography.controller:BibliographyCtrl#getFormattedBibl
	     * @methodOf evtviewer.bibliography.controller:BibliographyCtrl
	     *
	     * @description
	     * <p>This method will retrieve from {@link evtviewer.dataHandler.parsedData parsedData}
	     * the bibliographic entry with the given id and will return the output for
	     * the selected bibliographic style or the plain text (if styles are not allowed).
	     * If the output for the selected style has not been generated yet, it will use
	     * {@link evtviewer.dataHandler.evtBibliographyParser#formatResult formatResult} to generate it.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.bibliography.evtBibliography evtBibliography} provider file.</p>
		 *
		 * @param {string} biblId id of bibliographic reference to handle
		 *
		 * @returns {string} HTML string representing the output of the bibliographic referenec
		 *
		 * @author MR
	     */
		var getFormattedBibl = function(biblId) {
			var vm = this;
			var biblElement = vm.getBibliographicRefById(biblId);
			if (vm.initialSelectedStyle) {
				if (!biblElement.outputs[vm.initialSelectedStyle.label]) {
					evtBibliographyParser.formatResult(vm.initialSelectedStyle.label, biblElement);
				}
				if (biblElement.outputs[vm.initialSelectedStyle.label]) {
					return biblElement.outputs[vm.initialSelectedStyle.label];
				} else {
					return biblElement.plainText;
				}
			}
			return biblElement.plainText;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.bibliography.controller:BibliographyCtrl#pubblicationType
	     * @methodOf evtviewer.bibliography.controller:BibliographyCtrl
	     *
	     * @description
	     * <p>This method will retrieve the type of the bibliographic entry using the method
	     * {@link evtviewer.dataHandler.evtBibliographyParser#getType getType} defined in
	     * {@link evtviewer.dataHandler.evtBibliographyParser evtBibliographyParser} service.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.bibliography.evtBibliography evtBibliography} provider file.</p>
		 *
		 * @param {string} biblId id of bibliographic reference to handle
		 *
		 * @returns {string} type of given entry
		 *
		 * @author MR
	     */
		var pubblicationType = function(biblId) {
			var vm = this;
			var biblElement = vm.getBibliographicRefById(biblId),
				type = evtBibliographyParser.getType(biblElement);
			type = type ? type : 'unknown';
			return type;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.bibliography.controller:BibliographyCtrl#isEntryHighlighted
	     * @methodOf evtviewer.bibliography.controller:BibliographyCtrl
	     *
	     * @description
	     * <p>This method will check whether the given entry should be highlighted or not.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.bibliography.evtBibliography evtBibliography} provider file.</p>
		 *
		 * @param {string} entryId id of bibliographic reference to handle
		 *
		 * @returns {boolean} whether the entry should be highlighted or not
		 *
		 * @author MR
	     */
		var isEntryHighlighted = function(entryId) {
			return (evtHighlight.getHighlighted() !== '' && evtHighlight.getHighlighted() === entryId);
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.bibliography.controller:BibliographyCtrl#getBibliographicRefById
	     * @methodOf evtviewer.bibliography.controller:BibliographyCtrl
	     *
	     * @description
	     * <p>This method will retrieve the bibliographic entry from {@link evtviewer.dataHandler.parsedData parsedData}.</p>
		 * <p>This method is defined and attached to controller scope in the
		 * {@link evtviewer.bibliography.evtBibliography evtBibliography} provider file.</p>
		 *
		 * @param {string} entryId id of bibliographic reference to handle
		 *
		 * @returns {Object} JSON object representing the bibliographic entry, structure as follows:
			 <pre>
	            var newBiblElement = {
	                id: '',
	                type: '',
	                author: [],
	                titleAnalytic: '',
	                titleMonogr: '',
	                editionMonogr: '',
	                date: '',
	                editor: [],
	                publisher: '',
	                pubPlace: '',
	                biblScope: {},
	                note: {},
	                idno: {},
	                outputs: {},
	                plainText: ''
	            };
	        </pre>
		 * For more information about this object, please see {@ evtviewer.dataHandler.evtBibliographyParser#extractInfo extractInfo}.
		 * @author MR
	     */
		var getBibliographicRefById = function(biblId) {
			return parsedData.getBibliographicRefById(biblId);
		};

		//
		// Bibliography builder
		//
		/**
	     * @ngdoc method
	     * @name evtviewer.bibliography.evtBibliography#build
	     * @methodOf evtviewer.bibliography.evtBibliography
	     *
	     * @description
	     * <p>This method will extend the scope of {@link evtviewer.bibliography.directive:evtBibliography evtBibliography} directive
	     * according to selected configurations and parsed data.
	     * - It sets the available list of styles depending on available bibliographic styles retrieved from configurations;
	     * - It sets the default selected style depending on default parameter retrieved from configurations;
	     * - It checks which tools (style selection and ordering) to use, according to data parsed;
	     * - It eventually retrieves the parameters available for the ordering;
	     * - It retrieves the bibliographic entries from {@link evtviewer.dataHandler.parsedData parsedData};
	     * - It finally extend the scope, stores a reference of each directive instance and returns the extended scope.</p>
		 *
		 * @param {Object} scope initial scope of the directive:
		 	<pre>
				var scope = {
		            id : '@'
		        };
		 	</pre>
		 *
		 * @returns {Object} extended scope:
		 	<pre>
				var scopeHelper = {
					// expansion
					uid,
					biblRefsCollection,
					styles,
					initialSelectedStyle,
					selectedSorting,
					biblSortStyleSelectVisibility,
					biblSortSelectVisibility,
					biblSortOrderSelectVisibility,
					sortBy,
					sortOrder,
					selectedSortOrder,
					// functions
					getFormattedBibl,
					pubblicationType,
					isEntryHighlighted,
					getBibliographicRefById
				};
		 	</pre>
		 *
		 * @author MR
	     */
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
				var firstKey = Object.keys(sortBy)[0];
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
				getBibliographicRefById : getBibliographicRefById
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
		/**
	     * @ngdoc method
	     * @name evtviewer.bibliography.evtBibliography#destroy
	     * @methodOf evtviewer.bibliography.evtBibliography
	     *
	     * @description
	     * Delete the reference of the instance of a particular <code>&lt;evt-bibliography&gt;</code>
		 *
         * @param {string} tempId id of <code>&lt;evt-bibliography&gt;</code> to destroy
		 *
		 * @author MR
	     */
		bibliography.destroy = function(tempId) {
			delete collection[tempId];
		};

		return bibliography;
	};

});
