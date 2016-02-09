angular.module('evtviewer.box')

.constant('BOXDEFAULTS', {
    /**
     * @module evtviewerBox
     * @ngdoc property
     * @name menuClosed
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * menuClosed: false
     * </pre>
     */
    menuClosed: false,

    /**
     * @module evtviewerBox
     * @ngdoc property
     * @name xsltUrl
     * @description
     * `property`
     *
     * Some info
     *
     * Default:
     * <pre>
     * xsltUrl: ''
     * </pre>
     */
    // xsltUrl: "../../data/prova.xsl"
    xsltUrl: ''
})

.config(function(evtBoxProvider, configProvider, BOXDEFAULTS) {
    var defaults = configProvider.makeDefaults('box', BOXDEFAULTS);
    evtBoxProvider.setDefaults(defaults);
});