/**
 * @ngdoc object
 * @module evtviewer.bibliography
 * @name evtviewer.bibliography.controller:BiblElemCtrl
 * @description 
 * # BiblElemCtrl
 * This is the controller for the {@link evtviewer.bibliography.directive:evtBiblElem evtBiblElem} directive. 
**/
angular.module('evtviewer.bibliography')

.controller('BiblElemCtrl', function($scope, $log, parsedData, config, evtBibliographyParser) {
    var _console = $log.getInstance('BiblElemCtrl');

    var vm = this;

    //recupero stili bibliografici
    vm.styles = config.allowedBibliographicStyles;
    vm.initialSelectedStyle = config.defaultBibliographicStyle;
    /**
     * @ngdoc method
     * @name evtviewer.bibliography.controller:BiblElemCtrl#getFormattedBibl
     * @methodOf evtviewer.bibliography.controller:BiblElemCtrl
     *
     * @description
     * Format the output of the entry accordingly to the globally selected style.
     *
     * @returns {string} string of the HTML to be compiles, representing the output of the bibliographic entry,
     * properly formatted according to globally selected style
     */
    vm.getFormattedBibl = function() {
        var biblElement = parsedData.getBibliographicRefById($scope.biblId);
        if (biblElement) {
            if (!biblElement.outputs[vm.initialSelectedStyle]) {
                evtBibliographyParser.formatResult(vm.initialSelectedStyle, biblElement);
            }
            return biblElement.outputs[vm.initialSelectedStyle];
        } else {
            return '';
        }
    };
});