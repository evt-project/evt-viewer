angular.module('evtviewer.search')
   .provider('evtVirtualKeyboard', function() {
      var vm = this;
      
      vm.$get = ['evtKeyboard', 'config', function(evtKeyboard, config) {
         var keyboard = [],
            keyboardCollection = {},
            parentBoxId,
            keyboardId,
            defaultKeyboardKeys,
            configKeys,
            keyboardKeys,
            configKeyboardKeys;
            
         
         keyboard.build = function(scope, vm) {
            parentBoxId = scope.$parent.id;
            keyboardId = parentBoxId + 'Keyboard';
            keyboardKeys = '';
            configKeys = config.virtualKeyboardKeys;
            defaultKeyboardKeys = getDefaultKeyboardKeys();
            
            if(configKeys.length !== 0){
               configKeyboardKeys = getConfigKeyboardKeys(configKeys);
               for (var k in configKeyboardKeys) {
                  keyboardKeys += defaultKeyboardKeys[k] + ':' + k + ' ';
               }
            }
            else {
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
                  kb.originalContent = kb.$preview.val();
                  scope.vm.searchInput = kb.originalContent;
               }
            });
           
           var scopeHelper = {
              keyboardId: keyboardId
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
            var keyboardBtn = button.getByType('searchVirtualKeyboard'),
               keyboard = $('#' + parentBoxId + 'Keyboard').getkeyboard();
            
            if(keyboard !== undefined) {
               if(keyboardBtn.length === 1) {
                  keyboardBtn[0].setActive(false);
               }
               keyboard.close();
            }
         };
         
         return keyboard;
      }];
   });
