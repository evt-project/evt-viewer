angular.module('evtviewer.search')
   .provider('evtVirtualKeyboard', function() {
      var vm = this;
      
      vm.$get = function(evtKeyboard, evtInterface) {
         var keyboard = [],
            keyboardCollection = {},
            parentBoxId,
            keyboardId,
            defaultKeyboardKeys,
            keyboardKeys;
         
         keyboard.build = function(scope, vm, defaultKeyboardKeys) {
            parentBoxId = scope.$parent.id;
            keyboardId = scope.$parent.id + 'Keyboard';
            keyboardKeys = '';
            defaultKeyboardKeys = getDefaultKeyboardKeys();
            
            for (var kbKey in defaultKeyboardKeys) {
               keyboardKeys += defaultKeyboardKeys[kbKey] + ':' + kbKey + ' ';
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
               appendTo: '#' + parentBoxId +' .search-box .keyboard-container'
            });
           
           var scopeHelper = {
              keyboardId: keyboardId
           };
           
           keyboardCollection[keyboardId] = angular.extend(vm, scopeHelper);
           return keyboardCollection[keyboardId];
         };
   
         function getDefaultKeyboardKeys() {
            return evtKeyboard.getDefaultKeyboardKeys();
         }
         
         keyboard.getKeyboards = function() {
           return keyboardCollection;
         }
         
         keyboard.unselectCurrentKeyboard = function(button, parentBoxId) {
            var keyboardBtn = button.getByType('searchVirtualKeyboard'),
               keyboard = $('#' + parentBoxId + 'Keyboard').getkeyboard();
            
            if(keyboardBtn.length === 1) {
               keyboardBtn[0].setActive(false);
            }
            keyboard.close();
         }
         
         return keyboard;
      };
   });
