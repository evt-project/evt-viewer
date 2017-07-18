/**
 * @ngdoc directive
 * @module evtviewer.apparatuses
 * @name evtviewer.apparatuses.directive:evtApparatuses
 * @description 
 * # evtApparatuses
 * TODO: Add description!
 * It uses the {@link evtviewer.apparatuses.controller:apparatusesCtrl apparatusesCtrl} controller.
 *
 * @scope
 * @param {string=} currentApparatus id of current apparatus shown
 *
 * @restrict E
**/
angular.module('evtviewer.apparatuses')

.directive('evtApparatuses', function($timeout, evtApparatuses, evtInterface, evtCriticalApparatusEntry) {
    return {
        restrict: 'E',
        scope: {
            currentApparatus: '@'
        },
        transclude: true,
        templateUrl: 'src/apparatuses/apparatuses.dir.tmpl.html',
        controllerAs: 'vm',
        controller: 'apparatusesCtrl',
        link: function(scope, element, attrs) {
            var currentApparatuses = evtApparatuses.build(scope);
            scope.$on('$destroy', function() {
                if (currentApparatuses) {
                    currentApparatuses.destroy();
                }
            });

            scope.vm.scrollToAppEntry = function(appId) {
                var appIndex = 'criticalApparatus';
                if (currentApparatuses.apparatuses[appIndex]) {
                    var appElem = $('#apparatuses_'+currentApparatuses.uid).find('[data-app-id=\''+appId+'\']');
                    if (appElem.length <= 0) {
                        currentApparatuses.isLoading = true;
                    }
                    $timeout(function(){
                        var mainContainer = angular.element(element).find('.apparatuses_content_body')[0];
                        var padding = window.getComputedStyle(mainContainer, null).getPropertyValue('padding-top').replace('px', '')*1;
                        if (appElem.length <= 0) {
                            currentApparatuses.isLoading = true;
                            if (currentApparatuses.apparatuses[appIndex].list.indexOf(appId) >= 0) {
                                if (appIndex === currentApparatuses.currentApparatus) {
                                    currentApparatuses.loadMoreElements('criticalApparatus');
                                    currentApparatuses.scrollToAppEntry(appId);
                                } else {
                                    currentApparatuses.isLoading = false;
                                }
                            }
                        } else if (appElem[0] !== undefined) {
                            mainContainer.scrollTop = appElem[0].offsetTop - (padding*3);
                            currentApparatuses.isLoading = false;
                        }
                    });
                }
            };

            scope.vm.scrollToQuotesEntry = function(quoteId) {
                var appIndex = 'sources';
                if (currentApparatuses.apparatuses[appIndex]) {
                    var appElem = $('#apparatuses_'+currentApparatuses.uid).find('[data-quote-id=\''+quoteId+'\']');
                    if (appElem.length <= 0) {
                        currentApparatuses.isLoading = true;
                    }
                    $timeout(function(){
                        var mainContainer = angular.element(element).find('.apparatuses_content_body')[0];
                        var padding = window.getComputedStyle(mainContainer, null).getPropertyValue('padding-top').replace('px', '')*1;
                        if (appElem.length <= 0) {
                            currentApparatuses.isLoading = true;
                            if (currentApparatuses.apparatuses[appIndex].list.indexOf(quoteId) >= 0) {
                                if (appIndex === currentApparatuses.currentApparatus) {
                                    currentApparatuses.loadMoreElements('sources');
                                    currentApparatuses.scrollToQuotesEntry(quoteId);
                                } else {
                                    currentApparatuses.isLoading = false;
                                }
                            }
                        } else if (appElem[0] !== undefined) {
                            mainContainer.scrollTop = appElem[0].offsetTop - (padding*3);
                            currentApparatuses.isLoading = false;
                        }
                    });
                }
            };

            scope.vm.scrollToAnaloguesEntry = function(analogueId) {
                var appIndex = 'analogues';
                if (scope.vm.apparatuses[appIndex]) {
                    var appElem = $('#apparatuses_'+currentApparatuses.uid).find('[data-analogue-id=\''+analogueId+'\']');
                    if (appElem.length <= 0) {
                        currentApparatuses.isLoading = true;
                    }
                    $timeout(function(){
                        var mainContainer = angular.element(element).find('.apparatuses_content_body')[0];
                        var padding = window.getComputedStyle(mainContainer, null).getPropertyValue('padding-top').replace('px', '')*1;
                        if (appElem.length <= 0) {
                            currentApparatuses.isLoading = true;
                            if (currentApparatuses.apparatuses[appIndex].list.indexOf(analogueId) >= 0) {
                                if (appIndex === currentApparatuses.currentApparatus) {
                                    currentApparatuses.loadMoreElements('analogues');
                                    currentApparatuses.scrollToAnaloguesEntry(analogueId);
                                } else {
                                    currentApparatuses.isLoading = false;
                                }
                            }
                        } else if (appElem[0] !== undefined) {
                            mainContainer.scrollTop = appElem[0].offsetTop - (padding*3);
                            currentApparatuses.isLoading = false;
                        }
                    });
                }
            };

            // Necessary for first load page/app entry alignment
            // TODO: Distinguish among current app / source / analogue
            if (currentApparatuses.currentApparatus === 'criticalApparatus') {
                var currentAppId = evtInterface.getState('currentAppEntry');
                if (currentAppId) {
                    scope.vm.scrollToAppEntry(currentAppId);
                    $timeout(function(){ 
                        evtCriticalApparatusEntry.selectById(currentAppId);
                    }, 200);
                } else {
                    currentApparatuses.isLoading = false;
                }
            } else {
                $timeout(function(){ 
                    currentApparatuses.isLoading = false;
                }, 200);
            }
        }
    };
});