angular.module('evtviewer.tdhop')
   .controller('TreDHOPCtrl', ["$scope", "$route", "evtInterface", "$log", "config", function ($scope, $route, evtInterface, $log, config) {
      var vm = this;
      //console.log(isToolAvailable);
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
