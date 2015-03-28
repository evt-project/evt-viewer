angular.module('evtviewer.core')

.constant('GLOBALDEFAULTCONF', {

    // TODO: select doc system 
    /**
     * @module evtviewerConfig
     * @ngdoc object
     * @name test
     * @description
     * `object`
     *
     * Some info
     *
     * Default:
     * <pre>
     * test: {
     *   active: false
     * }
     * </pre>
     */
    test: {
        active: false
    },

    /**
     * @module evtviewerConfig
     * @ngdoc object
     * @name debugAllModules
     * @description
     * `boolean`
     * Active debug log for all modules.
     *
     * Default:
     * <pre> debugAllModules: false </pre>
     */
    debugAllModules: true,

    modules: {
        Interface: {
            active: true
        }
    },

    dataUrl: 'https://dl.dropboxusercontent.com/u/5505916/evt/data/DOTR_rev2013.xml'

});