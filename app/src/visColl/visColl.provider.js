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
	
	this.$get = function($timeout, parsedData) {
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
                vm.svgCollection = parsedData.getViscollSvgs();
                
                var quireOptions = [];
                if (vm.svgCollection.quires._indexes) {
                    for (var i = 0; i < vm.svgCollection.quires._indexes.length; i++) {
                        var quireId = vm.svgCollection.quires._indexes[i];
                        var quire = vm.svgCollection.quires[quireId];
                        quireOptions.push({
                            value: quire.value,
                            label: quire.n,
                            title: quire.n
                        });
                        var filteredLeaves = vm.getFilteredQuireLeaves(quireId);
                        quire.leavesList = filteredLeaves.leaves;
                        quire.leavesInsertedInSelector = filteredLeaves.leavesInsertedInSelector;
                    }
                }
                vm.quireOptions = quireOptions;
                
                $timeout(function(){
                    var svgGs = angular.element('.viscollContainer svg > g');
                    if (svgGs) {
                        svgGs.click(function(e){
                            try {
                                var quireId = angular.element(e.delegateTarget).parents('.viscollContainer')[0].id;
                                var gID = e.delegateTarget.id;
                                var option = vm.svgCollection.quires[quireId].leaves[gID];
                                if (vm.svgCollection.quires[quireId].leavesInsertedInSelector && vm.svgCollection.quires[quireId].leavesInsertedInSelector.indexOf(gID) > -1) {
                                    vm.setSelectedFolioForQuire(quireId, option);
                                } else {
                                    // Find and select conjoin folio
                                    var conjoinOption = vm.svgCollection.quires[quireId].leaves[option.conjoin];
                                    vm.setSelectedFolioForQuire(quireId, conjoinOption);
                                }
                            } catch(e) {
                                console.log(e);
                            }
                        });
                        svgGs.hover(function(e){
                            try {
                                var quireId = angular.element(e.delegateTarget).parents('.viscollContainer')[0].id;
                                var gID = e.delegateTarget.id;
                                var option = vm.svgCollection.quires[quireId].leaves[gID];
                                if (option) {
                                    var svgElem = angular.element('#'+option.value);
                                    var overUnit = angular.element('.over_unit');
                                    if (overUnit) {
                                        overUnit.removeClass('over_unit');
                                    }
                                    svgElem.addClass('over_unit');
                                }
                                
                                if (!vm.svgCollection.quires[quireId].leavesInsertedInSelector || vm.svgCollection.quires[quireId].leavesInsertedInSelector.indexOf(gID) < 0) {
                                    // Find and select conjoin folio
                                    var svgConjoinElem = angular.element('#'+option.conjoin);
                                    svgConjoinElem.addClass('over_unit');
                                }
                            } catch(e) {
                                console.log(e);
                            }
                        });
                        svgGs.mouseout(function(e){
                            var overUnit = angular.element('.over_unit');
                            if (overUnit) {
                                overUnit.removeClass('over_unit');
                            }
                        });
                    }
                });
            };

            var getSvgByQuire = function(quireId) {
                var vm = this;
                return vm.svgCollection.svgs[quireId] && vm.svgCollection.svgs[quireId].textSvg ? vm.svgCollection.svgs[quireId].textSvg.outerHTML : '<span>No data</span>';
            };
            
            var getSvgQuireN = function(svgId) {
                var vm = this;
                return vm.svgCollection.svgs[svgId].quireN;
            };

            var getQuireBySvgId = function(svgId) {
                var vm = this;
                var quireN = vm.getSvgQuireN(svgId);
                return vm.getQuireByNumber(quireN);
            };

            var getQuireIdBySvgId = function(svgId) {
                var vm = this;
                var quire = vm.getQuireBySvgId(svgId);
                return quire.value;
            };

            var getQuireByNumber = function(quireN) {
                var vm = this;
                var i = 0;
                var quire;
                while (!quire && i < vm.svgCollection.quires._indexes.length) {
                    var svgId = vm.svgCollection.quires._indexes[i];
                    if (vm.svgCollection.quires[svgId].n === quireN) {
                        quire = vm.svgCollection.quires[svgId];
                    }
                    i++;
                }
                return quire;
            };

            var getQuire = function(quireId) {
                var vm = this;
                return vm.svgCollection.quires[quireId] || {};
            };

            var isSelectedQuire = function(quireId) {
                var vm = this;
                if (!vm.selectedQuire) {
                    return true;
                } else {
                    return quireId === vm.selectedQuire.value;
                }
            };
            var quireOptions = [];
            var setSelectedQuire = function(option) {
                var vm = this;
                if (option && option.value) {
                    vm.selectedQuire = {
                        value: option.value,
                        n: option.label
                    };
                } else {
                    vm.selectedQuire = undefined;
                }
            };
            var getFilteredQuireLeaves = function(quireId) {
                var vm = this;
                var leavesCollection = vm.svgCollection.quires[quireId].leaves;
                var leaves = [];
                var leavesInsertedInSelector = [];
                for (var i = 0; i < leavesCollection._indexes.length; i++) {
                    var leafId = leavesCollection._indexes[i];
                    var leaf = leavesCollection[leafId];
                    if (leaf) {
                        var conjoinLeaf = leaf.conjoin ? leavesCollection[leaf.conjoin] : undefined;
                        var conjoinInserted = false;
                        if (conjoinLeaf) {
                            leaf.label = leaf.leafno + ' - ' + conjoinLeaf.leafno;
                            conjoinInserted = leavesInsertedInSelector.indexOf(conjoinLeaf.value) > -1;
                        }
                        if (!conjoinInserted) {
                            leaves.push(leaf);
                            leavesInsertedInSelector.push(leafId);
                        }
                    }
                }
                return { leaves: leaves, leavesInsertedInSelector: leavesInsertedInSelector };
            };

            var getAllQuireLeaves = function(quireId) {
                var vm = this;
                var leavesCollection = vm.svgCollection.quires[quireId].leaves;
                var leaves = [];
                for (var i = 0; i < leavesCollection._indexes.length; i++) {
                    leaves.push(leavesCollection[leavesCollection._indexes[i]]);
                }
                return leaves;
            };

            var setSelectedFolioForQuire = function(quireId, option) {
                var vm = this;
                vm.selectedFolios = vm.selectedFolios ? vm.selectedFolios : {};
                var svgLeaf = vm.svgCollection.quires[quireId].leaves[option.value];
                if (svgLeaf) {
                    if (!svgLeaf.imageId || !svgLeaf.imageId2 || !svgLeaf.conjoinId || !svgLeaf.conjoinId2) {
                        var conjoinLeaf = vm.svgCollection.quires[quireId].leaves[option.conjoin];
                        if (conjoinLeaf) {
                            if (!svgLeaf.imageId) {
                                svgLeaf.img = conjoinLeaf.imgConjoin;
                                svgLeaf.imageId = conjoinLeaf.conjoinId;
                            }
                            if (!svgLeaf.imageId2) {
                                svgLeaf.img2 = conjoinLeaf.imgConjoin2;
                                svgLeaf.imageId2 = conjoinLeaf.conjoinId2;
                            }
                            if (!svgLeaf.conjoinId) {
                                svgLeaf.imgConjoin = conjoinLeaf.img;
                                svgLeaf.conjoinId = conjoinLeaf.imageId;
                            }
                            if (!svgLeaf.conjoinId2) {
                                svgLeaf.imgConjoin2 = conjoinLeaf.img2;
                                svgLeaf.conjoinId2 = conjoinLeaf.imageId2;
                            }
                        }
                    }
                    svgLeaf.unitN = option.label;
                }
                vm.selectedFolios[quireId] = svgLeaf;
                var activeUnit = angular.element('#' + quireId + ' .active_unit');
                if (activeUnit) {
                    activeUnit.removeClass('active_unit');
                    activeUnit.removeClass('first_unit');
                    activeUnit.removeClass('second_unit');
                }
                var svgElem = angular.element('#'+option.value);
                if (svgElem) {
                    svgElem.addClass('active_unit');
                    svgElem.addClass('first_unit');
                }
                try {
                    var quire =vm.svgCollection.quires[quireId];
                    var quireLeaf;
                    var i = 0;
                    while (!quireLeaf && i < quire.leaves._indexes.length) {
                        var leafId = quire.leaves._indexes[i];
                        if (quire.leaves[leafId].value === option.value) {
                            quireLeaf = quire.leaves[leafId];
                        }
                        i++;
                    }
                    if (quireLeaf && quireLeaf.conjoin) {
                        var svgConjoinElem = angular.element('#'+quireLeaf.conjoin);
                        svgConjoinElem.addClass('active_unit');
                        svgConjoinElem.addClass('second_unit');
                    }
                } catch(e) {
                    console.log(e);
                }
            };
            scopeHelper = {
                // Scope expansion
                uid: currentId,
                svgCollection: svgCollection,
                selectedQuire: undefined,
                quireOptions: quireOptions,
                selectedFolios: undefined,
                // Functions
                getSvgByQuire: getSvgByQuire,
                getSvgQuireN: getSvgQuireN,
                getQuire: getQuire,
                getQuireBySvgId: getQuireBySvgId,
                getQuireByNumber: getQuireByNumber,
                getQuireIdBySvgId: getQuireIdBySvgId,
                getFilteredQuireLeaves: getFilteredQuireLeaves,
                getAllQuireLeaves: getAllQuireLeaves,
                isSelectedQuire: isSelectedQuire,
                displayResult: displayResult,
                setSelectedQuire: setSelectedQuire,
                setSelectedFolioForQuire: setSelectedFolioForQuire,
                destroy: destroy
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