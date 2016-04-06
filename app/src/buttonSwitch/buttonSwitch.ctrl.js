angular.module('evtviewer.buttonSwitch')

.controller('ButtonSwitchCtrl', function($timeout, $log, $scope, evtInterface, parsedData) {
    $scope.active   = false;
    $scope.disabled = false;
    
    var _console = $log.getInstance('button');

    $scope.setIcon = function() {
        var icon = '';
        switch(angular.lowercase($scope.icon)) {
            case 'add':
                icon = 'icon-plus';
                break;
            case 'filter':
            case 'filters':
                icon = 'icon-filter';
                break;
            case 'heatmap':
                icon = 'icon-evt_heatmap';
                break;
            case 'info':
                icon = 'fa-info-circle';
                break;
            case 'list':
                icon = 'icon-evt_list';
                break;
            case 'mode-imgtxt':
                icon = 'icon-evt_imgtxt';
                break;
            case 'mode-txttxt':
                icon = 'icon-evt_txttxt';
                break;
            case 'mode-critical':
                icon = 'icon-file-text';
                break;
            case 'mode-collation':
                icon = 'icon-evt_collation';
                break;
            case 'mode-bookreader':
                icon = 'icon-evt_bookreader';
                break;
            case 'pin':
                icon = 'icon-pushpin';
                break;
            case 'remove':
                icon = 'icon-cross';
                break;
            case 'search':
                icon = 'icon-evt_search';
                break;
            case 'bookmark':
                icon = 'icon-bookmark';
                break;
            case 'thumb':
            case 'thumbs':
            case 'thumbnail':
            case 'thumbnails':
                icon = 'icon-evt_thumb';
                break;
        }
        return icon;
    };
    
    $scope.doCallback = function() {
        if (!$scope.disabled) {
            $scope.active = !$scope.active;
            switch($scope.type) {
                case 'addWit':
                    var witnesses   = parsedData.getWitnessesList(), 
                        currentWits = evtInterface.getCurrentWitnesses() || [],
                        newWit,
                        i = 0;
                    while (newWit === undefined && i < witnesses.length) {
                        if ( currentWits.indexOf(witnesses[i]) < 0) {
                            newWit = witnesses[i];
                        }
                        i++;
                    }

                    if (newWit !== undefined) {
                        evtInterface.addWitness(newWit);
                        evtInterface.updateUrl();
                    }
                    $scope.active = false;
                    $timeout(function(){
                        var singleBox_width = window.getComputedStyle(document.getElementsByClassName('box')[0]).width.replace('px', '');
                        document.getElementById('compareWits_box').scrollLeft = singleBox_width*(currentWits.length+1);
                    });
                    break;
                case 'changeViewMode':
                    if ($scope.value !== undefined) {
                        evtInterface.updateCurrentViewMode($scope.value);
                        if ($scope.value === 'critical'){
                            evtInterface.updateCurrentEdition('critical');
                        }
                        evtInterface.updateUrl();
                    }
                    break; 
                case 'removeWit':
                    var wit = $scope.$parent.vm.witness;
                    evtInterface.removeWitness(wit);
                    evtInterface.updateUrl();
                    break;
                case 'searchInEdition':
                    var edition = $scope.$parent.vm.edition;
                    alert('Search in edition level '+edition+'. Coming Soon...');
                    break;
                case 'searchInWit':
                    var wit = $scope.$parent.vm.witness;
                    alert('Search in witness '+wit+'. Coming Soon...');
                    break;
                case 'share':
                case 'bookmark':
                    alert(window.location);
                    break;
                case 'toggleInfoWit':
                    var witness = parsedData.getWitness($scope.$parent.vm.witness);
                    var newTopBoxContent = witness.description || $scope.$parent.vm.topBoxContent;
                    $scope.$parent.vm.updateTopBoxContent(newTopBoxContent);
                    $scope.$parent.vm.toggleTopBox();
                    break;
                case 'toggleFilterApp':
                    $scope.$parent.vm.toggleFilterBox();
                    break;
                case 'witList':
                    var witnessesCollection = parsedData.getWitnesses();
                    var structure = witnessesCollection._indexes.encodingStructure;
                    var content;
                    content += '<ul>';
                    for (var i = 0; i < structure.length; i++) {
                        var element = witnessesCollection[structure[i]];
                        if (element._type === 'witness') {
                            content += '<li>';
                                content += '<strong>#'+element.id+'</strong><br /><div>'+element.description.innerHTML+'</div>';
                            content += '</li>';
                        } else {
                            content += '<li>';
                                content += '<strong>#'+element.id+'</strong><br /><div>'+element.name+'</div>';
                                content += '<ul>';
                                for (var j = 0; j < element.content.length; j++) {
                                    var subElement = witnessesCollection[element.content[j]];
                                    if (subElement._type === 'witness') {
                                        content += '<li>';
                                        content += '<strong>#'+subElement.id+'</strong><br /><div>'+subElement.description.innerHTML+'</div>';
                                        content += '</li>';
                                    }
                                    //TO RICORSIVA!!!            
                                }
                                content += '</ul>';
                            content += '</li>';
                        }
                    }
                    content += '</ul>';
                    var newTopBoxContent = content || $scope.$parent.vm.topBoxContent;
                    $scope.$parent.vm.updateTopBoxContent(newTopBoxContent);
                    $scope.$parent.vm.toggleTopBox();
                    break;
                default:
                    _console.log('TODO '+$scope.type);
                    break;
            }
        }
    };

    if ($scope.type === 'addWit') {
        if (evtInterface.getCurrentWitnesses().length === parsedData.getWitnessesList().length) {
            $scope.disabled = true;
            $scope.title = 'No more witnesses available';
        }

        $scope.$watch(function() {
            return evtInterface.getCurrentWitnesses();
        }, function(newItem, oldItem) {
            if (newItem !== oldItem) {
                if (newItem.length === parsedData.getWitnessesList().length) {
                    $scope.disabled = true;
                    $scope.title = 'No more witnesses available';
                } else {
                    $scope.disabled = false;
                    $scope.title = 'Add witness';
                }
            }
        }, true);
    }

    // TODO:  RIFARE!
    if ($scope.type === 'changeViewMode') {
        $scope.$watch(function() {
            return evtInterface.getCurrentViewMode();
        }, function(newItem, oldItem) {
            // if (newItem !== oldItem) {
                if (newItem === $scope.value) {
                    $scope.active = true;
                } else {
                    $scope.active = false;
                }
            // }
        }, true); 
    }
    // _console.log('ButtonCtrl running');
});