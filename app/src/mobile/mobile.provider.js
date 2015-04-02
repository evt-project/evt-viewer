// evtMobile = angular.module('evtviewer.mobile')

// evtMobile.provider('helloWorld', function() {

//     this.name = 'Default';

//     this.$get = function() {
//         var name = this.name;
//         return {
//             sayHello: function() {
//                 return "Hello, " + name + "!"
//             }
//         }
//     };

//     this.setName = function(name) {
//         this.name = name;
//     };
// });

          
// evtMobile.config(function(helloWorldProvider){
//     helloWorldProvider.setName('World');
// });
        


angular.module('evtviewer.mobile')

.provider ('Mobile', function(){

    var viewMode = this.viewMode;

    this.$get = function($log){

        var mobile = {};
        var _console = $log.getInstance('mobile');

        var state = {
            currentView: 'image'
        };

        mobile.getState = function() {
            return state;
        };

        mobile.getCurrentView = function() {
            return state.currentView;
        };

        mobile.switchView = function(view) {
            state.currentView = view;
            _console.log('Switch of current view in: ' + view);
        };

        return mobile;
    };

    this.setView = function(_viewMode) {
        this.viewMode = _viewMode;
    };

});


.config (function(MobileProvider){
    MobileProvider.setView(viewMode);
});

