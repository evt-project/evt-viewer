angular.module('evtviewer.core')

.constant('GLOBALDEFAULTCONF', {

    // TODO: select doc system 
    /**
     * @module evtviewerCore
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
     * @module evtviewerCore
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
    /**
     * @module evtviewerCore
     * @ngdoc object
     * @name configUrl
     * @description
     * `boolean`
     * Url for external configuration file
     *
     * Default for DEV:
     * <pre> configUrl: '../../config/config.json' </pre>
     * Default for BUILD:
     * <pre> configUrl: 'config/config.json' </pre>
     */
    configUrl       : '../../config/config.json',
    

    dataUrl          : '../../data/pseudo-edition-test-file_mod.xml',
    preferredWitness : 'A',
    skipWitnesses    : '',

    indexTitle       : 'EVT Critical Viewer',
    webSite          : '',
    
    defaultViewMode    : 'critical',
    defaultEdition     : 'critical',
    availableViewModes : [
                            {
                                label    : 'Critical',
                                icon     : 'mode-critical',
                                viewMode : 'critical',
                                visible  : true
                            },
                            {
                                label    : 'Image Text',
                                icon     : 'mode-imgTxt',
                                viewMode : 'imgTxt',
                                visible  : true
                            },
                            {
                                label    : 'Text Text',
                                icon     : 'mode-txtTxt',
                                viewMode : 'txtTxt',
                                visible  : false
                            },
                            {
                                label    : 'Collation',
                                icon     : 'mode-collation',
                                viewMode : 'collation',
                                visible  : true
                            }],

    toolHeatMap : true,
    toolPinAppEntries : false,
    
    listDef                    : 'listWit, listChange',
    versionDef                 : 'witness, change',
    fragmentMilestone          : '<witStart>, <witEnd>',
    lacunaMilestone            : '<lacunaStart>, <lacunaEnd>',
    skipCriticalEntriesFilters : 'wit, target, corresp',
    possibleVariantFilters     : 'type, cause, hand',
    possibleLemmaFilters       : 'resp, cert',
    notSignificantVariant      : '<orig>, <sic>, [type=orthographic]',

    loadCriticalEntriesImmediately : true,
    maxWitsLoadTogether            : 5,

    filterColors  : { },
    genericColors : ['rgb(52, 197, 173)', 'rgb(238, 194, 66)', 'rgb(253, 153, 54)', 'rgb(253, 95, 58)',
                     'rgb(235, 77, 153)', 'rgb(252, 144, 172)', 'rgb(171, 99, 219)', 'rgb(67, 135, 217)',
                     'rgb(163, 207, 81)', 'rgb(238, 194, 66)', 'rgb(228, 99, 220)', 'rgb(124, 113, 232)'],
    
    variantColorLight : 'rgb(208, 220, 255)',
    variantColorDark  : 'rgb(101, 138, 255)',
    heatmapColor      : 'rgb(255, 108, 63)',
    xsltUrl: ''
});