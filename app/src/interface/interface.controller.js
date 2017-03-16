angular.module('evtviewer.interface')

.controller('InterfaceCtrl', function($log, $timeout, $injector, $scope, $route, evtInterface, evtButtonSwitch, evtBox, parsedData, evtSelect, evtPopover, evtCommunication, evtDialog) {    
    var _console = $log.getInstance('interface');


	
    $scope.getCurrentViewMode = function() {
        return evtInterface.getCurrentViewMode();
    };

    $scope.getCurrentPage = function() {
        return evtInterface.getCurrentPage();
    };

    $scope.getCurrentDocument = function() {
        return evtInterface.getCurrentDocument();
    };

    $scope.getCurrentEdition = function() {
        return evtInterface.getCurrentEdition();
    };

    $scope.getAvailableWitnesses = function(){
        return evtInterface.getAvailableWitnesses();
    };

    $scope.isWitnessSelectorActive = function(){
        return evtInterface.getProperty('witnessSelector');
    };

    $scope.addWitness = function(wit){
        if (wit !== undefined) {
            evtInterface.addWitness(wit);
            evtInterface.updateUrl();
        }
        $timeout(function(){
            var singleBoxWidth = window.getComputedStyle(document.getElementsByClassName('box')[0]).width.replace('px', '');
            document.getElementById('compareWits_box').scrollLeft = singleBoxWidth*(evtInterface.getCurrentWitnesses().length+1);
        });
        evtInterface.updateProperty('witnessSelector', false);
    };

    $scope.getWitness = function(wit){
        var desc = wit+' - '+parsedData.getWitness(wit).description.textContent.trim() || wit;
        desc = desc.length > 30 ? desc.substr(0, 30)+'...' : desc;
        return desc;
    };
    
    $scope.getCurrentWitnesses = function() {
        return evtInterface.getCurrentWitnesses();
    };
    
    $scope.getCurrentWitnessPage = function(wit) {
        return evtInterface.getCurrentWitnessPage(wit);
    };

    $scope.getAvailableViewModes = function() {
        return evtInterface.getAvailableViewModes();
    };
    
    $scope.existCriticalText = function() {
        return evtInterface.existCriticalText();
    };

    $scope.getCurrentAppEntry = function() {
        return evtInterface.getCurrentAppEntry();
    };

    $scope.updateCurrentAppEntry = function(entry) {
        evtInterface.updateCurrentAppEntry(entry);
        if (evtInterface.getCurrentViewMode() === 'readingTxt') {
            evtBox.alignScrollToApp(entry);
        }
        evtInterface.updateUrl();
    };

    $scope.getPinnedEntries = function() {
        return evtInterface.getPinnedEntries();
    };

    $scope.isLoading = function() {
        var error = evtCommunication.getError();
        return evtInterface.isLoading() && error.title === '';
    };

    $scope.isPinnedAppBoardOpened = function(){
        return evtInterface.isPinnedAppBoardOpened();
    };

    $scope.isToolAvailable = function(toolName){
        return evtInterface.isToolAvailable(toolName);
    };

    $scope.getSecondaryContentOpened = function(){
        return evtInterface.getSecondaryContentOpened();
    };
	
	$scope.updateSecondaryContentOpened = function(val){
        return evtInterface.updateSecondaryContentOpened(val);
    };
	
    $scope.getProjectInfo = function(){
        return parsedData.getProjectInfo();
    };

    $scope.getWitnessesListFormatted = function(){
        return parsedData.getWitnessesListFormatted();
    };

    $scope.getProperty = function(name){
        return evtInterface.getProperty(name);
    };
    
    $scope.handleGenericClick = function($event){
        var target = $event.target;
        if ($(target).parents('evt-select').length === 0){
            evtSelect.closeAll();
        }
        if ($(target).parents('button-switch').length === 0){
            var skipBtnTypes = ['standAlone', 'toggler'];
            evtButtonSwitch.unselectAllSkipByBtnType('', skipBtnTypes);
        }
        if ($(target).parents('evt-popover').length === 0){
            evtPopover.closeAll();
        }
        //Temp
        if ($(target).parents('.witnessSelector').length === 0){
            if (evtInterface.getProperty('witnessSelector')){
                evtInterface.updateProperty('witnessSelector', false);
            }
        }
    };

    $scope.handleKeydownEvent = function($event){
        if ($event.keyCode === 27) {
            evtDialog.closeAll();
        }
    };

    $scope.getBookmark = function() {
        var projectRef = parsedData.getProjectInfo().editionReference || {};
        var output = '<div class="bookmark">';
        output += projectRef.author ? projectRef.author+'. ' : '';
        output += projectRef.title ? '<em>'+projectRef.title+'</em>. ' : '';
        output += projectRef.publisher ? 'Published by '+projectRef.publisher+'. ' : '';
        output += '<<a href="'+window.location+'" target="blank">'+window.location+'</a>>';
        output += '</div>';
        return output;
    };

    $scope.getErrorMsg = function(){
        return evtCommunication.getError();
    };
    
    _console.log('InterfaceCtrl running');
	
	//test-debug
	$scope.updateSecondaryContentOpened(' ');
	evtInterface.allowProgrammaticOpenings(true);
	evtInterface.setTypeallowed('Project Info',true);
	evtInterface.setHomePanel('bibliography');
	//test-debug
})

//TODO: Move this directive in a proper file
.directive('ref', [function () {
    return {
        restrict: 'C',
        scope: {
            target : '@'
        },
        template: '<a href="{{target}}" ng-transclude></a>',
        replace: true,
        transclude: true,
        link: function (scope, iElement, iAttrs) {
            // scope.href = scope.target;
        }
    };
}]);

