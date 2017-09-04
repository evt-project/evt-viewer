/**
 * @ngdoc directive
 * @module evtviewer.apparatuses
 * @name evtviewer.apparatuses.directive:evtApparatuses
 * @description 
 * # evtApparatuses
 * <p>Custom elements shaped and styled as a {@link evtviewer.box.directive:box box} which will show
 * the list of all critical apparatuses (critical entries, parallel texts, sources, etc.), properly
 * divided into tabs.</p>
 * <p>It is strictly connected to main box: when the user clicks on an apparatus entry, the main edition text will scroll
 * to the referenced portion of text, and viceversa.</p>
 * <p>It uses the {@link evtviewer.apparatuses.controller:apparatusesCtrl apparatusesCtrl} controller.</p>
 *
 * @scope
 * @param {string=} currentApparatus id of current apparatus shown
 *
 * @requires $timeout
 * @requires evtviewer.apparatuses.evtApparatuses
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.criticalApparatusEntry.evtCriticalApparatusEntry
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
            /**
             * @ngdoc method
             * @name evtviewer.apparatuses.controller:apparatusesCtrl#scrollToAppEntry
             * @methodOf evtviewer.apparatuses.controller:apparatusesCtrl
             *
             * @description
             * <p>Scroll list of critical entries to reach a particular one. </p>
             * <p>If the entry we want to scroll to is not inside the visible list of elements,
             * it will load other elements until it finds it.</p>
             * @param {string} appId Identifier of critical apparatus entry to handle
             */
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
            /**
             * @ngdoc method
             * @name evtviewer.apparatuses.controller:apparatusesCtrl#scrollToQuotesEntry
             * @methodOf evtviewer.apparatuses.controller:apparatusesCtrl
             *
             * @description
             * <p>Scroll list of sources entries to reach a particular one. </p>
             * <p>If the entry we want to scroll to is not inside the visible list of elements,
             * it will load other elements until it finds it.</p>
             * @param {string} quoteId Identifier of sources apparatus entry to handle
             */
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
            /**
             * @ngdoc method
             * @name evtviewer.apparatuses.controller:apparatusesCtrl#scrollToAnaloguesEntry
             * @methodOf evtviewer.apparatuses.controller:apparatusesCtrl
             *
             * @description
             * <p>Scroll list of sources entries to reach a particular one. </p>
             * <p>If the entry we want to scroll to is not inside the visible list of elements,
             * it will load other elements until it finds it.</p>
             * @param {string} analogueId Identifier of analogues apparatus entry to handle
             */
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