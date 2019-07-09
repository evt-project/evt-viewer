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
        var wit, corresp = parsedData.getWitnessesList().find(function(witId) {
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

    var getAvailableEditionLevels = function() {
        var editions = parsedData.getEditions();
        var availableEditions = [];
        for (var i = 0; i < editions.length; i++) {
            if (editions[i].visible) {
                availableEditions.push(editions[i].value);
            }
        }
        return availableEditions;
    }

    this.goToDiv = function (doc, div) {
        var editions = getAvailableEditionLevels();
        if (evtInterface.getState('currentEdition') !== 'critical' && editions.indexOf('critical') > -1) {
            evtInterface.updateState(currentEdition, 'critical');
        }
        evtInterface.updateState('currentDoc', doc);
        evtInterface.updateDiv(doc, div);
        evtInterface.updateState('secondaryContent', '');
        evtInterface.updateUrl();
    }

    this.goToPage = function (doc, page) {
        var editions = getAvailableEditionLevels();
        if (evtInterface.getState('currentEdition') === 'critical' && editions > 0) {
            var edition = editions.indexOf(config.defaultEdition) > -1 ? config.defaultEdition : editions[0];
            evtInterface.updateState(currentEdition, edition);
        }
        evtInterface.updateState('currentDoc', doc);
        evtInterface.updateState('currentPage', page);
        evtInterface.updateState('secondaryContent', '');
        evtInterface.updateUrl();
    }
    
    this.openDetails = function(doc) {
        vm.open[doc] = !vm.open[doc];
    }

    _console.log('TocCtrl running');
});
