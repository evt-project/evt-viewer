angular.module('evtviewer.search')
   .provider('evtVirtualKeyboard', function() {
      var vm = this;
      
      vm.$get = function() {
         var keyboard = [],
            keyboardCollection = {},
            keyboardId;
         
         keyboard.build = function(scope, vm) {
            keyboardId = scope.$parent.id + 'Keyboard';
            
           $('#'+keyboardId).keyboard({
              layout: 'custom',
              customLayout: {
                 'normal' : [
                    // "n(a):title_or_tooltip"; n = new key, (a) = actual key, ":label" = title_or_tooltip (use an underscore "_" in place of a space " ")
                    '\u03b1(a):lower_case_alpha_(type_a) \u03b2(b):lower_case_beta_(type_b) \u03b3(c):lower_case_gamma_(type_c) \u03b4(d):lower_case_delta_(type_d) \u03b5(e):lower_case_epsilon_(type_e) \u03b6(f):lower_case_zeta_(type_f) \u03b7(g):lower_case_eta_(type_g)', // lower case Greek
                    '{shift} {accept} {cancel}'
                 ],
                 'shift' : [
                    '\u0391(A) \u0392(B) \u0393(C) \u0394(D) \u0395(E) \u0396(F) \u0397(G)', // upper case Greek
                    '{shift} {accept} {cancel}'
                 ]
              },
              usePreview: false,
              openOn: null,
              userClosed: false,
              stayOpen: true
            });
           
           var scopeHelper = {
              keyboardId: keyboardId
           }
           
           keyboardCollection[keyboardId] = angular.extend(vm, scopeHelper);
           return keyboardCollection[keyboardId];
         };
         
         return keyboard;
      };
   });
