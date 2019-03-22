/**
 * @ngdoc object
 * @module evtviewer.visColl
 * @name evtviewer.visColl.controller:ViscollCtrl
 * @description 
 * # ViscollCtrl
 * This is the controller for the {@link evtviewer.visColl.directive:evtViscoll evtViscoll} directive. 
 * @requires $log
 * @requires $scope
 * @requires evtviewer.core.config
 * @requires evtviewer.visColl.evtViscoll
 * @requires evtviewer.parsedData
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.select.evtSelect
**/
angular.module('evtviewer.visColl')

    .controller('ViscollCtrl', function (config, $log, $scope, $filter, evtNavbar, parsedData, evtInterface, evtSelect, evtButtonSwitch) {
        var vm = this;

        var _console = $log.getInstance('visColl');
        // 
        // Control function
        // 
        // metodi vari

        vm.updateCurrentPage = function (value) {
            if (value) {
                var pagesCollection = parsedData.getPages();
                for (var page in pagesCollection) {
                    if (pagesCollection[page].n !== undefined) {
                        if (pagesCollection[page].n === value) {
                            evtInterface.updateState('currentPage', page);
                            evtInterface.updateState('isVisCollOpened', false);
                        }
                    }
                }
                var viscollBtn = evtButtonSwitch.getByType('visColl');
                if (viscollBtn) {
                    viscollBtn.forEach(function(btn){ btn.setActive(false); });
                }
                evtInterface.updateUrl();
            }
        };

    });