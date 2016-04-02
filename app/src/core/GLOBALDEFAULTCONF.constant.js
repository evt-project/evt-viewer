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

    debugConf: {
        log: true,
        info: true,
        warn: true,
        debug: true
    },

    modules: {
        interface: {
            active: true
        }
    },

    dataUrl: '../../data/pseudo-edition-test-file_mod.xml',
    defaultViewMode: 'critical',
    defaultEdition: 'critical',

    preferredWitness : 'edition',
    
    listDef                    : 'listWit, listChange',
    versionDef                 : 'witness, change',
    fragmentMilestone          : '<witStart>, <witEnd>',
    lacunaMilestone            : '<lacunaStart>, <lacunaEnd>',
    skipCriticalEntriesFilters : 'wit, target, corresp',
    possibleVariantFilters     : 'type, cause, hand, resp, cert',
    notSignificantVariant      : '<orig>, <sic>, [type=orthographic]',

    loadCriticalEntriesImmediately: true,
    maxWitsLoadTogether : 5
});