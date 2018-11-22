/**
 * @ngdoc object
 * @module evtviewer.toc
 * @name evtviewer.toc.controller:TocCtrl
 * @description
 * # TocCtrl
 * This is the controller for the {@link evtviewer.toc.directive:evtToc evtToc} directive.
 * @requires $log
 * @requires evtviewer.interface.evtInterface
**/
angular.module('evtviewer.toc')

.controller('TocCtrl', function($log, evtInterface, parsedData, config) {
    var _console = $log.getInstance('toc');

    var vm = this;

    var changeView = function() {
        if (evtInterface.getState('currentViewMode') !== 'collation') {
            evtInterface.updateState('currentViewMode', 'collation');
        }
    }

    var updateWits = function(doc) {
        var wit, corresp = parsedData.getWitnessesList().find(witId => {
            wit = witId
            return parsedData.getWitness(witId).corresp === doc;
        });
        if (config.mainDocId && corresp) {
            var currentWits = evtInterface.getState('currentWits');
            var index = currentWits.indexOf(wit);
            if (index === -1) {
                evtInterface.addWitnessAtIndex(wit, 0);
            } else if (index > 0) {
                evtInterface.switchWitnesses(currentWits[0], wit);
            }
        }
    }

    this.goToDiv = function (doc, div) {
        if (config.mainDocId && config.mainDocId !== doc) {
            changeView();
            updateWits(doc);
        }
        evtInterface.updateDiv(doc, div);
        evtInterface.updateState('secondaryContent', '');
        evtInterface.updateUrl();
    }

    this.goToPage = function (doc, page) {
        console.log(doc, page)
    }
    
    this.openDetails = function(doc) {
        vm.open[doc] = !vm.open[doc];
    }

    _console.log('TocCtrl running');
});
