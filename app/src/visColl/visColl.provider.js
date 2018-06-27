/**
 * @ngdoc service
 * @module evtviewer.visColl
 * @name evtviewer.visColl.evtViscoll
 * @description 
 * # evtViscoll
 * This provider expands the scope of the
 * {@link evtviewer.visColl.directive:evtViscoll evtViscoll} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires $log
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.select.evtSelect
**/
angular.module('evtviewer.visColl')

.provider('evtViscoll', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentAppEntry = '';
	
	this.$get = function($log, $filter, config, parsedData, evtInterface, evtSelect, evtCommunication, xmlParser, $sce) {
        var visColl     = {},
            collection = {},
            list       = [],
            idx        = 0;
        
        var number = 0;
		
        var destroy = function() {
            var tempId = this.uid;
            // this.$destroy();
            visColl.destroy(tempId);
        };
		// 
        // visColl builder
        // 
        /**
         * @ngdoc method
         * @name evtviewer.visColl.evtViscoll#build
         * @methodOf evtviewer.visColl.evtViscoll
         *
         * @description
         * <p>This method will extend the scope of {@link evtviewer.visColl.directive:evtViscoll evtViscoll} directive 
         * according to selected configurations.</p>
         *
         * @param {Object} scope initial scope of the directive
         *
         * @returns {Object} extended scope:
         */
        visColl.build = function(scope) {
            var currentId  = idx++;
            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            var svgCollection = parsedData.getViscollSvgs();	

			var displayResult = function(){
				var vm = this;
                if (vm.svgCollection.svgs._indexes.length === 3) {
                    for(var item in vm.svgCollection.svgs) {
					    if (vm.svgCollection.svgs[item].hasOwnProperty('textSvg')){
                            var svg = vm.svgCollection.svgs[item].textSvg;
                            vm.totSvg.push(svg);
                        }
                    }
                }
            };
            
            var totSvg = [];

            var count = 0;
            var change = function(){
                var vm = this;
                vm.count++;
            }

            var getTotSvgOuterHTML = function(index) {
                var vm = this;
                if (index !== undefined && vm.totSvg[index] !== undefined) {
                    return vm.totSvg[index].outerHTML;
                } else {
                    return '<span>No data</span>';
                }
            };

            scopeHelper = {
                // Scope expansion
                uid: currentId,
                svgCollection: svgCollection,
                totSvg: totSvg,
                count: count,
                change: change,
                conjoinToImage: conjoinToImage,
                // Functions
                displayResult: displayResult,
                getTotSvgOuterHTML: getTotSvgOuterHTML,
                unit: unit
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        };
		
        visColl.destroy = function(tempId) {
            delete collection[tempId];
        };

        //le varie cose da far fare al provider sono da mettere qua
        return visColl;
    };
});