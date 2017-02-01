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

    this.deepExtendSkipDefault = function(destination, source) {
        for (var property in source) {
            if (source[property] && source[property].constructor && source[property].constructor === Object) {
                destination[property] = destination[property] || {};
                arguments.callee(destination[property], source[property]);
            } else {
                if (property === 'dataUrl') {
                    if ( source[property] !== '' ) {
                        destination[property] = angular.copy(source[property]); 
                    }
                } else {
                    if ( source[property] === 'NONE' || source[property] === 'NULL') {
                        destination[property] = '';
                    } else if ( source[property] !== '' ) {
                        destination[property] = angular.copy(source[property]);
                    }
                }
            }
        }
        return destination;
    };

    // DOM utils (TODO: Decide if move to another service)
    this.getElementsBetweenTree = function(start, end) {
        var ancestor = this.getCommonAncestor(start, end);

        var before = [];
        while (start.parentNode!== ancestor) {
            var el = start;
            while (el.nextSibling)
                before.push(el = el.nextSibling);
            start = start.parentNode;
        }

        var after = [];
        while (end.parentNode!== ancestor) {
            var el = end;
            while (el.previousSibling)
                after.push(el = el.previousSibling);
            end = end.parentNode;
        }
        after.reverse();

        while ((start = start.nextSibling)!== end)
            before.push(start);
        return before.concat(after);
    };

    // Get the innermost element that is an ancestor of two nodes.
    
    this.getCommonAncestor = function(a, b) {
        var parents = $(a).parents().andSelf();
        while (b) {
            var ix = parents.index(b);
            if (ix !== -1)
                return b;
            b = b.parentNode;
        }
        return null;
    };

    this.$get = function() {
        return {
            deepExtend: this.deepExtend,
            getElementsBetweenTree: this.getElementsBetweenTree,
            getCommonAncestor: this.getCommonAncestor
        };
    };

});