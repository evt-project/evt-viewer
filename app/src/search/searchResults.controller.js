angular.module('evtviewer.search')
   .controller('SearchResultsCtrl', ['$q', '$scope', '$location', '$anchorScroll', 'evtSearchResults', 'evtSearchBox', 'evtInterface', 'Utils', 'parsedData', 'config', 'evtDialog',
      function ($q, $scope, $location, $anchorScroll, evtSearchResults, evtSearchBox, evtInterface, Utils, parsedData, config, evtDialog) {
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
         
         vm.toggle = function () {
            $(function () {
               $(event.target).toggleClass('active');
               $(event.target).siblings('.search-result').toggleClass('open');
            });
         };
   
         vm.scrollToCurrentResult = function(result, index) {
            scrollInfo = {};
            vm['selectedResult'] = result;
            var promise = goToAnchor(result, index);
            promise.then(
               function() {
                  vm.scrollTo(vm.currentLineId);
               });
         }
         function goToAnchor(result, index) {
            var deferred = $q.defer(),
               eventElement,
               mainBoxId = $scope.$parent.vm.parentBoxId;
            
            evtSearchBox.closeBox(mainBoxId, 'searchResultBox');
            evtSearchBox.showBtn(mainBoxId, 'searchResultsShow');
            evtSearchBox.hideBtn(mainBoxId, 'searchResultsHide');
            
            window.event.preventDefault();
            eventElement = window.event.currentTarget;
            $(eventElement).addClass('selected');
            if (result && result.metadata.lbId && index) {
                  vm.currentLineId = result.metadata.lbId[index];
            }
            evtInterface.updateState('secondaryContent', '');
            evtDialog.closeByType('externalSearch');
            evtSearchResults.removeHighlights(result.token);
            var scrollInfo;
            if (parsedData.getPages().length > 0) {
                  goToAnchorPage();
            } else if (parsedData.getDivs().length > 0) {
                  scrollInfo = goToDiv(result, index);
            }
            $(eventElement).removeClass('selected');
            deferred.resolve();
            
            return deferred.promise;
         }
         
         function goToAnchorPage () {
            var anchorPageId = document.getElementsByClassName('resultInfo selected')[0].getElementsByClassName('resultPage')[0].getAttribute('id'),
               anchorDocId = document.getElementsByClassName('resultInfo selected')[0].getElementsByClassName('resultDoc')[0].getAttribute('id');
            
            evtInterface.updateState('currentPage', anchorPageId);
            evtInterface.updateState('currentDoc', anchorDocId);
            evtInterface.updateUrl();
         }

         function goToDiv(result, index) {
               var targetDoc = result.metadata.xmlDocId[index],
                   targetDiv = result.metadata.divId[index];
               if (config.mainDocId && targetDoc !== config.mainDocId) {
                  var wit = parsedData.getWitnessesList().find(witId => {
                        return parsedData.getWitness(witId).corresp === targetDoc;
                  });
                  if (wit) {
                        var wits = evtInterface.getState('currentWits'),
                            witIndex = wits.indexOf(wit);
                        if (witIndex >= 0) {
                              evtInterface.removeWitness(wit);
                        }
                        evtInterface.addWitnessAtIndex(wit, witIndex + 1);
                  }
                  if (evtInterface.getState('currentViewMode') !== 'collation') {
                        evtInterface.updateState('currentViewMode', 'collation');
                  }
            }
               evtInterface.updateDiv(targetDoc, targetDiv);
               evtInterface.updateUrl();
               return { targetDoc: targetDoc, wit: wit };
         }

         function scrollToNode(node, scroll) {
            if (!node) {
                  return;
            }
            var currentBoxes = evtBox.getList(), boxId;
            currentBoxes.forEach((box) => {
               if (scroll.wit && box.type === 'witness' && box.witness === scroll.wit) {
                  boxId = box.id;
               } else if (scroll.targetDoc === config.mainDocId) {
                  boxId = 'mainText';
               }
            });
            var boxElem = document.getElementById(boxId),
                boxBody = angular.element(boxElem).find('.box-body')[0],
                padding = window.getComputedStyle(boxBody, null).getPropertyValue('padding-top').replace('px', '')*1;
            boxBody.scrollTop = node.parentElement.offsetTop - padding;
            setTimeout(function() {
               evtSearchResults.removeHighlights();
            }, 8000);
         }
         
         vm.scrollTo = function(id) {
            $location.hash(id);
            $anchorScroll();
         };
         
      }]);
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
   