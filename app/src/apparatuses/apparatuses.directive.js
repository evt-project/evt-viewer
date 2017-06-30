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

            var mainContainer = angular.element(element).find('.apparatuses_main')[0];
            scope.vm.scrollToAppEntry = function(appId) {
                $timeout(function(){
                    var appElem = $('#apparatuses_'+currentApparatuses.uid).find('[data-app-id=\''+appId+'\']');
                    var padding = window.getComputedStyle(mainContainer, null).getPropertyValue('padding-top').replace('px', '')*1;
                    if (appElem.length <= 0) {
                        var appIndex = scope.vm.getAppIndex('Critical Apparatus');
                        if (scope.vm.apparatuses[appIndex].list.indexOf(appId) >= 0) {
                            currentApparatuses.loadMoreElements('Critical Apparatus');
                            currentApparatuses.scrollToAppEntry(appId);
                        }
                    } else if (appElem[0] !== undefined) {
                        mainContainer.scrollTop = appElem[0].offsetTop - (padding*2);
                    }
                });
            };

            scope.vm.scrollToQuotesEntry = function(quoteId) {
                $timeout(function(){
                    var appElem = $('#apparatuses_'+currentApparatuses.uid).find('[data-quote-id=\''+quoteId+'\']');
                    var padding = window.getComputedStyle(mainContainer, null).getPropertyValue('padding-top').replace('px', '')*1;
                    if (appElem.length <= 0) {
                        var appIndex = scope.vm.getAppIndex('Sources');
                        if (scope.vm.apparatuses[appIndex].list.indexOf(quoteId) >= 0) {
                            currentApparatuses.loadMoreElements('Sources');
                            currentApparatuses.scrollToQuotesEntry(quoteId);
                        }
                    } else if (appElem[0] !== undefined) {
                        mainContainer.scrollTop = appElem[0].offsetTop - (padding*2);
                    }
                });
            };

            scope.vm.scrollToAnaloguesEntry = function(analogueId) {
                $timeout(function(){
                    var appElem = $('#apparatuses_'+currentApparatuses.uid).find('[data-analogue-id=\''+analogueId+'\']');
                    var padding = window.getComputedStyle(mainContainer, null).getPropertyValue('padding-top').replace('px', '')*1;
                    if (appElem.length <= 0) {
                        var appIndex = scope.vm.getAppIndex('Analogues');
                        if (scope.vm.apparatuses[appIndex].list.indexOf(analogueId) >= 0) {
                            currentApparatuses.loadMoreElements('Analogues');
                            currentApparatuses.scrollToAnaloguesEntry(analogueId);
                        }
                    } else if (appElem[0] !== undefined) {
                        mainContainer.scrollTop = appElem[0].offsetTop - (padding*2);
                    }
                });
            };

            // Necessary for first load page/app entry alignment
            // TODO: Distinguish among current app / source / analogue
            var pageId, 
                currentAppId = evtInterface.getCurrentAppEntry();
            scope.vm.scrollToAppEntry(currentAppId);
            $timeout(function(){ 
                evtCriticalApparatusEntry.selectById(currentAppId);
            }, 200);
        }
    };
});