angular.module('evtviewer.search')
   .controller('SearchResultsCtrl', ['$q', '$scope', '$location', '$anchorScroll', 'evtSearchResults', 'evtSearchBox', 'evtInterface', 'Utils',
      function ($q, $scope, $location, $anchorScroll, evtSearchResults, evtSearchBox, evtInterface, Utils) {
         var vm = this;
         
         vm.currentEdition = evtInterface.getState('currentEdition');
         vm.currentEditionResults = [];
         vm.visibleRes = [];
         vm.placeholder = '';
         vm.currentLineId = '';
         
         vm.getResultsNumber = function () {
            var results = vm.currentEditionResults,
               resNumber = 0;
            
            if (results) {
               results.forEach(function (result) {
                  resNumber += result.resultsNumber;
               });
            }
            
            return resNumber;
         };
         
         vm.getCurrentEditionResults = function () {
            return vm.currentEditionResults;
         };
   
         vm.getCurrentBoxEdition = function (boxId) {
            return evtSearchBox.getCurrentBoxEdition(boxId);
         };
         
         //TODO move in provider
         vm.getHighlightedOriginalText = function (docId, currentEdition, token, position) {
            var originalText = evtSearchResults.getOriginalText(docId, currentEdition),
               replace = '<strong>' + token + '</strong>',
               startPos = position[0],
               endPos = position[0] + position[1],
               highlightedText = Utils.replaceStringAt(originalText, token, replace, startPos, endPos);
            
            return evtSearchResults.getTextPreview(highlightedText, replace);
         };
   
         //TODO move in provider
         vm.loadMoreElements = function () {
            var i = 0,
               lastEl,
               newEl;
            
            while (i < 5 && i < vm.currentEditionResults.length) {
               lastEl = vm.visibleRes.length - 1;
               newEl = vm.currentEditionResults[lastEl + 1];
               
               if (newEl) {
                  vm.visibleRes.push(newEl);
               }
               i++;
            }
         };
         
         vm.range = function (lenght) {
            return new Array(lenght);
         };
         
         vm.toggle = function (event) {
            var eventTarget = $(event.currentTarget);
            eventTarget.toggleClass('active');
            eventTarget.siblings('.search-result').toggleClass('open');
         };
   
         vm.scrollToCurrentResult = function(event) {
            var promise = goToAnchor(event);
            promise.then(
               function() {
                  vm.scrollTo(vm.currentLineId);
               });
         };
         
         function goToAnchor(event) {
            var deferred = $q.defer(),
               mainBoxId = $scope.$parent.vm.parentBoxId;
            
            evtSearchBox.closeBox(mainBoxId, 'searchResultBox');
            evtSearchBox.showBtn(mainBoxId, 'searchResultsShow');
            evtSearchBox.hideBtn(mainBoxId, 'searchResultsHide');
            
            event.preventDefault();
            $(event.currentTarget).addClass('selected');
            vm.currentLineId = document.getElementsByClassName('resultInfo selected')[0].getElementsByClassName('resultLine')[0].getAttribute('id');
            goToAnchorPage();
            $(event.currentTarget).removeClass('selected');
   
            setTimeout(function() {
               deferred.resolve();
            }, 100);
            
            return deferred.promise;
         }
         
         function goToAnchorPage () {
            var anchorPageId = document.getElementsByClassName('resultInfo selected')[0].getElementsByClassName('resultPage')[0].getAttribute('id'),
               anchorDocId = document.getElementsByClassName('resultInfo selected')[0].getElementsByClassName('resultDoc')[0].getAttribute('id');
            
            evtInterface.updateState('currentPage', anchorPageId);
            evtInterface.updateState('currentDoc', anchorDocId);
            evtInterface.updateUrl();
         }
         
         vm.scrollTo = function(id) {
            $location.hash(id);
            $anchorScroll();
         };
         
      }]);
