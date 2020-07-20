angular.module('evtviewer.tdhop')
   .controller('TreDHOPCtrl', ['$scope', '$route', 'evtInterface', '$log', 'config', function ($scope, $route, evtInterface, $log, config) {
      var vm = this;
      var model1 = config.tdhopViewerOptions.Model_1 ? config.tdhopViewerOptions.Model_1.name : undefined;
      var model2 = config.tdhopViewerOptions.Model_2 ? config.tdhopViewerOptions.Model_2.name : undefined;
      $scope.change = function () {
         presenter.setInstanceVisibility(HOP_ALL, false, false);
         presenter.setInstanceVisibility('Mesh_2_mesh', true, true);
      }
      $scope.data = {
         model: null,
         availableOptions: [
            { id: 'Mesh_1_mesh', name: model1 + ' Cross' },
            { id: 'Mesh_2_mesh', name: model2 + ' Cross' },
         ]
      };
      $scope.button = {
         buttonValue: $scope.data,
      };

      this.isToolHomeAvailable = function () {
         return config.tdhopViewerOptions.toolHome;
      };
      this.isToolZoominAvailable = function () {
         return config.tdhopViewerOptions.toolZoomin;
      };
      this.isToolZoomoutAvailable = function () {
         return config.tdhopViewerOptions.toolZoomout;
      };
      this.isToolLightingAvailable = function () {
         return config.tdhopViewerOptions.toolLighting;
      };
      this.isToolLightControlAvailable = function () {
         return config.tdhopViewerOptions.toolLightControl;
      };
      this.isToolPlaneSectionsAvailable = function () {
         return config.tdhopViewerOptions.toolPlaneSections;
      };
      this.isToolSolidColorAvailable = function () {
         return config.tdhopViewerOptions.toolSolidColor;
      };
      this.isToolCameraAvailable = function () {
         return config.tdhopViewerOptions.toolCamera;
      };
      this.isToolMeasureAvailable = function () {
         return config.tdhopViewerOptions.toolMeasure;
      };
      this.isToolPickPointAvailable = function () {
         return config.tdhopViewerOptions.toolPickPoint;
      };
      this.isToolHotspotAvailable = function () {
         return config.tdhopViewerOptions.toolHotspot;
      };
      this.isToolFullScreenAvailable = function () {
         return config.tdhopViewerOptions.toolFullScreen;
      };
      this.isToolSwitchModelAvailable = function () {
         return config.tdhopViewerOptions.toolSwitchModel;
      };
      this.isToolArrowsAvailable = function () {
         return config.tdhopViewerOptions.toolArrows;
      };
      this.isToolLightControllerAvailable = function () {
         return config.tdhopViewerOptions.toolLightController;
      };
   }]);
