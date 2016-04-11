angular.module('evtviewer.tabsContainer')

.controller('TabsContainerCtrl', function($log, $scope, parsedData) {
    $scope.subContentOpened = '';
    $scope.tabs = {
        _indexes : []
    };
    
    $scope.toggleSubContent = function(subContentName) {
        if ($scope.subContentOpened !== subContentName) {
            $scope.subContentOpened = subContentName;
        } else {
            $scope.subContentOpened = '';
        }
    };

    if ($scope.type === 'projectInfo') {
        $scope.tabs.generalInfo = {
            label   : 'General Info',
            name    : 'generalInfo',
            content : '<span>This is general info.</span>'
        };
        $scope.tabs._indexes.push('generalInfo');

        $scope.tabs.publicationInfo = {
            label   : 'Publication Info',
            name    : 'publicationInfo',
            content : '<span>This is publication info.</span>'
        };
        $scope.tabs._indexes.push('publicationInfo');

        $scope.tabs.projectDesc = {
            label   : 'Project Description',
            name    : 'projectDesc',
            content : '<span>This is project description.</span>'
        };
        $scope.tabs._indexes.push('projectDesc');
    }
    
    $scope.subContentOpened = $scope.tabs._indexes[0] || '';
    var _console = $log.getInstance('tabsContainer');

    _console.log('TabsContainerCtrl running');
});