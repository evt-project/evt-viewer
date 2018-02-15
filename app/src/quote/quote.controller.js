/**
 * @ngdoc object
 * @module evtviewer.quote
 * @name evtviewer.quote.controller:QuoteCtrl
 * @description 
 * # QuoteCtrl
 * This is the controller for the {@link evtviewer.quote.directive:evtQuote evtQuote} directive. 
 *
 * @requires $log
 * @requires $scope
 * @requires evtviewer.quote.evtQuote
 * @requires evtviewer.popover.evtPopover
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.apparatuses.evtApparatuses
 * @requires evtviewer.box.evtBox
 * @requires evtviewer.sourcesApparatusEntry.evtSourcesApparatusEntry
 * @requires evtviewer.sourcesApparatusEntry.evtSourceSeg
 * @requires evtviewer.dataHandler.parsedData
**/
angular.module('evtviewer.quote')

.controller('QuoteCtrl', function($log, $scope, evtQuote, evtPopover, evtInterface, evtApparatuses, evtBox, evtSourcesApparatusEntry, evtSourceSeg, parsedData) {
    var vm = this;
    
    var _console = $log.getInstance('quote');

    // 
    // Control function
    // 
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#mouseOver
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * Set *over* property to true (this property is used to simulate the over event on
     * different quote instances connected to the same sources apparatus when the uses passes over one of them).
     */
    this.mouseOver = function() {
        vm.over = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#mouseOut
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * Set *over* property to false (this property is used to simulate the over event on
     * different quote instances connected to the same sources apparatus when the uses passes over one of them).
     */
    this.mouseOut = function() {
        vm.over = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#setSelected
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * Set *selected* property to true (this property is used to simulate the selection on
     * different quote instances connected to the same sources apparatus when the user clicks on one of them).
     */
    this.setSelected = function() {
        vm.selected = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#unselect
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * Set *selected* property to false (this property is used to simulate the selection on
     * different quote instances connected to the same sources apparatus when the user clicks on one of them).
     */
    this.unselect = function() {
        vm.selected = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#isSelect
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * Check if the quote can be considered "*selected*" (for nested quotes, this will depend also on parent state).
     * @returns {boolean} whether the quote can be considered "*selected*" or not
     */
    this.isSelected = function() {
        return vm.selected;
    };
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#isApparatusOpened
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * Check if the connected sources apparatus is opened.
     * @returns {boolean} whether the connected sources apparatus is opened or not
     */
    this.isApparatusOpened = function() {
        return (vm.apparatus.opened && !$scope.$parent.vm.state.topBoxOpened);
    };
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#closeApparatus
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * Close the connected sources apparatus.
     */
    this.closeApparatus = function() {
        vm.apparatus.opened = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#openApparatus
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * Open the connected sources apparatus.
     */
    this.openApparatus = function() {
        vm.apparatus.opened = true;
        vm.apparatus._loaded = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#toggleOverQuotes
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * Simulate the "over" event on all the critical quotes connected to the same sources apparatus entry.
     * @param {event} $event mouseover/mouseout event
     */
    this.toggleOverQuotes = function($event) {
        $event.stopPropagation();
        if ( vm.over === false ) {
            evtQuote.mouseOverByQuoteId(vm.quoteId);
            evtSourcesApparatusEntry.mouseOverByQuoteId(vm.quoteId);           
        } else {
            evtQuote.mouseOutAll();
            evtSourcesApparatusEntry.mouseOutAll();
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#toggleSelectQuotes
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * <p>Simulate the "selection" event on all the critical quotes connected to the same sources apparatus entry.</p>
     * <p>Update the state of {@link evtviewer.interface.evtInterface evtInterface} by setting/unsetting the
     * current apparatus entry.</p> 
     * <p>If the sources apparatus is not in inline mode, open the sources apparatus tab 
     * in the current {@link evtviewer.apparatuses.directive:evtApparatuses evtApparatuses}.</p>    
     * @param {event} $event click event
     */
    this.toggleSelectQuotes = function($event) {
        //TODO: aggiungere controllo per gli altri elementi critici
        if (vm.selected === false) {
            evtQuote.selectById(vm.quoteId);
            evtSourcesApparatusEntry.selectById(vm.quoteId);
            if (!vm.apparatus.inline) {
                evtApparatuses.setCurrentApparatus('sources');
                evtApparatuses.alignScrollToQuote(vm.quoteId);
            } 
            evtInterface.updateState('currentQuote', vm.quoteId);
        } else {
            evtQuote.unselectAll();
            evtInterface.updateState('currentQuote', '');
            evtSourcesApparatusEntry.unselectAll();
        }

        evtInterface.updateUrl();
    };
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#toggleApparatus
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * Open/close the sources apparatus connected to the current quote 
     * (do the same for quotes connected to the same sources apparatus).  
     * @param {event} $event click event
     */
    this.toggleApparatus = function($event) {
        evtPopover.closeAll();
        if (vm.over) {
            if ( !vm.apparatus._loaded ) {
                vm.apparatus._loaded = true;
            } 
            
            evtQuote.closeAllApparatus(vm.uid);
            vm.apparatus.opened = !vm.apparatus.opened;
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#callbackClick
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * Callback fired when user clicks on a quote. It will:<ul>
     * <li>Stop event propagation</li>
     * <li>Toggle the "select" state on quotes connected to the same sources apparatus entry 
     * ({@link evtviewer.quote.controller:QuoteCtrl#toggleSelectQuotes toggleSelectQuotes()})</li>
     * <li>If the apparatus is in inline mode and is not yet opened, toggle the state of the 
     * connected sources apparatus entry ({@link evtviewer.quote.controller:QuoteCtrl#toggleApparatus toggleApparatus()})</li>
     * </ul>
     * @param {event} $event click event
     */
    this.callbackClick = function($event) {
        $event.stopPropagation();
        if (vm.over) {
            vm.toggleSelectQuotes($event);
            if (!vm.isSelected() || (vm.apparatus.inline && !vm.apparatus.opened)){
                vm.toggleApparatus($event);
            }
        }
    };

    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#openApparatusSubContent
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * Open a specific tab on sources apparatus entry sub content.
     * @param {string} subContent name of tab to open
     */
    this.openApparatusSubContent = function(subContent) {
        vm.apparatus._subContentOpened = subContent;
    };
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#hasScopeSource
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     * Check whether the current source text contains the source connected to the current quote or not.
     * @returns {boolean} Whether the current source text contains the source connected to the current quote or not.
     */
    this.hasScopeSource = function() {
        var quotesRef = parsedData.getSources()._indexes.quotesRef[vm.quoteId] || undefined,
            currentSourceText = evtInterface.getState('currentSourceText') ;
        if (quotesRef !== undefined && quotesRef.indexOf(currentSourceText) >= 0) {
            return true;
        } else {
            return false;
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.quote.controller:QuoteCtrl#destroy
     * @methodOf evtviewer.quote.controller:QuoteCtrl
     *
     * @description
     *  <p>Remove instance from saved instances in {@link evtviewer.quote.evtQuote evtQuote} provider.</p>
     */
    this.destroy = function() {
        evtQuote.destroy(this.uid);
    };
});