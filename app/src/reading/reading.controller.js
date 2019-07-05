/**
 * @ngdoc object
 * @module evtviewer.reading
 * @name evtviewer.reading.controller:ReadingCtrl
 * @description 
 * # ReadingCtrl
 * This is the controller for the {@link evtviewer.reading.directive:evtReading evtReading} directive. 
 * @requires $log
 * @requires $scope
 * @requires evtviewer.core.config
 * @requires evtviewer.reading.evtReading
 * @requires evtviewer.popover.evtPopover
 * @requires evtviewer.dataHandler.baseData
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.dataHandler.evtCriticalApparatusParser
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
 * @requires evtviewer.apparatuses.evtApparatuses
 * @requires evtviewer.box.evtBox
**/
angular.module('evtviewer.reading')

.controller('ReadingCtrl', function(config, $log, $scope, evtReading, parsedData, evtPopover, evtCriticalApparatusParser, baseData, evtInterface, evtCriticalApparatusEntry, evtApparatuses, evtBox) {
    var vm = this;
    
    var _console = $log.getInstance('reading');
    // 
    // Control function
    // 
    var changeRangeStatus = function(property, className) {
        angular.forEach(vm.range, function(el) {
            if (property && el.className.indexOf(className) < 0) {
                el.className += ' ' + className;
            } else if (!property && el.className.indexOf(className) >= 0) {
                el.className = el.className.replace(' ' + className, '');
            }
        });
    }
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#mouseOver
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * Set *over* property to true (this property is used to simulate the over event on
     * different reading instances connected to the same critical apparatus when the uses passes over one of them).
     */
    this.mouseOver = function() {
        vm.over = true;
        if (vm.overlap && vm.range) {
            changeRangeStatus(vm.over, 'over');
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#mouseOut
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * Set *over* property to false (this property is used to simulate the over event on
     * different reading instances connected to the same critical apparatus when the uses passes over one of them).
     */
    this.mouseOut = function() {
        vm.over = false;
        if (vm.overlap && vm.range) {
            changeRangeStatus(vm.over, 'over');
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#setSelected
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * Set *selected* property to true (this property is used to simulate the selection on
     * different reading instances connected to the same critical apparatus when the user clicks on one of them).
     */
    this.setSelected = function() {
        vm.selected = true;
        if (vm.overlap && vm.range) {
            changeRangeStatus(vm.selected, 'selected');
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#unselect
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * Set *selected* property to false (this property is used to simulate the selection on
     * different reading instances connected to the same critical apparatus when the user clicks on one of them).
     */
    this.unselect = function() {
        vm.selected = false;
        if (vm.overlap && vm.range) {
            changeRangeStatus(vm.selected, 'selected');
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#isSelect
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * Check if the reading can be considered "*selected*" (for nested readings, this will depend also on parent state).
     * @returns {boolean} whether the reading can be considered "*selected*" or not
     */
    this.isSelect = function() {
        if (vm.parentAppId !== undefined ) {
            return vm.selected || (evtInterface.getState('currentAppEntry') === vm.parentAppId);
        } else {
            return vm.selected;
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#isApparatusOpened
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * Check if the connected critical apparatus is opened.
     * @returns {boolean} whether the connected critical apparatus is opened or not
     */
    this.isApparatusOpened = function() {
        return (vm.apparatus.opened && !$scope.$parent.vm.state.topBoxOpened);
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#closeApparatus
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * Close the connected critical apparatus.
     */
    this.closeApparatus = function() {
        vm.apparatus.opened = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#openApparatus
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * Open the connected critical apparatus.
     */
    this.openApparatus = function() {
        vm.apparatus.opened = true;
        vm.apparatus._loaded = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#toggleOverAppEntries
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * Simulate the "over" event on all the critical readings connected to the same critical apparatus entry.
     * @param {event} $event mouseover/mouseout event
     */
    this.toggleOverAppEntries = function($event) {
        $event.stopPropagation();
        if ( !vm.hidden ) {
            if ( vm.over === false ) {
                evtReading.mouseOverByAppId(vm.appId);
                evtCriticalApparatusEntry.mouseOverByAppId(vm.appId);
            } else {
                evtReading.mouseOutAll();
                evtCriticalApparatusEntry.mouseOutAll();
            }
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#toggleSelectAppEntries
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * <p>Simulate the "selection" event on all the critical readings connected to the same critical apparatus entry.</p>
     * <p>Update the state of {@link evtviewer.interface.evtInterface evtInterface} by setting/unsetting the
     * current apparatus entry.</p> 
     * <p>If the critical apparatus is not in inline mode, open the critical apparatus tab 
     * in the current {@link evtviewer.apparatuses.directive:evtApparatuses evtApparatuses}.</p>    
     * @param {event} $event click event
     */
    this.toggleSelectAppEntries = function($event) {
        if ( !vm.hidden ) {
            if (vm.selected === false) {
                evtReading.selectById(vm.appId);
                evtCriticalApparatusEntry.selectById(vm.appId);
                if (!vm.apparatus.inline) {
                    evtApparatuses.setCurrentApparatus('criticalApparatus');
                    evtApparatuses.alignScrollToApp(vm.appId);
                } 
                evtInterface.updateState('currentAppEntry', vm.appId);
            } else {
                evtInterface.updateState('currentAppEntry', '');
                evtReading.unselectAll();
                evtCriticalApparatusEntry.unselectAll();
            }
        }
        evtInterface.updateUrl();
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#toggleApparatus
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * Open/close the critical apparatus connected to the current reading 
     * (do the same for readings connected to the same critical apparatus).  
     * @param {event} $event click event
     */
    this.toggleApparatus = function($event) {
        evtPopover.closeAll();
        if ( !vm.hidden && vm.over ) {
            if ( !vm.apparatus._loaded) {
                vm.apparatus._loaded = true;
            } 
            
            evtReading.closeAllApparatus(vm.uid);
            vm.apparatus.opened = !vm.apparatus.opened;
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#callbackClick
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * Callback fired when user clicks on a reading. It will:<ul>
     * <li>Stop event propagation</li>
     * <li>Toggle the "select" state on readings connected to the same critical apparatus entry 
     * ({@link evtviewer.reading.controller:ReadingCtrl#toggleSelectAppEntries toggleSelectAppEntries()})</li>
     * <li>If the apparatus is in inline mode and is not yet opened, toggle the state of the 
     * connected critical apparatus entry ({@link evtviewer.reading.controller:ReadingCtrl#toggleApparatus toggleApparatus()})</li>
     * </ul>
     * @param {event} $event click event
     */
    this.callbackClick = function($event) {
        if ($event) {
            $event.stopPropagation();
        }
        if (vm.over) {
            vm.toggleSelectAppEntries($event);
            if (!vm.isSelect() || (vm.apparatus.inline && !vm.apparatus.opened)){
                vm.toggleApparatus($event);
            }
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#openApparatusSubContent
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * Open a specific tab on critical apparatus entry sub content.
     * @param {string} subContent name of tab to open
     */
    this.openApparatusSubContent = function(subContent) {
        vm.apparatus._subContentOpened = subContent;
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#backgroundColor
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * Get background color for reading. This method is needed in order to handle
     * the heat map (that will balance the darkness of color on critical entry variance),
     * to handle the critical entries filters and to allow custom color for readings.
     * @returns {string} style rules to customize the background color
     */
    this.backgroundColor = function(){
        if (vm.type === 'variant') {
            return colorFilters();
        } else {
            return colorVariance();
        }
    };

    var colorVariance = function() {
        var opacity;
        if ($scope.$parent.vm.state.heatmap) {
            var maxVariance = parsedData.getCriticalEntriesMaxVariance();
            opacity = vm.over && !$scope.$parent.vm.state.topBoxOpened ? '1' : vm.variance/maxVariance;
            var color = config.heatmapColor.replace('rgb', 'rgba').slice(0, -1)+','+opacity+')';
            return 'background: '+color;
        } else {
            return colorFilters();
        }
    };

    var colorFilters = function() {
        var background, filterLabels, possibleFilters;
        var app, reading, readingAttributes;
        
        var possibleVariantFilters = config.possibleVariantFilters, 
            possibleLemmaFilters   = config.possibleLemmaFilters;
        
        var parentStatusOver = false;
        if (vm.parentAppId) {
            var parentRef = evtReading.getById(vm.parentAppId);
            parentStatusOver = parentRef ? parentRef.over || parentRef.isSelect() : false;
        }

        if (vm.appId !== undefined) {
            app     = parsedData.getCriticalEntryById(vm.appId);
            reading = vm.readingId !== undefined ? app.content[vm.readingId] : app.content[app.lemma];
            if (reading !== undefined){
                readingAttributes = parsedData.getReadingAttributes(vm.readingId, vm.appId) || {};
                
                filterLabels = parsedData.getCriticalEntriesFilters();
                possibleFilters = $scope.$parent.vm.type === 'witness' ? possibleVariantFilters : possibleLemmaFilters;
                if (Object.keys(readingAttributes).length > 0) {
                    var colors = '';
                    var opacity = (vm.over || vm.isSelect() || parentStatusOver) && !$scope.$parent.vm.state.topBoxOpened ? '1' : '.4';
                    
                    for (var label in filterLabels) {
                        var filterLabel = filterLabels[label].name;
                        if (possibleFilters.indexOf(filterLabel) >= 0) {
                            if (readingAttributes !== undefined && readingAttributes[filterLabel] !== undefined) {
                                for (var filter in filterLabels[label].values) {
                                    var filterColor = filterLabels[label].values[filter].color,
                                        filterValue = filterLabels[label].values[filter].name;
                                    if (readingAttributes[filterLabel] === filterValue){
                                        var color = filterColor.replace('rgb', 'rgba');
                                        colors += color.slice(0, -1)+','+opacity+'),';
                                    }
                                }
                            }
                        }
                    }
                    
                    if (colors !== '' ) {
                        colors = colors.slice(0, -1);
                        if ( (colors.match(/rgb/gi) && colors.match(/rgb/gi).length > 1) || (colors.match(/#/gi) && colors.match(/#/gi).length > 1)) {
                            background  = 'background: -moz-linear-gradient(left,'+colors+');';
                            background += 'background: -webkit-linear-gradient(left,'+colors+');';
                            background += 'background: ms-linear-gradient(left,'+colors+');';
                            background += 'background: linear-gradient(left,'+colors+');';
                        } else {
                            background = 'background: '+colors;
                        }
                    }
                }   
            }
        }
        if (background === undefined) {
            if (!$scope.$parent.vm.state.topBoxOpened) {
                if (vm.over || vm.isSelect() || parentStatusOver) {
                    background = 'background: '+config.variantColorDark;
                } else {
                    background = 'background: '+config.variantColorLight;
                }
            }
        }
        return background;
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#fitFilters
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     * <p>Check if the current reading fits the selected filters.</p>
     * <p>Currently the check is performed by putting all filters in **OR**
     * (so the reading must fit *at least one of them*); however, 
     * the function is ready to perform the checking by putting all filters in **AND** 
     * (so that the reading must fit *all filters at once*). </p>
     * <p>Filters are retrieved from parent scope (parent should be a {@link evtviewer.box.directive:box box}
     * and are organized as follows:
        <pre>
                var filters = {
                    resp : {
                        any: false,
                        name: "resp",
                        totActive: 2,
                        values: {
                            0: "m1",
                            1: "CDP", 
                            CDP: {
                                active: true,
                                color: "rgb(253, 153, 54)",
                                name: "CDP"
                            },
                            m1: {
                                active: true,
                                color: "rgb(52, 197, 173)",
                                name: "m1"
                            },
                            length: 2
                        }
                    },
                    _totActive: 2
                };
            </pre>
     *</p>
     * @returns {boolean} whether the reading fits selected filters or not
     */
    this.fitFilters = function(){
        var app = parsedData.getCriticalEntryById(vm.appId),
            reading,
            readingAttributes;
        
        var condizione = 'OR', //TODO: Decidere come gestire
            fit        = false,
            count      = 0,
            match,
            filter,
            filterLabel,
            i,
            values,
            value,
            key;
        readingAttributes = parsedData.getReadingAttributes(vm.readingId, vm.appId) || {};
                
        if (app !== undefined){
            reading = vm.readingId !== undefined ? app.content[vm.readingId] : app.content[app.lemma];
            if (reading !== undefined){
                var filters = $scope.$parent.vm.state.filters || {};
                var filterKeys = Object.keys(filters);
                if (condizione === 'OR') {
                    // basta che almeno un filtro corrisponda, quindi non importa ciclarli tutti
                    match = false;
                    for (key in filterKeys) {
                        filterLabel = filterKeys[key];
                        filter      = filters[filterLabel];
                        if (filter.totActive > 0) {
                            count++;
                            if (readingAttributes !== undefined && readingAttributes[filterLabel] !== undefined){
                                i = 0;
                                values = filter.values;
                                while ( i < values.length && !match) {
                                    if (values[values[i]].active) {
                                        value = values[values[i]].name;
                                        match = match || readingAttributes[filterLabel] === value;
                                    }
                                    i++;
                                }
                            }
                        }
                        if (match) { break; }
                    }
                    fit = match;
                } else { //default
                    var visible = true;
                    for (key in filterKeys) {
                        filterLabel = filterKeys[key];
                        filter      = filters[filterLabel];
                        if (filter.totActive > 0) {
                            count++;
                            match = false; 
                            if (readingAttributes !== undefined && readingAttributes[filterLabel] !== undefined){
                                values = filter.values;
                                for ( i = 0; i < values.length; i++ ) {
                                    value = values[values[i]].name;
                                    match = match || readingAttributes[filterLabel] === value;
                                }
                            }
                            visible = visible && match;
                        }
                    }
                    fit = visible;
                }
            }
        }
        
        if (count === 0) {
            fit = true;
        }
        vm.hidden = !fit;
        return fit;
    };
    /**
     * @ngdoc method
     * @name evtviewer.reading.controller:ReadingCtrl#destroy
     * @methodOf evtviewer.reading.controller:ReadingCtrl
     *
     * @description
     *  <p>Remove instance from saved instances in {@link evtviewer.reading.evtReading evtReading} provider.</p>
     */
    this.destroy = function() {
        var tempId = this.uid;
        // TODO: remove from list and collection
        // this.$destroy();
        evtReading.destroy(tempId);
        // _console.log('vm - destroy ' + tempId);
    };
    // _console.log('ReadingCtrl running');
});