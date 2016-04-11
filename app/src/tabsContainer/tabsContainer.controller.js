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
        var noContent = '<span>No content</span>';

        /* fileDescription */
        if (parsedData.getProjectInfo().fileDescription !== '') {
            $scope.tabs.fileDescription = {
                label   : 'File Description',
                name    : 'fileDescription',
                content : parsedData.getProjectInfo().fileDescription || noContent
            };
            $scope.tabs._indexes.push('fileDescription');
        }

        /* encodingDescription */
        if (parsedData.getProjectInfo().encodingDescription !== '') {
            $scope.tabs.encodingDescription = {
                label   : 'Encoding Description',
                name    : 'encodingDescription',
                content : parsedData.getProjectInfo().encodingDescription || noContent
            };
            $scope.tabs._indexes.push('encodingDescription');
        }

        /* textProfile */
        if (parsedData.getProjectInfo().textProfile !== '') {
            $scope.tabs.textProfile = {
                label   : 'Text Profile',
                name    : 'textProfile',
                content : parsedData.getProjectInfo().textProfile || noContent
            };
            $scope.tabs._indexes.push('textProfile');
        }

        /* outsideMetadata */
        if (parsedData.getProjectInfo().outsideMetadata !== '') {
            $scope.tabs.outsideMetadata = {
                label   : 'Outside Metadata',
                name    : 'outsideMetadata',
                content : parsedData.getProjectInfo().outsideMetadata || noContent
            };
            $scope.tabs._indexes.push('outsideMetadata');
        }

        /* revisionHistory */
        if (parsedData.getProjectInfo().revisionHistory !== '') {
            $scope.tabs.revisionHistory = {
                label   : 'Revision History',
                name    : 'revisionHistory',
                content : parsedData.getProjectInfo().revisionHistory || noContent
            };
            $scope.tabs._indexes.push('revisionHistory');
        }
    }

    
    $scope.subContentOpened = $scope.tabs._indexes[0] || '';
    var _console = $log.getInstance('tabsContainer');

    _console.log('TabsContainerCtrl running');
});