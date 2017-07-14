/**
 * @ngdoc type
 * @module evtviewer.bibliography
 * @name BiblElemCtrl
 * @description ...
**/
angular.module('evtviewer.bibliography')

.controller('BiblElemCtrl', function($scope, $log, parsedData, config, evtBibliographyParser) {
    var _console = $log.getInstance('BiblElemCtrl');

    var vm = this;

    //recupero stili bibliografici
    vm.styles = config.allowedBibliographicStyles;
    vm.initialSelectedStyle = config.defaultBibliographicStyle;
    _console.log(vm.initialSelectedStyle);
    vm.getFormattedBibl = function() {
        _console.log($scope.biblId);
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