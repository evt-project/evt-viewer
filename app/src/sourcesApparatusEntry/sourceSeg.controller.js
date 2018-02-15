/**
 * @ngdoc object
 * @module evtviewer.sourcesApparatusEntry
 * @name evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl
 * @description 
 * # sourceSegCtrl
 * This is the controller for the {@link evtviewer.sourcesApparatusEntry.directive:evtSourceSeg evtSourceSeg} directive.
 *
 * @author CM
**/
angular.module('evtviewer.sourcesApparatusEntry')

.controller('sourceSegCtrl', function(evtInterface, evtSourceSeg, evtBox, evtQuote, evtApparatuses) {
    //$scope.content = {};
    var vm = this;
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl#mouseOver
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl
     *
     * @description
     * Set *over* property to true (this property is used to simulate the over event on
     * different quote segments instances connected to the same sources apparatus when the uses passes over current element).
     */
    this.mouseOver = function() {
        vm.over = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl#mouseOut
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl
     *
     * @description
     * Set *over* property to false (this property is used to simulate the over event on
     * different quote segments instances connected to the same sources apparatus).
     */
    this.mouseOut = function() {
        vm.over = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl#mouseOut
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl
     *
     * @description
     * Set *selected* property to true (this property is used to simulate the selection on
     * different quote segments instances connected to the same sources apparatus when the user clicks on current element).
     */
    this.setSelected = function() {
        vm.selected = true;
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl#unselect
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl
     *
     * @description
     * Set *selected* property to false (this property is used to simulate the selection on
     * different quote segments instances connected to the same sources apparatus when the user clicks on current element).
     */
    this.unselect = function() {
        vm.selected = false;
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl#getQuoteId
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl
     *
     * @description
     * Retrieve the ID of the quote connected to the current instance of &lt;evt-source-seg&gt;.
     */
    this.getQuoteId = function() {
        return vm.quoteId;
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl#setQuoteId
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl
     *
     * @description
     * Update the ID of the quote connected to the current instance of &lt;evt-source-seg&gt;.
     */
    this.setQuoteId = function(quoteId) {
        if (vm.quoteId !== quoteId) {
            vm.quoteId = quoteId;
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl#unselectQuote
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl
     *
     * @description
     * Reset the selected quote and the quote over property.
     */
    this.unselectQuote = function() {
        vm.panel._quoteOver = '';
        vm.panel._quoteSelected = '';
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl#toggleOverSeg
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl
     *
     * @description
     * Toggle the current "overed" segment.
     */
    this.toggleOverSeg = function($event, segId) {
        $event.stopPropagation();
        if (vm.over === false) {
            evtSourceSeg.mouseOverBySegId(segId);
        } else {
            evtSourceSeg.mouseOutAll();
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl#callbackClick
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl
     *
     * @description
     * Callback fired when user clicks on a source segment. It will:<ul>
     * <li>Stop event propagation</li>
     * <li>If current segment is not selected, it will set it as the current one. 
     * Otherwise it will unselect it.</li>
     * </ul>
     * @param {event} $event click event
     * @param {string} segId ID of segment to handle
     */
    this.callbackClick = function($event, segId) {
        $event.stopPropagation();
        if (!vm.selected) {
            evtSourceSeg.selectBySegId(segId);
        } else {
            evtSourceSeg.unselectAll();
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl#toggleQuoteOver
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl
     *
     * @description
     * Toggle the selected quote.
     * @param {event} $event Over event
     * @param {string} quoteId ID of quote to handle
     */
    this.toggleQuoteOver = function($event, quoteId) {
        $event.stopPropagation();
        if (vm.panel._quoteOver !== quoteId) {
            evtSourceSeg.mouseOutAll();
            vm.panel._quoteOver = quoteId;
        } else {
            vm.panel._quoteOver = '';
        }
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl#selectQuote
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl
     *
     * @description
     * Select a quote and aligne textual boxes to the connected reference.
     * @param {event} $event Over event
     * @param {string} quoteId ID of quote to handle
     */
    this.selectQuote = function($event, quoteId) {
        $event.stopPropagation();
        //if (vm.quoteId !== quoteId) {
            vm.quoteId = quoteId;
            vm.panel._quoteSelected = quoteId;
            //if (evtSourceSeg.getCurrentQuote() !== quoteId) {
                evtSourceSeg.updateCurrentQuote(quoteId);
                evtQuote.selectById(quoteId);
            //}
            evtBox.alignScrollToQuote(quoteId, vm.segId);            
            evtApparatuses.alignScrollToQuote(quoteId, vm.segId);
        //}
    };
    /**
     * @ngdoc method
     * @name evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl#destroy
     * @methodOf evtviewer.sourcesApparatusEntry.controller:sourceSegCtrl
     *
     * @description
     * <p>Remove instance from saved instances in {@link evtviewer.sourcesApparatusEntry.evtSourceSeg evtSourceSeg} provider.</p>
     */
    this.destroy = function() {
        evtSourceSeg.destroy(this.uid);
    };
});