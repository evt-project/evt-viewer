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
        var fileDescriptionContent = parsedData.getProjectInfo().fileDescription || '';
        if (fileDescriptionContent !== '') {
            $scope.tabs.fileDescription = {
                label   : 'File Description',
                name    : 'fileDescription',
                content : fileDescriptionContent || noContent
            };
            $scope.tabs._indexes.push('fileDescription');
        }

        /* encodingDescription */
        var encodingDescriptionContent = parsedData.getProjectInfo().encodingDescription || '';
        if (encodingDescriptionContent !== '') {
            $scope.tabs.encodingDescription = {
                label   : 'Encoding Description',
                name    : 'encodingDescription',
                content : encodingDescriptionContent || noContent
            };
            $scope.tabs._indexes.push('encodingDescription');
        }

        /* textProfile */
        var textProfileContent = parsedData.getProjectInfo().textProfile || '';
        if (textProfileContent !== '') {
            $scope.tabs.textProfile = {
                label   : 'Text Profile',
                name    : 'textProfile',
                content : textProfileContent || noContent
            };
            $scope.tabs._indexes.push('textProfile');
        }

        /* outsideMetadata */
        var outsideMetadataContent = parsedData.getProjectInfo().outsideMetadata || '';
        if (outsideMetadataContent !== '') {
            $scope.tabs.outsideMetadata = {
                label   : 'Outside Metadata',
                name    : 'outsideMetadata',
                content : outsideMetadataContent || noContent
            };
            $scope.tabs._indexes.push('outsideMetadata');
        }

        /* revisionHistory */
        var revisionHistoryContent = parsedData.getProjectInfo().revisionHistory || '';
        if (revisionHistoryContent !== '') {
            $scope.tabs.revisionHistory = {
                label   : 'Revision History',
                name    : 'revisionHistory',
                content : revisionHistoryContent || noContent
            };
            $scope.tabs._indexes.push('revisionHistory');
        }

        /* Bibliography */
        var bibliographyContent = '<evt-bibliography></evt-bibliography>';
        if (bibliographyContent !== '') {
            $scope.tabs.bibliography = {
                label   : 'Bibliography',
                name    : 'bibliography',
                content : bibliographyContent || noContent
            };
			$scope.tabs._indexes.push('bibliography');
        }
    }


    $scope.subContentOpened = $scope.tabs._indexes[0] || '';
    var _console = $log.getInstance('tabsContainer');

    _console.log('TabsContainerCtrl running');
});
