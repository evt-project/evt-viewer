/**
 * @ngdoc service
 * @module evtviewer.toc
 * @name evtviewer.toc.evtToc
 * @description
 * # evtToc
 * This provider expands the scope of the
 * {@link evtviewer.toc.directive:evtToc evtToc} directive
 * and stores its reference untill the directive remains instantiated.
 * It also add some modules to controller, according to <code>&lt;evt-tabs-container&gt;</code> type.
 *
 * @requires $log
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.interface.evtInterface
**/
angular.module('evtviewer.toc')

.provider('evtToc', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	this.$get = function($log, parsedData, evtInterface) {
		var toc = {},
			collection = {},
			list = [],
			idx = 0;

		var _console = $log.getInstance('toc');

		//
		// Control function
		//
		/**
	     * @ngdoc method
	     * @name evtviewer.evtviewer.toc.controller:TocCtrl#destroy
	     * @methodOf evtviewer.toc.controller:TocCtrl
	     *
	     * @description
	     * <p>Remove instance from saved instances in {@link evtviewer.toc.evtToc evtToc} provider.</p>
         * <p>This method is defined and attached to controller scope in the
         * {@link evtviewer.toc.evtToc evtToc} provider file.</p>
	     */
		var destroy = function() {
            var tempId = this.uid;
            // this.$destroy();
            delete collection[tempId];
            // _console.log('vm - destroy ' + tempId);
        };

		//
		// Toc builder
		//
		/**
	     * @ngdoc method
	     * @name evtviewer.toc.evtToc#build
	     * @methodOf evtviewer.toc.evtToc
	     *
	     * @description
	     * <p>This method will extend the scope of
	     * {@link evtviewer.toc.directive:evtToc evtToc} directive
	     * according to selected configurations and parsed data.</p>
		 *
		 * @param {Object} scope initial scope of the directive:
		 	<pre>
				var scope: {
		            type: '@',
		            orientation: '@'
		        };
		 	</pre>
		 *
		 * @returns {Object} extended scope:
		 	<pre>
				var scopeHelper = {
				};
		 	</pre>
	     */
		toc.build = function(scope) {
			var currentId = idx++;

			var scopeHelper = {};

			if (collection[currentId]) {
				return;
			}
			var	docsId = parsedData.getDocuments()._indexes,
					divs = parsedData.getDivs(),
					mainDivs = parsedData.getDivs()._indexes.main,
					subDivs = parsedData.getDivs()._indexes.subDivs,
					pages = parsedData.getPages(),
					open = {};
			var docs = docsId.map(function(docId) {
				var doc = parsedData.getDocument(docId);
				var newDoc = {
					value: doc.value,
					title: doc.title,
					pages: doc.pages,
					divs: { front: [], body: [], back: [], length: 0 }
				};
				angular.forEach(mainDivs[docId], function(divId) {
					var div = parsedData.getDiv(divId);
					newDoc.divs[div.section].push(divId);
					newDoc.divs.length++;
				});
				open[docId] = false;
				return newDoc;
			});
			scopeHelper = {
				currentId : currentId,
				docs 			: docs,
				docsId 		: docsId,
				divs 			: divs,
				mainDivs  : mainDivs,
				subDivs 	: subDivs,
				pages 		: pages,
				keys			: ['front', 'body', 'back'],
				open 			: open
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

		toc.destroy = function(tempId) {
			delete collection[tempId];
		}

		return toc;
	};

});
