angular.module('evtviewer.dialog')

.provider('evtDialog', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    this.$get = function($log) {
        var dialog     = {},
            collection = {},
            list       = [],
            idx        = 0;

        var _console = $log.getInstance('dialog');

        // 
        // Control function
        // 
        function open() {
            var vm    = this;
            vm.opened = true;
        }

        function close() {
            var vm = this;
            vm.opened = false;
        }

        function setTitle(newTitle){
            var vm = this;
            vm.title = newTitle;
        }

        function updateContent(newContent){
            var vm = this;
            vm.content = newContent;
        }

        function destroy() {
            var tempId = this.uid;
            // this.$destroy();
            delete collection[tempId];
            // _console.log('vm - destroy ' + tempId);
        }

        // 
        // Dialog builder
        // 
        dialog.build = function(scope) {
            var currentId   = scope.id    || idx++,
                currentType = scope.type  || 'default',
                title       = scope.title || '',
                opened      = false,
                content;

            var scopeHelper = {};

            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }

            scopeHelper = {
                // expansion
                uid           : currentId,
                defaults      : angular.copy(defaults),

                // model
                type          : currentType,
                content       : content,
                title         : title,
                opened        : opened,

                // function
                open          : open,
                close         : close,
                setTitle      : setTitle,
                updateContent : updateContent,
                destroy       : destroy
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id   : currentId,
                type : currentType
            });

            return collection[currentId];
        };


        //
        // Service function
        // 
        dialog.getById = function(currentId) {
            if (collection[currentId] !== 'undefined') {
                return collection[currentId];
            }
        };

        dialog.getList = function() {
            return list;
        };

        dialog.getListByType = function(type) {
            var listType = [];
            for (var i in collection) {
                if (collection[i].type === type) {
                    listType.push(collection[i]);
                }
            }
            return listType;
        };

        dialog.openByType = function(type) {
            for (var i in collection) {
                if (collection[i].type === type) {
                    collection[i].open();
                }
            }
        };

        dialog.closeAll = function(){
            for (var i in collection) {
                if (collection[i].close() !== undefined){
                    collection[i].close();
                }
            }
        };
        return dialog;
    };

});