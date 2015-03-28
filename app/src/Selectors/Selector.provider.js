angular.module('evtviewer.selector')

.provider('select', function(){

    var options = this.defaults;

    this.$get = function($log, SelectFactory){
        var select = {};

        select.new = function(scope) {
            var zele = new SelectFactory()
            var self = angular.extend(scope, zele);

            console.log(self);
            
            self.toggle = function() {
                console.log('toggolo');
            };
        };

        // var select = new BaseComponent('select', options);
        return select;
    };

});