angular.module('evtviewer.buttonSwitch')

.controller('ButtonSwitchCtrl', function($timeout, $log, $scope, evtInterface, parsedData) {
    $scope.active   = false;
    $scope.disabled = false;
    
    var _console = $log.getInstance('button');

    $scope.setIcon = function() {
        var icon = '';
        switch(angular.lowercase($scope.icon)) {
            case 'add':
                icon = 'icon-evt_add';
                break;
            case 'filter':
            case 'filters':
                icon = 'icon-evt_filter';
                break;
            case 'font-size':
                icon = 'icon-evt_font-size';
                break;
            case 'font-size-minus':
                icon = 'icon-evt_font-size-minus-alt';
                break;
            case 'font-size-plus':
                icon = 'icon-evt_font-size-plus-alt';
                break;
            case 'font-size-reset':
                icon = 'icon-evt_font-size-reset-alt';
                break;
            case 'heatmap':
                icon = 'icon-evt_heatmap-alt';
                break;
            case 'info':
                icon = 'icon-evt_info';
                break;
            case 'list':
                icon = 'icon-evt_list';
                break;
            case 'menu-vert':
                icon = 'icon-evt_more-vert';
                break;
            case 'mode-imgtxt':
                icon = 'icon-evt_imgtxt';
                break;
            case 'mode-txttxt':
                icon = 'icon-evt_txttxt';
                break;
            case 'mode-critical':
                icon = 'icon-evt_txt';
                break;
            case 'mode-collation':
                icon = 'icon-evt_collation';
                break;
            case 'mode-bookreader':
                icon = 'icon-evt_bookreader';
                break;
            case 'pin':
                icon = 'icon-evt_pin-alt-on';
                break;
            case 'pin-off':
                icon = 'icon-evt_pin-off';
                break;
            case 'pin-on':
                icon = 'icon-evt_pin-on';
                break;
            case 'remove':
                icon = 'icon-evt_close';
                break;
            case 'search':
                icon = 'icon-evt_search';
                break;
            case 'bookmark':
                icon = 'icon-evt_bookmark';
                break;
            case 'thumb':
            case 'thumbs':
            case 'thumbnail':
            case 'thumbnails':
                icon = 'icon-evt_thumb';
                break;
            case 'witnesses':
                icon = 'icon-evt_books';
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
                        var singleBoxWidth = window.getComputedStyle(document.getElementsByClassName('box')[0]).width.replace('px', '');
                        document.getElementById('compareWits_box').scrollLeft = singleBoxWidth*(currentWits.length+1);
                    });
                    break;
                case 'bookmark':
                    alert(window.location);
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
                case 'fontSizeDecrease':
                    $scope.$parent.vm.fontSizeDecrease();
                    $scope.active = !$scope.active;
                    break;
                case 'fontSizeIncrease':
                    $scope.$parent.vm.fontSizeIncrease();
                    $scope.active = !$scope.active;
                    break;
                case 'fontSizeReset':
                    $scope.$parent.vm.fontSizeReset();
                    $scope.active = !$scope.active;
                    break;
                case 'fontSizeTools':
                    var fontSizeBtnState = $scope.$parent.vm.getState('fontSizeBtn') || false;
                    $scope.$parent.vm.updateState('fontSizeBtn', !fontSizeBtnState);
                    break;
                case 'heatmap':
                    var heatMapState = $scope.$parent.vm.getState('heatmap') || false;
                    $scope.$parent.vm.updateState('heatmap', !heatMapState);
                    break;
                case 'pin':
                case 'pin-on':
                case 'pin-off':
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