/**
 * @ngdoc service
 * @module evtviewer.navBar
 * @name evtviewer.navBar.evtNavbar
 * @description 
 * # evtNavbar
 * This provider expands the scope of the
 * {@link evtviewer.navBar.directive:evtNavbar evtNavbar} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires $log
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
**/
angular.module('evtviewer.navBar')

.provider('evtNavbar', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentAppEntry = '';
	
	this.$get = function($log, config, parsedData, evtInterface) {
        var navBar     = {},
            collection = {},
            list       = [],
            idx        = 0;
        
        var number = 0;
		
        var destroy = function() {
            var tempId = this.uid;
            // this.$destroy();
            navBar.destroy(tempId);
        };
		// 
        // navBar builder
        // 
        /**
         * @ngdoc method
         * @name evtviewer.navBar.evtNavbar#build
         * @methodOf evtviewer.navBar.evtNavbar
         *
         * @description
         * <p>This method will extend the scope of {@link evtviewer.navBar.directive:evtNavbar evtNavbar} directive 
         * according to selected configurations.</p>
         *
         * @param {Object} scope initial scope of the directive
         *
         * @returns {Object} extended scope:
         */
        navBar.build = function(scope) {
            var currentId  = idx++;
            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            
			var doc = evtInterface.getState('currentDoc');
			var page = evtInterface.getState('currentPage');
			
            var pagesCollection = parsedData.getPages();
            console.log(pagesCollection);
            
			//var insertPage = parsedData.addPage('currentPage', doc);
			console.log(pagesCollection[length]);
            var pageSlider = {
                value: 0,
                options: {
                    floor: 0,
                    ceil: pagesCollection ? pagesCollection.length : 0,
                }
            };

            var updateOptions = function(options) {
                var vm = this;
                vm.pageSlider.options = options;
            };

            scopeHelper = {
                // Scope expansion
                uid: currentId,
                pageSlider: pageSlider,
				pagesCollection: pagesCollection,
				page: page,
				doc: doc,

                // Functions
                updateOptions: updateOptions,
                destroy: destroy
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        };
		
        navBar.destroy = function(tempId) {
            delete collection[tempId];
        };

        //le varie cose da far fare al provider sono da mettere qua
        return navBar;
    };
});