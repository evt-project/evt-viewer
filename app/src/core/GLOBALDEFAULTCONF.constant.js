angular.module('evtviewer.core')

.constant('GLOBALDEFAULTCONF', {

	// TODO: select doc system
	/**
	 * @module evtviewer.core
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
	 * @module evtviewer.core
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
	// Default:
	// <pre> configUrl: '../../config/config.json' </pre>
	configUrl: '../../config/config.json',
   dataUrl          : '',

	logoUrl: '',

	enableXMLdownload: true,
    // sourcesUrl //
    // Url of the XML file encoding the list of all the bibliographic references for the sources apparatus.//
    sourcesUrl       : '',
    // sourcesTextsUrl //
    // Path of the folder containing the xml files of the sources texts //
    sourcesTextsUrl : '',
    //analoguesUrl//
    //Url of the XML file encoding the list of all the bibliographic references for the analogues apparatus.//
    analoguesUrl     : '',

    preferredWitness: 'A',
	skipWitnesses: '',

	indexTitle: 'EVT Critical Viewer',
	webSite: '',

	editionType: 'critical',

	defaultEdition: 'critical',

	showEditionLevelSelector: true,
	availableEditionLevel: [{
		value: 'critical',
		label: 'Critical',
		title: 'Critical edition',
		visible: false
	}, {
		value: 'diplomatic',
		label: 'Diplomatic',
		title: 'Diplomatic edition',
		visible: true
	}, {
		value: 'interpretative',
		label: 'Interpretative',
		title: 'Interpretative edition',
		visible: true
	}],

	showDocumentSelector: true,

	defaultViewMode: 'readingTxt',
	availableViewModes: [{
                                label    : 'READING_TEXT',
                                icon     : 'reading-txt',
                                viewMode : 'readingTxt',
                                visible  : true
                            },
                            {
                                label    : 'MULTIPLE_RECENSIONS',
                                icon     : 'mode-versions',
                                viewMode : 'versions',
                                visible  : true
                            },
                            {
                                label    : 'IMAGE_TEXT',
                                icon     : 'mode-imgTxt',
                                viewMode : 'imgTxt',
                                visible  : true
                            },
                            {
                                label    : 'TEXT_TEXT',
                                icon     : 'mode-txtTxt',
                                viewMode : 'txtTxt',
                                visible  : false
                            },
                            {
                                label    : 'COLLATION',
                                icon     : 'mode-collation',
                                viewMode : 'collation',
                                visible  : true
                            },
                            {
                                label    : 'SOURCE_TEXT',
                                icon     : 'mode-srcTxt',
                                viewMode : 'srcTxt',
                                visible  : true
                            }],

	toolHeatMap: true,
	toolPinAppEntries: false,
	toolImageTextLinking: true,

	listDef: '<listWit>, <listChange>',
	versionDef: '<witness>, <change>',
	fragmentMilestone: '<witStart>, <witEnd>',
	lacunaMilestone: '<lacunaStart>, <lacunaEnd>',
	possibleVariantFilters: 'type, cause, hand',
	possibleLemmaFilters: 'resp, cert',
	notSignificantVariant: '<orig>, <sic>, [type=orthographic]',

	loadCriticalEntriesImmediately: true,
	maxWitsLoadTogether: 5,

    /*Versions*/
    /*Array to encode cases of double or multiple redactions of the text*/
    /*The array collects the id used inside of the XML file as values of*/
    /*the @ana attribute on the rdgGrp element.                         */
    /*The first id will correspond to the default version.              */
    versions : [],

    /*witnessesGroups*/
    /*Used to divide the readings of all critical apparatus entries into groups.*/
    /*The witnesses property is required in order to have the partition.        */
    /*The groupName is optional: if set the name will be displayed.             */
    witnessesGroups: [
        {
            groupName : 'Grp_1',
            witnesses : ['V', 'P', 'N', 'M', 'G', 'C', 'R']
        },
        {
            groupName : 'Grp_2',
            witnesses : ['F', 'D', 'O', 'W', 'M5mg', 'B', 'U']
        }
    ],

    /*Definition of the element used within the XML file to encode quotes for the sources apparatus.*/
    quoteDef    : '<quote>',
    /*Definition of the element used within the XML file to encode passages for the analogues apparatus.*/
    analogueDef : '<seg>,<ref[type=parallelPassage]>',

    showReadingExponent: true,
    showInlineCriticalApparatus: true,
    showInlineSources: false,
    showInlineAnalogues: false,



	variantColors: {},
	filterColors: {},
	genericColors: ['rgb(52, 197, 173)', 'rgb(238, 194, 66)', 'rgb(253, 153, 54)', 'rgb(253, 95, 58)',
		'rgb(235, 77, 153)', 'rgb(252, 144, 172)', 'rgb(171, 99, 219)', 'rgb(67, 135, 217)',
		'rgb(163, 207, 81)', 'rgb(238, 194, 66)', 'rgb(228, 99, 220)', 'rgb(124, 113, 232)'
	],

	variantColorLight: 'rgb(208, 220, 255)',
	variantColorDark: 'rgb(101, 138, 255)',
	heatmapColor: 'rgb(255, 108, 63)',
	xsltUrl: '',

	// BIBLIOGRAPHY
	defaultBibliographicStyle: 'Chicago',
	allowedBibliographicStyles: {
		Chicago: {
			label: 'Chicago',
			enabled: true
		},
		APA: {
			label: 'APA',
			enabled: false
		},
		MLA: {
			label: 'MLA',
			enabled: true
		}
	},
	bibliographicEntriesSortBy: {
		Author: 'BIBLIOGRAPHY.AUTHOR',
		Year: 'BIBLIOGRAPHY.YEAR',
		Title: 'BIBLIOGRAPHY.TITLE',
		Publisher: 'BIBLIOGRAPHY.PUBLISHER'
	},
	bibliographySortOrder: {
		ASC: 'BIBLIOGRAPHY.ASC',
		DESC: 'BIBLIOGRAPHY.DESC'
	},

    // NAMED ENTITIES
    namedEntitiesSelector: true,
    namedEntitiesToHandle: [],
    otherEntitiesToHandle: [],

    languages: ['en', 'it']
});
