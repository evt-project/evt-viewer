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
                for (var i in vm.svgCollection.svgs._indexes) {
                    var svgId = vm.svgCollection.svgs._indexes[i];
                    if (vm.svgCollection.svgs[svgId].hasOwnProperty('textSvg')){
                        var svg = vm.svgCollection.svgs[svgId].textSvg;
                        vm.totSvg.push(svg);
                    }
                    vm.svgCollection.svgs[svgId].quireLeaves = vm.getFilteredQuireLeavesBySvgId(svgId).leaves;
                    vm.svgCollection.svgs[svgId].leavesInserted = vm.getFilteredQuireLeavesBySvgId(svgId).leavesInserted;
                }
                var quireOptions = [];
                for (var i = 0; i < svgCollection.quires._indexes.length; i++) {
                    var quireId = svgCollection.quires._indexes[i];
                    var quire = svgCollection.quires[quireId];
                    quireOptions.push({
                        value: quire.value,
                        label: quire.n,
                        title: quire.n
                    });
                }
                vm.quireOptions = quireOptions;
                $timeout(function(){
                    var svgGs = angular.element('.viscollContainer svg > g');
                    if (svgGs) {
                        svgGs.click(function(e){
                            try {
                                var svgId = angular.element(e.delegateTarget).parents('.viscollContainer')[0].id;
                                var gID = e.delegateTarget.id;
                                var option = vm.svgCollection.svgs[svgId].svgLeaves.filter(function(leaf) { return leaf.value === gID; })[0];
                                if (vm.svgCollection.svgs[svgId].leavesInserted && vm.svgCollection.svgs[svgId].leavesInserted.indexOf(gID) > -1) {
                                    vm.setSelectedFolioForQuire(svgId, option);
                                } else {
                                    // Find and select conjoin folio
                                    var quireLeaves = vm.getAllQuireLeavesBySvgId(svgId);
                                    var optionLeaf = quireLeaves.filter(function(leaf) { return leaf.value === gID; })[0];
                                    var conjoinOption = vm.svgCollection.svgs[svgId].svgLeaves.filter(function(leaf) { return leaf.value === optionLeaf.conjoin; })[0];
                                    vm.setSelectedFolioForQuire(svgId, conjoinOption, option);
                                }
                            } catch(e) {
                                console.log(e);
                            }
                        });
                        svgGs.hover(function(e){
                            try {
                                var svgId = angular.element(e.delegateTarget).parents('.viscollContainer')[0].id;
                                var gID = e.delegateTarget.id;
                                var option = vm.svgCollection.svgs[svgId].svgLeaves.filter(function(leaf) { return leaf.value === gID; })[0];
                                var svgElem = angular.element('#'+option.value);
                                var overUnit = angular.element('.over_unit');
                                if (overUnit) {
                                    overUnit.removeClass('over_unit');
                                }
                                svgElem.addClass('over_unit');
                                
                                if (!vm.svgCollection.svgs[svgId].leavesInserted || vm.svgCollection.svgs[svgId].leavesInserted.indexOf(gID) < 0) {
                                    // Find and select conjoin folio
                                    var quireLeaves = vm.getAllQuireLeavesBySvgId(svgId);
                                    var optionLeaf = quireLeaves.filter(function(leaf) { return leaf.value === gID; })[0];
                                    var svgConjoinElem = angular.element('#'+optionLeaf.conjoin);
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
            
            var totSvg = [];

            var getTotSvgOuterHTML = function(index) {
                var vm = this;
                if (index !== undefined && vm.totSvg[index] !== undefined) {
                    return vm.totSvg[index].outerHTML;
                } else {
                    return '<span>No data</span>';
                }
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

            var isSelectedQuire = function(quireN) {
                var vm = this;
                if (!vm.selectedQuire) {
                    return true;
                } else {
                    return quireN === vm.selectedQuire.n;
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
            var getFilteredQuireLeavesBySvgId = function(svgId) {
                var vm = this;
                var quireId = vm.getQuireIdBySvgId(svgId);
                var leavesCollection = vm.svgCollection.quires[quireId].leaves;
                var leaves = [];
                var leavesInserted = [];
                for (var i = 0; i < leavesCollection._indexes.length; i++) {
                    var leafId = leavesCollection._indexes[i];
                    var leaf = leavesCollection[leafId];
                    if (leaf) {
                        var conjoinLeaf = leaf.conjoin ? leavesCollection[leaf.conjoin] : undefined;
                        var conjoinInserted = false;
                        if (conjoinLeaf) {
                            leaf.label = leaf.leafno + ' - ' + conjoinLeaf.leafno;
                            conjoinInserted = leavesInserted.indexOf(conjoinLeaf.value) > -1;
                        }
                        if (!conjoinInserted) {
                            leaves.push(leaf);
                            leavesInserted.push(leafId);
                        }
                    }
                }
                return { leaves: leaves, leavesInserted: leavesInserted };
            };

            var getAllQuireLeavesBySvgId = function(svgId) {
                var vm = this;
                var quireId = vm.getQuireIdBySvgId(svgId);
                var leavesCollection = vm.svgCollection.quires[quireId].leaves;
                var leaves = [];
                for (var i = 0; i < leavesCollection._indexes.length; i++) {
                    leaves.push(leavesCollection[leavesCollection._indexes[i]]);
                }
                return leaves;
            };

            var setSelectedFolioForQuire = function(svgId, option, conjoinOption) {
                var vm = this;
                vm.selectedFolios = vm.selectedFolios ? vm.selectedFolios : {};
                var svgLeaf = vm.svgCollection.svgs[svgId].svgLeaves.filter(function(leaf) {
                    return leaf.value === option.value
                });
                svgLeaf = svgLeaf ? svgLeaf[0]: undefined;
                if (svgLeaf) {
                    if (!svgLeaf.imageId || !svgLeaf.imageId2 || !svgLeaf.conjoinId || !svgLeaf.conjoinId2) {
                        var conjoinLeaf;
                        try {
                            conjoinLeaf = vm.svgCollection.svgs[svgId].svgLeaves.filter(function(leaf) {
                                if (conjoinOption) {
                                    return leaf.value === conjoinOption.id;
                                } else {
                                    return leaf.value === option.conjoin;
                                }
                            })[0];
                        } catch(e) {}
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
                vm.selectedFolios[vm.getSvgQuireN(svgId)] = svgLeaf;
                var activeUnit = angular.element('#' + svgId + ' .active_unit');
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
                    var quire = vm.getQuireBySvgId(svgId);
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
                totSvg: totSvg,
                selectedQuire: undefined,
                quireOptions: quireOptions,
                selectedFolios: undefined,
                // Functions
                getSvgQuireN: getSvgQuireN,
                getQuire: getQuire,
                getQuireBySvgId: getQuireBySvgId,
                getQuireByNumber: getQuireByNumber,
                getQuireIdBySvgId: getQuireIdBySvgId,
                getFilteredQuireLeavesBySvgId: getFilteredQuireLeavesBySvgId,
                getAllQuireLeavesBySvgId: getAllQuireLeavesBySvgId,
                isSelectedQuire: isSelectedQuire,
                displayResult: displayResult,
                getTotSvgOuterHTML: getTotSvgOuterHTML,
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