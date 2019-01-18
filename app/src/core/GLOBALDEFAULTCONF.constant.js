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
	
	indexTitle: 'EVT Critical Viewer',
	webSite: '',
	logoUrl: '',

	defaultLanguage: "en",
	languages: ['en', 'it'],

		// Default:
	// <pre> configUrl: '../../config/config.json' </pre>
	configUrl: '../../config/config.json',
	dataUrl: '',
  analoguesUrl: '',
	sourcesUrl: '',
	sourcesTextsUrl: '',
	
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
	editionType: 'critical',
	defaultEdition: 'critical',
	showEditionLevelSelector: false,
	availableEditionLevel: [{
		value: 'critical',
		label: 'Critical',
		title: 'Critical edition',
		visible: true
	}, {
		value: 'diplomatic',
		label: 'Diplomatic',
		title: 'Diplomatic edition',
		visible: false
	}, {
		value: 'interpretative',
		label: 'Interpretative',
		title: 'Interpretative edition',
		visible: false
	}],
														
	mainDocId: '',
	showDocumentSelector: true,

	enableXMLdownload: true,
	downloadableFiles: [
		{
			"title": "Translated Critical Text",
			"formats": {
				"pdf": "../data/polo/download/Edizione_critica.pdf",
                "xml": "../data/polo/trad.xml",
                "txt": "../data/polo/download/Edizione_critica.txt"
			}
		},
		{
			"title": "Version F",
			"formats": {
				"pdf": "../data/polo/download/Redazione_F.pdf",
                "xml": "../data/polo/redazioni/F.xml",
                "txt": "../data/polo/download/Redazione_F.txt"
			}
		}
	],

	toolPinAppEntries: false,
	toolHeatMap: true,
	toolImageTextLinking: true,

	// NAMED ENTITIES
	namedEntitiesSelector: true,
	namedEntitiesToHandle: [],
	otherEntitiesToHandle: [],
	listsMainContentDef: '<back>',

	listDef: '<listWit>, <listChange>',
	versionDef: '<witness>, <change>',
	fragmentMilestone: '<witStart>, <witEnd>',
	lacunaMilestone: '<lacunaStart>, <lacunaEnd>',
	quoteDef: '',
	analogueDef: '',
	possibleVariantFilters: 'type, cause, hand',
	possibleLemmaFilters: 'resp, cert',
	notSignificantVariant: '<orig>, <sic>, [type=orthographic]',

  preferredWitness: '',
	skipWitnesses: '',
	witnessesGroups: [],
	versions : ["rec2", "rec1", "rec3"],

	alwaysPositiveApparatus: false,
	showReadingExponent: true,
	showInlineCriticalApparatus: true,
	showInlineSources: false,
	showInlineAnalogues: false,
	loadCriticalEntriesImmediately: true,
	maxWitsLoadTogether: 5,

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

	elementsWithNumbers: ['seg'],

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
	biblRefDef: '<ref[type=biblio]>',
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

	virtualKeyboardKeys: []
});
