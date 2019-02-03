angular.module('evtviewer.search')
   .provider('evtVirtualKeyboard', function() {
      var vm = this;
      
      vm.$get = ['evtKeyboard', 'config', '$rootScope', function(evtKeyboard, config, $rootScope) {
         var keyboard = [],
            keyboardCollection = {},
            parentBoxId,
            keyboardId,
            keyboardBtns = [],
            defaultKeyboardKeys,
            configKeys,
            keyboardKeys,
            configKeyboardKeys,
            glyphInXmlDoc;
         
         keyboard.build = function(scope, vm) {
            parentBoxId = scope.$parent.id;
            keyboardId = parentBoxId + 'Keyboard';
            keyboardKeys = '';
            configKeys = config.virtualKeyboardKeys;
            glyphInXmlDoc = evtKeyboard.getGlyphInXmlDoc();
            
            if(configKeys.length !== 0){
               configKeyboardKeys = getConfigKeyboardKeys(configKeys);
               for (var k in configKeyboardKeys) {
                  for (var g in glyphInXmlDoc) {
                     if(g === k) {
                        keyboardKeys += glyphInXmlDoc[g] + ':' + k + ' ';
                     }
                  }
               }
            }
            else {
               defaultKeyboardKeys = getDefaultKeyboardKeys();
               for (var kbKey in defaultKeyboardKeys) {
                  keyboardKeys += defaultKeyboardKeys[kbKey] + ':' + kbKey + ' ';
               }
            }
            
            $('#'+parentBoxId + ' .search-box input').keyboard({
               layout: 'custom',
               customLayout: {
                    'normal' : [
                       keyboardKeys
                   ]
                },
               usePreview: false,
               openOn: null,
               stayOpen: true,
               autoAccept : true,
               appendTo: '#' + parentBoxId +' .search-box .keyboard-container',
               change: function(e, kb) {
                  parentBoxId = scope.$parent.id;
                  kb.originalContent = kb.$preview.val();
                  scope.vm.searchInput = kb.originalContent;
                  scope.vm.highlightSearchResults(parentBoxId, scope.vm.searchInput);
               }
            });
           
           var scopeHelper = {
              keyboardId: keyboardId,
              keyboardBtns: keyboardBtns
           };
           
           keyboardCollection[parentBoxId] = angular.extend(vm, scopeHelper);
           return keyboardCollection[parentBoxId];
         };
   
         function getDefaultKeyboardKeys() {
            return evtKeyboard.getDefaultKeyboardKeys();
         }
         
         function getConfigKeyboardKeys(configKeys) {
            return evtKeyboard.getConfigKeyboardKeys(configKeys);
         }
         
         keyboard.getKeyboardId = function (parentBoxId) {
           return keyboardCollection[parentBoxId].keyboardId;
         };
         
         keyboard.unselectCurrentKeyboard = function(button, parentBoxId) {
            var keyboard = $('#' + parentBoxId + 'Keyboard').getkeyboard(),
               currentKeyboardBtn;
            
            if(keyboard !== undefined) {
               for(var i in keyboardBtns) {
                  if(keyboardBtns[i].parentId === parentBoxId) {
                     currentKeyboardBtn = keyboardBtns[i].btn;
                  }
               }
               keyboard.close();
               currentKeyboardBtn.setActive(false);
            }
         };
   
         $rootScope.$on('keyboardBtn', function(e, data){
            keyboardBtns.push(data);
         });
         
         return keyboard;
      }];
   });
