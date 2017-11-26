EVT 2.0 (evt-viewer)
===============


1 - Introduction
--------------------

### 1.1 - About EVT

[EVT (Edition Visualization Technology)](http://evt.labcd.unipi.it/) is a light-weight, open source tool specifically designed to create digital editions from texts encoded according to the [TEI XML schemas and Guidelines](http://www.tei-c.org/Guidelines/P5/), freeing the scholars from the burden of web programming and enabling the final users to browse, explore and study digital editions by means of a user-friendly interface.

This tool was born in the context of the [Digital Vercelli Book](http://vbd.humnet.unipi.it/) project, in order to allow the creation of a digital edition (which has been available in beta form for more than two years) of the Vercelli Book, a parchment codex of the late tenth century, now preserved in the Archivio e Biblioteca Capitolare of Vercelli and regarded as one of the four most important manuscripts of the Anglo-Saxon period as it regards the transmission of poetic texts in the Old English language.
However it has evolved into a tool suitable to fit different texts and needs. For example, it is now being used to publish the digital edition of the [Codice Pelavicino manuscript](http://pelavicino.labcd.unipi.it), a medieval codex preserving charters dating back to the XIII century. The continuous development and need to adapt it to different types of documents and TEI-encoded texts has shifted the development focus towards the creation of a more general tool for the web publication of TEI-based digital editions, able to cater for multiple use cases.

The entire structure of the software has been remodeled, in order to make it lighter, more usable and more adaptable; we decided to use the Model View Controller (MVC) approach, that is a very common architectural pattern in object-oriented programming, that allows to separate the logical presentation of the data, from the application logic and the processing core.
Wanting to maintain the original feature of EVT, and therefore do not give up the client only approach, we decided to use [AngularJS](https://angularjs.org/), a JavaScript framework inspired by the MVC programming logic, especially suitable for the development of client-side Web applications; among other things, this framework allows to define custom HTML components and use the data-binding mechanism to associate the model of the data to the UI elements, and manage the updates of the latter avoiding the direct DOM manipulation.


### 1.2 - How it works
Before the refactoring, EVT was composed of two main units: EVT Builder, for the transformation of the encoded text using special XSLT 2.0 templates, and EVT Viewer, for the visualization into a browser of the results of the transformations and the interaction with them. The idea under the new version of EVT is instead to leave to EVT Viewer the task of reading and parsing with JavaScript functions the encoded text, and “save” as much as possible within a data model, that persists in the client main memory, and is organized in a way that allows a very quick access to the data in case of need. This has obviously led to the elimination of the EVT Builder level, and therefore it allows to open a digital edition directly in the browser without any previous XSLT transformation.

### 1.3 - Main features
At the present moment EVT can be used to create critical editions with multiple levels of apparatuses, encoded using [the TEI Parallel Segmentation Method] (http://www.tei-c.org/release/doc/tei-p5-doc/en/html/TC.html#TCAPPS). This means that a transcription encoded according to the Guidelines should already be compatible with EVT 2, or require only minor changes to be made compatible.

Among the main features you will find:
* Critical edition support. Enlarged critical apparatus, sources apparatus and analogues apparatus, variant heat map, witnesses collation and variant filtering are some of the main features developed for the critical edition support.
* Bookmark. Direct reference to the current view of the web application, considering view mode, current document, page and edition level, eventual collated witnesses and selected apparatus entry.
* Named entities and lists of entities.
* Interactive bibliography. User can visualize the bibliography of the edition and reorder the entries by author, publisher or publishing date.
* High level of customization. The editor can customize both the user interface layout and the appearance of the graphical components.



2 - A short guide to EVT
--------------------------------

EVT 2 can be used to prepare an edition right away, immediately after installing it on your hard drive: see the *Installation and use* section first, then *Configuration*, to understand how EVT works and how you can use it to publish your editions. A more detailed guide will be published separately, as a reference manual, and will also include instructions about customization.

If, on the other hand, you are interested in **developing** a specific functionality in EVT 2, or in modifying an existing one, we suggest that you download and install the [*Development framework*](https://github.com/evt-project/evt-viewer). The `README.md` contained in it explains how to install and configure the development framework needed for this purpose. This step is only needed if you want to start working with EVT’s source code, so it is in no way necessary for basic users.

### 2.1 - Installation and use

Installation is quite simple, download the compressed archive from EVT’s home page, unzip it in a suitable location on your hard drive, and you are ready to use it:

* your encoded edition document must be copied in the `data/text` directory: EVT comes with a default directory structure, distinguishing between images, text and other types of data, but you can modify it as desired, provided that the appropriate paths are specified in the configuration file (`config.json`, see below);

* to have it parsed and loaded by EVT you have to point to it explicitly modifying the `config.json` file in the `config` directory: `"dataUrl": "data/My edition.xml",`;
note that there are several other configuration options available in that file, so that you can customize the layout and appearance of your edition;
also note that some configuration options may be necessary to make desired features available, for instance to add the required edition level, so make sure you read the following section and check the default configuration file.

* optionally, you can add your own CSS instructions to modify the appearance of specific TEI elements by editing the `config-style.css` file in the `config` directory. The customization of generic and linear TEI element is very simple, even if EVT does not yet consider them in the default visualization: in fact, the TEI elements which are not handled in any particular way by EVT are always transformed in HTML elements with the TEI tag name as class name. In this way, the customization is very easy: just add a rule that match the tag name of the TEI element to style. F.i., a deletion encoded with `del` element, can be displayed with a line through the text just by adding the rule `.del { text-decoration: line-through; }`.


### 2.2 - Configuration

There are several configuration options, ranging from the folders where edition data is stored to User Interface layout and available tools, that can be set by editing the `config.json` file in the `config` directory. Below you will find a detailed list of the available options: in the file you will see a list of options on the left, to configure EVT you will have to insert the appropriate values in the textual fields on the right. Sometimes those values will consist of boolean strings (“true” or “false”), sometimes they will be simple character strings (e.g. "Interpretative edition"), in other cases you will have to enter TEI XML elements (e.g. "<listWit>, <listChange>"); for colors it will be necessary to specify the correct RGB values (e.g. "rgb(108, 145, 207)").

If you find this file difficult to read and/or change you can try out the beta EVT2-Config-Generator](http://evt.labcd.unipi.it/evt2-config/): upload the current config.json, change the parameters you need to change and download the new config.json. Note that this is the first version of the EVT2 Config tool, so there may be glitches and/or problems, please report them to us.

#### Main Data

##### Edition Main information
* `indexTitle`. Choose a title for your edition. If you leave it blank the default 'EVT Viewer' title will be shown.
* `webSite`. If you specify an external web site there will be a link pointing to it.
* `logoUrl`. You can also add a custom logo that will appear before the edition title: just indicate the path to it; it can be a URL or a relative path: we suggest that you put it into `data` and point to it (f.i. `data/icons/myLogo.jpg`).

##### Source file(s)
* `dataUrl`. Indicate the file name of the XML file of your encoded edition. It can point either to an internal folder or to an external online resource.
* `sourcesUrl`. Indicate the file name of the XML file encoding the list of all the bibliographic references for the sources apparatus. It can point either to an internal folder or to an external online resource.
* `analoguesUrl`. Indicate the file name of the XML file encoding the list of all the bibliographic references for the analogues apparatus. It can point either to an internal folder or to an external online resource.
* `sourcesTextsUrl`. Indicate the folder where you intend to put the XML containing the texts of external sources (if you have any).
* `enableXMLdownload`. Decide if you want to enable the XML download (`true`) or not (`false`).

##### Edition levels
* `availableEditionLevel`. Select which edition levels you want to be available in your edition. You can deactivate a view mode both by deleting it and by setting to `false` the property `visible` (the latter being the suggested method). If you select just one edition level you can choose either to display the selector (with just one item) or not by setting `showEditionLevelSelector` respectively to `true` or `false`.
* `defaultEdition`. Select which edition level you want to your edition to open on. Note that it must be an active edition level!
* `showEditionLevelSelector`. Decide if you want to display the edition level selector (`true`) or not `false`. This parameter is considered only if you select just one edition level: if there are two or more edition levels available, the edition selector will be always visible.

#### Generic Tools

##### View Modes
* `availableViewModes`. Select which view modes you want to be available in your edition. You can deactivate a view mode either by deleting it or by setting the property `visible` to `false` (suggested method).
* `defaultViewMode`. Select which view mode you want to your edition to open on. Note that it must be an active mode!

##### Bibliography
* `allowedBibliographicStyles`. Select which bibliographic style you want to enable. Bibliographic styles will work properly if the system will find all needed information encoded in you XML file. You can deactivate a bibliographic style either by deleting it or by setting the property `enabled` to `false` (suggested method).
* `defaultBibliographicStyle`. Select which bibliographic style you want to your edition to open on. Note that it must be an active bibliographic style!


##### Tools
* `toolPinAppEntries`. Select if you want to activate (`true`) or not (`false`) the PIN tool, which allows the user to “save” apparatus entries or (named) entities in order to reach them more quickly when you need them.
*  `toolImageTextLinking`. Select if you want to activate (`true`) or not (`false`) the Image-Text Linking tool, which allow the user to connect line by line the facsimile to the transcription. You will need to properly encode the `zone` and their coordinates and have Image-Text among the available view modes. Note that this is still a work-in-progress feature since we are still implementing the EVT 2 image viewer.
* `namedEntitiesSelector`. Select if you want to activate (`true`) or not (`false`) the (named) entities selector, which allow the user to highlight on the text one or more specific (named) entitie(s).
* `namedEntitiesToHandle`. Customize the list of available named entities to be highlighted and to be shown among entities lists, by adding a new element in this list: for each element you should define a `tagName`, which is the XML tag that identify the entity and a `label` that will be shown in the selector. If you don’t need an entity that is already inserted in this list you can delete it or just use the property `available` set to `false` (suggested choice). Note that EVT can work properly only with `persName`, `placeName` and `orgName`; any other type of entity might cause problems (hopefully not!). If you need a new kind of named entity to be handled just notify the [EVT Development Team](evt.developers@gmail.com).
* `otherEntitiesToHandle`. Customize the list of available entities to be highlighted by adding a new element in this list: for each element you should define a `tagName`, which is the XML tag that identify the entity, a `label` that will be shown in the selector and a `color` that will be used to highlight the entity within the text. If you don’t need an entity that is already inserted in this list you can delete it or just use the property `available` set to `false` (suggested choice).

##### Languages
* `languages`. Customize the languages you want to set as available for the translation of the User Interface (just the UI!) by adding their codes in this list. At the moment we support just english (`'en'`) and italian (`'it'`). If you want to add the support for a new language, just add a new `*new_language_code*.json` inside the `i18n` directory and a `*new_language_code*.png` image inside the `images` folder.

#### Critical Edition

##### Witnesses
* `preferredWitness`. Indicate the sigla of your preferred witness; this will be used everywhere if you forgot to encode the lemma for a particular variation of the text.
* `skipWitnesses`. Indicate the siglas (divided by commas) of witnesses you want to exclude from visualization.

##### Witnesses Group(s)
* `witnessesGroups`. If you want, you can divide the readings of all critical apparatus entries into groups. Each group should have a `witnesses` property (mandatory) that indicates the siglas of witnesses within the group and a `groupName` (optional) that indicates the name of group to be displayed (f.i. `{ “groupName”: “Group 1”, “witnesses”: “A, B, B1” }`).

##### Apparatuses
EVT 2 is able to handle multiple levels of apparatuses: critical entries apparatus, sources apparatus and analogues apparatus. In "Reading view", all of them can be available both in inline mode (the apparatus will appear within the text, right after the portion of text to which it is connected) or in a separate box (there will be a container next to the main text where all the entries will be shown and aligned to the text, whenever the user clicks on an entry). By default, all the apparatuses will appear separately from the main text, but you can choose which mode you prefer by setting to `true` (inline) or `false` (separate box) the following parameters:
* `showInlineCriticalApparatus`, for critical apparatus entries;
* `showInlineSources`, for apparatus of sources;
* `showInlineAnalogues`, for apparatus of analogues.

##### Tools
* `showReadingExponent`. Indicate if you want to use alphabetic exponent for critical entries (`true`) or not (`false`).
* `toolHeatMap`. Indicate if you want to include the Heat Map tool within the Critical Edition box (`true`) or not (`false`). This tool gives the user an overview about text variance.

##### Advanced Settings
Tell the system how to recognize the data: indicate which XML tag you used for the encoding of the different objects.

**XML Tag usage configuration**
* `listDef`. List of Witnesses: element(s) you used to encode the lists of all the witnesses or changes referred to by the critical apparatus (f.i. `<listWit>` or `<listChange>`). Please divide values using commas.
* `versionDef`. Single witness: element(s) you used to encode a single witness or change referred to within the critical apparatus (f.i. `<witness>` or `<change>`). Please divide values using commas.
* `fragmentMilestone`. Fragment milestones: element(s) you used to indicate the beginning (or resumption) and the end (or suspension) of the text of a fragmentary witness (f.i. `<witStart>` or `<witEnd>`). Please divide values using commas.
* `lacunaMilestone`. Lacuna milestones: element(s) you used to indicate the beginning and the end of a lacuna in the text of a mostly complete textual witness (f.i. `<lacunaStart>` or `<lacunaEnd>`). Please divide values using commas.
* `notSignificantVariant`. Not significant variants: element(s) of attribute(s) you used to encode variants that are not significant and you do not want to appear in the main critical apparatus (f.i. `<orig>`, `<sic>` or `@type=orthographic`). Please divide values using commas.
* `quoteDef`. Quotes: element(s) used within the XML file to encode quotes for the sources apparatus (f.i. `<quote>`). Please divide values using commas.
* `analogueDef`. Analogues: element(s) used within the XML file to encode passages for the analogues apparatus. (f.i. `<seg>` or `<ref[type=parallelPassage]>`). Please divide values using commas.

**Filters**
* `possibleLemmaFilters`. Possible lemma filters: attribute(s), divided by commas, you want to consider as possible filters for lemmas (f.i. `resp` or `cert`). If you want, you can customize the color of each filter value in the tab "Colors" (otherwise random colors will be used).
* `possibleVariantFilters`. Possible variant filters: attribute(s), divided by commas, you want to consider as possible filters for variants (f.i. `type`, `cause` or `hand`). If you want, you can customize the color of each filter value in the tab "Colors" (otherwise random colors will be used).


**Colors**
* `variantColorLight` and `variantColorDark`. Generic variant Colors: customize the highlight colors (both dark and light for selected and unselected entries) for generic variants that do not have any specific metadata (or have metadata that are not considered as filters). Default colors are `rgb(208, 220, 255)` (light) and `rgb(101, 138, 255)` (dark).
* `heatmapColor`. Heat Map Color: customize the highlight color for variants when the heat map tool is activated (this will be the darkest color possible, that means the color of entries with the highest variance level). Default color is `rgb(255, 108, 63)`.
* `variantColors`. Specific Variant Colors: customize the highlight color for each value of each lemma filter you defined in `possibleLemmaFilters` and each reading filter you defined in `possibleVariantFilters`. If you do not define a specific color, the system will use a random one.


3 - Examples
-----------------

There are 3 ready-to-use examples. The one used by default is n. 1.

If you want to explore the other two you will just have to open the corresponding config.json file (f.i. config_ex2.json), copy its content and paste it into the main config.json file overwriting the existing configuration. Then go to the index.html opened in your browser and reload the page!

* EXAMPLE 1: avicenna.xml -
Short extract of Edizione Logica Avicennae, changed by CM for EVT testing purposes. It presents multiple levels of apparatuses (critical entries, sources and analogues), displayed in a separate dedicated frame.
Configurations for this edition: config_avicenna.json

* EXAMPLE 2: pseudoEdition.xml -
Pseudo edition for demonstration and testing purposes only, originally encoded by Marjorie Burghart for her TEI Critical Toolbox software, and modified in order to cover the highest number of possible use cases. It presents just the critical apparatus entry, displayed inline, within the main text.
Configurations for this edition: config_pseudoEdition.json

* EXAMPLE 3: pelavicino.xml -
Short extract of the Codice Pelavicino edition, which presents the encoding of named entities, in particular person, place and organization names.
Configurations for this edition: config_pelavicino.json
NB: Note that at this time EVT 2 can support diplomatic editions only in a limited way, feature parity with the previous version will come next year.

* EXAMPLE 4 : marlowe.xml -
Short extract of *The Tragedie of Doctor Faustus* (B text) by Christopher Marlowe. Text provided by Perseus Digital Library, with funding from Tufts University. Original version available for viewing and download at [http://www.perseus.tufts.edu/hopper/](http://www.perseus.tufts.edu/hopper/).
Configurations for this edition: config_marlowe.json


4 - EVT Manual
---------------------

Work in progress... stay in touch!


5 - Feedback
-----------------
User feedback is very much appreciated: please send all comments, suggestions, bug reports, etc. to evt.developers@gmail.com.
