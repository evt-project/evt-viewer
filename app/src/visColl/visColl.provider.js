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
                if (vm.svgCollection.svgs.length === 3) {
                    for(var item in vm.svgCollection.svgs) {
					    if (vm.svgCollection.svgs[item].hasOwnProperty('textSvg')){
                            var svg = vm.svgCollection.svgs[item].textSvg;
                            vm.totSvg.push(svg);
							vm.conjoinToImage();
							vm.unit();
                        }
                    }
                }
            };
            
            var totSvg = [];

            var conjoinToImage = function(){
                var vm = this;
                if(vm.svgCollection.svgs.length && vm.svgCollection.quires.length !== 0 &&
                    vm.svgCollection.svgs.length === vm.svgCollection.quires.length){
                    for (item in svgCollection.quires){
                        if (svgCollection.quires[item].hasOwnProperty('leaves')){
                            for (x in svgCollection.quires[item].leaves){
                                if (svgCollection.quires[item].leaves[x].hasOwnProperty('value')){
                                    for (y in svgCollection.imglist){
                                        if(svgCollection.imglist[y].hasOwnProperty('url')){
                                             if(svgCollection.imglist[y].id.slice(0, -2) === svgCollection.quires[item].leaves[x].value){
                                                for(a in svgCollection.imglist){
                                                    if(svgCollection.imglist[a].hasOwnProperty('url')){
                                                        for(b in svgCollection.imglist){
                                                            if(svgCollection.imglist[b].hasOwnProperty('url')){
                                                                if(svgCollection.imglist[a].id.slice(0, -2) === svgCollection.imglist[b].id.slice(0,-2) &&
                                                                svgCollection.imglist[a].id.substr(length-1) !== svgCollection.imglist[b].id.substr(length-1)){
                                                                    if(svgCollection.imglist[y].value.substr(length-1) === 'v'){
                                                                        svgCollection.imglist[y].conjoin = svgCollection.quires[item].leaves[x].conjoin + '-r';
                                                                    } else {
                                                                        svgCollection.imglist[y].conjoin = svgCollection.quires[item].leaves[x].conjoin + '-v';
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                for(z in svgCollection.imglist){
                                                    if(svgCollection.imglist[z].hasOwnProperty('url')){
                                                        if(svgCollection.imglist[z].id === svgCollection.imglist[y].conjoin){
                                                            svgCollection.imglist[y].conjoinUrl = svgCollection.imglist[z].url;
                                                        }
                                                    }
                                                }

                                            } 
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

			
            var unit = function(){
                var vm = this;
                if(vm.svgCollection.svgs.length && vm.svgCollection.quires.length !== 0 &&
                    vm.svgCollection.svgs.length === vm.svgCollection.quires.length){
                        for (item in svgCollection.svgs){
                            if (svgCollection.svgs[item].hasOwnProperty('textSvg')){
                                for (x in svgCollection.svgs[item].svgLeaves){
                                    for (y in svgCollection.imglist){
                                        if(svgCollection.imglist[y].hasOwnProperty('url')){
                                            if(svgCollection.svgs[item].svgLeaves[x].id===svgCollection.imglist[y].id.slice(0, -2)){
                                                if (svgCollection.svgs[item].svgLeaves[x].img == undefined){
                                                    svgCollection.svgs[item].svgLeaves[x].img = svgCollection.imglist[y].url;
                                                    svgCollection.svgs[item].svgLeaves[x].imgConjoin = svgCollection.imglist[y].conjoinUrl;
                                                } else {
                                                    svgCollection.svgs[item].svgLeaves[x].img2 = svgCollection.imglist[y].url;
                                                    svgCollection.svgs[item].svgLeaves[x].imgConjoin2 = svgCollection.imglist[y].conjoinUrl;
                                                }
                                            }
                                        }
                                        
                                    }
                                }
                            }
                        }
                    }
            };

            var myFunction = function(){
                var vm = this;
                if(vm.svgCollection.svgs.length && vm.svgCollection.quires.length !== 0 &&
                    vm.svgCollection.svgs.length === vm.svgCollection.quires.length){
                        for (item in svgCollection.svgs){
                            if (svgCollection.svgs[item].hasOwnProperty('textSvg')){
                                for (x in svgCollection.svgs[item].svgLeaves){
                                    for (y in svgCollection.imglist){
                                        if(svgCollection.imglist[y].hasOwnProperty('url')){
                                            if(svgCollection.svgs[item].svgLeaves[x].id===svgCollection.imglist[y].id.slice(0, -2)){
                                                if (svgCollection.svgs[item].svgLeaves[x].img == undefined){
                                                    svgCollection.svgs[item].svgLeaves[x].img = svgCollection.imglist[y].url;
                                                    return svgCollection.svgs[item].svgLeaves[x].img;
                                                } else {
                                                    svgCollection.svgs[item].svgLeaves[x].img2 = svgCollection.imglist[y].url;
                                                    return svgCollection.svgs[item].svgLeaves[x].img2;
                                                }
                                            }
                                        }
                                        
                                    }
                                }
                            }
                        }
                    }
            };
            var getTotSvgOuterHTML = function(index) {
                var vm = this;
                if (index && vm.totSvg[index] !== undefined) {
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
                conjoinToImage: conjoinToImage,
                // Functions
                displayResult: displayResult,
                myFunction: myFunction,
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