/*jshint -W059 */

angular.module('evtviewer.core')
.service('Utils', function($window) {
    var Utils = {};
    
    Utils.deepExtend = function(destination, source) {
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

    Utils.getCurrentUserLanguage = function(){
        // use the $window service to get the languages of the user's browser (works in Chrome >= 32 and Firefox >= 32)
        var languages = $window.navigator.languages;
        if(typeof(languages) !== 'undefined'){
            var firstLanguage = languages[0];
            return firstLanguage;
        }
    };

    return Utils;
});