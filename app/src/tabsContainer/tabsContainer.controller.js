angular.module('evtviewer.tabsContainer')

.controller('TabsContainerCtrl', function($log, $scope, parsedData, evtInterface) {
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
	
	$scope.service=evtInterface;
	$scope.$watch('service.getHomePanel()', function(newVal) {
		if(newVal !== ''){
			$scope.toggleSubContent(newVal);
		}
	});
	
	$scope.service.setTabContainerPanel($scope.tabs);
	
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
		if (parsedData.getBibliographicRefsCollection()._indexes.length > 0) {
			var bibliographyContent = '<evt-bibliography></evt-bibliography>';
			if (bibliographyContent !== '') {
				$scope.tabs.bibliography = {
					label   : 'Bibliography',
					name    : 'bibliography',
					content : bibliographyContent || noContent,
					scrollDisabled: true
				};
				$scope.tabs._indexes.push('bibliography');
			}
		}
    } else if ($scope.type === 'entitiesList') {
        var entitiesCollection = parsedData.getNamedEntitiesCollection();
        $scope.tabs._indexes = entitiesCollection._indexes;
        for (var i = 0; i < entitiesCollection._indexes.length; i++) {
            var listIcon,
                listId = entitiesCollection._indexes[i],
                listType = entitiesCollection[listId] && entitiesCollection[listId]._type ? entitiesCollection[listId]._type : listId,
                listTitle = entitiesCollection[listId] && entitiesCollection[listId]._title? entitiesCollection[listId]._title : listId;
            switch(listType) {
                case 'place':
                    listIcon = 'fa-map-marker';
                    break;
                case 'person':
                    listIcon = 'fa-user';
                    break;
                case 'org':
                    listIcon = 'fa-users';
                    break;
                default:
                    listIcon = 'fa-list-ul';
                    break;
            };
            $scope.tabs[listId] = {
                label   : listTitle,
                icon    : listIcon,
                name    : listId,
                content : '<evt-list data-list-id="'+listId+'" data-list-type="'+listType+'"></evt-list>',
                scrollDisabled: true
            };
        }
    }


    $scope.subContentOpened = $scope.tabs._indexes[0] || '';
    var _console = $log.getInstance('tabsContainer');

    _console.log('TabsContainerCtrl running');
});
