/*jshint -W059 */

angular.module('evtviewer.core')

.provider('Utils', function() {

    this.deepExtend = function(destination, source) {
        for (var property in source) {
            if (source[property] && source[property].constructor && source[property].constructor === Object) {
                destination[property] = destination[property] || {};
                arguments.callee(destination[property], source[property]);
            } else {
                destination[property] = angular.copy(source[property]);
            }
        }
        return destination;
    };

    this.$get = function() {
        return {
            deepExtend: this.deepExtend
        };
    };

});