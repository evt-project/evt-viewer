'use strict';
/**
 * @ngdoc module
 * @name evtviewer.tdhop
 * @module evtviewer.tdhop
 * @description ...
**/
angular.module('evtviewer.tdhop', ['evtviewer.tdhopService']);

(function () {
   var tdhopModule = angular.module('evtviewer.tdhop', ['evtviewer.tdhopService']);

   tdhopModule.controller('TreDHOPCtrl', ['$scope','tdhopViewerModel', function ($scope, tdhopViewerModel) {
         $scope.options = tdhopViewerModel.getOptions();
      }]);
})();
