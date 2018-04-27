angular.module('evtviewer.search')

.controller('SearchResultsCtrl',['evtSearchResultsProvider', 'evtSearchResults', 'evtInterface', 'evtSearchBox', function(evtSearchResultsProvider, evtSearchResults, evtInterface, evtSearchBox) {
   var vm = this;
   
   vm.currentEdition = evtInterface.getState('currentEdition');
   vm.currentEditionResults = [];
   vm.visibleRes = [];
   vm.placeholder = '';
   
   vm.getState = function(key) {
      return evtSearchResultsProvider.getStatus(key);
   };
   
   vm.getInputValue = function() {
     return evtSearchResultsProvider.getInputValue();
   };
   
   vm.getResultsNumber = function() {
      return evtSearchResultsProvider.getResultsNumber();
   };

   vm.getHighlightedOriginalText = function(docId, currentEdition, token) {
      var originalText = evtSearchResultsProvider.getOriginalText(docId, currentEdition);
      originalText = originalText.replace(token, '<strong>' + token + '</strong>');
      return originalText;
   };
   
   vm.loadMoreElements = function() {
      var i = 0,
         lastEl,
         newEl;
      
      while(i < 5 && i < vm.currentEditionResults.length) {
        lastEl = vm.visibleRes.length - 1;
        newEl = vm.currentEditionResults[lastEl + 1];
        
        if(newEl) {
           vm.visibleRes.push(newEl);
        }
        i++;
      }
   };
   
   vm.range = function(lenght) {
      return new Array(lenght);
   };
   
   vm.toggle = function() {
      $(function() {
         $(event.target).toggleClass('active');
         $(event.target ).siblings('.search-result').toggleClass('open');
      });
   };
   
   vm.goToAnchor = function() {
      var eventElement;
      
      evtSearchResultsProvider.closeBox('searchResults');
      evtSearchResultsProvider.showSearchResultsShowBtn();
      eventElement = window.event.currentTarget;
      $(eventElement).addClass('selected');
      vm.goToAnchorPage();
      $(eventElement).removeClass('selected');
   };
   
   vm.goToAnchorPage = function() {
     var anchorPageId = document.getElementsByClassName('resultInfo selected')[0].getElementsByClassName('resultPage')[0].getAttribute('id'),
        anchorDocId = document.getElementsByClassName('resultInfo selected')[0].getElementsByClassName('resultDoc')[0].getAttribute('id');
      
     evtInterface.updateState('currentPage', anchorPageId);
     evtInterface.updateState('currentDoc', anchorDocId);
     evtInterface.updateUrl();
   };
}]);
