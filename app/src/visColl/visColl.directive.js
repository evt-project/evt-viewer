/**
 * @ngdoc directive
 * @module evtviewer.visColl
 * @name evtviewer.visColl.directive:evtViscoll
 * @description 
 * # evtViscoll
 * <p>Element that create a visColl view connected to a specific critical apparatus. </p>
 * <p>It can be used for go on with the pages, and see the popup of the chosen page.</p>
 * <p>When the user clicks on it, the connected page will be retrieved 
 * from the source encoded text (and stored in {@link evtviewer.dataHandler.parsedData parsedData}) and will be shown</p>
 * <p>It uses the {@link evtviewer.visColl.controller:ViscollCtrl ViscollCtrl} controller.</p>
 * <p>The initial scope is expanded in {@link evtviewer.visColl.evtViscoll evtViscoll} provider.</p>
 *
 * @scope
 * @param {string} appId id of chosen text.
 * @param {string} readingId id of the mode reading to be shown
 * @param {number=} currentPage id of the current page
 * @param {number=} firstPage id of the first page
 * @param {number=} lastPage id of the last page
 *
 * @restrict E
**/
angular.module('evtviewer.visColl')

.directive('evtViscoll', function(evtViscoll, parsedData, evtInterface) {
    return {
        restrict: 'E',
        scope: {
          // Insert here scope properties to be passed from HTML attributes
        },
        transclude: true,
        templateUrl: 'src/visColl/visColl.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'ViscollCtrl',
        link: function(scope, element, attrs){
            var currentViscoll = evtViscoll.build(scope);

			// scope.$watch(function() {
            //     return evtInterface.visCollTextUrl;
            // },function(newValue, oldValue) {
            // 	if (oldValue !== newValue) {
			// 		evtInterface.updateProperty('visCollTextUrl', newValue);
			// 	}
			// }, true);
			
			// scope.$watch(function() {
            //     return evtInterface.visCollStyleUrl;
            // },function(newValue, oldValue) {
            // 	if (oldValue !== newValue) {
			// 		evtInterface.updateProperty('visCollStyleUrl', newValue);
			// 	}
			// }, true);

            scope.$watch(function() {
                return parsedData.areViscollSvgsLoaded();
            },function(newValue, oldValue) {
                if (oldValue !== newValue && newValue === true) {
                    currentViscoll.displayResult();
                }
            }, true);
            
            scope.$watch(function () {
               return evtInterface.getState('currentViewMode');
            }, function (newValue, oldValue) {
               if (oldValue !== newValue) {
                  evtInterface.updateState('isThumbNailsOpened', false);
                  evtInterface.updateState('isVisCollOpened', false);
               }
            }, true);

            // Garbage collection
            scope.$on('$destroy', function() {
              if (currentViscoll) {
                currentViscoll.destroy();
              }
            });
        }
    };
});