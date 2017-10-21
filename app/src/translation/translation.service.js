/**
 * @ngdoc service
 * @module evtviewer.translation
 * @name evtviewer.translation.evtTranslation
 * @description
 * # evtTranslation
 * This service defines and exposes methods to handle UI translation.
 *
 * @requires $translate
**/
angular.module('evtviewer.translation')

.constant('TRANSLATIONDEFAULTS', {

})

.service('evtTranslation', function(TRANSLATIONDEFAULTS, $translate) {
	var translation = {},
		defaults = TRANSLATIONDEFAULTS,
		languages = ['en', 'it'],
        current;
    /**
     * @ngdoc method
     * @name evtviewer.translation.evtTranslation#setLanguage
     * @methodOf evtviewer.translation.evtTranslation
     *
     * @description
     * Set current UI language
     * @param {string} langKey key code of language to set ("en", "it", etc.)
     */
    translation.setLanguage = function(langKey) {
        current = langKey;
        $translate.use(langKey);
    };
	/**
     * @ngdoc method
     * @name evtviewer.translation.evtTranslation#setLanguages
     * @methodOf evtviewer.translation.evtTranslation
     *
     * @description
     * Set available languages
     * @param {array} data array of languages key code to be set as available ones
     */
    translation.setLanguages = function(data) {
		languages = data;
	};
    /**
     * @ngdoc method
     * @name evtviewer.translation.evtTranslation#setFallbackLanguage
     * @methodOf evtviewer.translation.evtTranslation
     *
     * @description
     * Set fallback language (the one to select when selecting a language that is not available)
     * @param {string} fallbackLangKey key code of language to select as fallback language
     */
    translation.setFallbackLanguage = function(fallbackLangKey) {
        $translate.fallbackLanguage(fallbackLangKey);
    };
	/**
     * @ngdoc method
     * @name evtviewer.translation.evtTranslation#getLanguages
     * @methodOf evtviewer.translation.evtTranslation
     *
     * @description
     * Retrieve available languages
     * @returns {array} array of available languages
     */
    translation.getLanguages = function() {
		return languages;
	};
    /**
     * @ngdoc method
     * @name evtviewer.translation.evtTranslation#getCurrentLanguage
     * @methodOf evtviewer.translation.evtTranslation
     *
     * @description
     * Retrieve current selected language
     * @returns {string} key code of current selected language
     */
    translation.getCurrentLanguage = function() {
        return current;
    };
    /**
     * @ngdoc method
     * @name evtviewer.translation.evtTranslation#getUserLanguage
     * @methodOf evtviewer.translation.evtTranslation
     *
     * @description
     * Guess user language from the settings of his/her browser
     * @returns {string} key code of user language
     */
    translation.getUserLanguage = function() {
        var userLang,
			langParts,
            navigatorLang = navigator.language;
        if (navigatorLang.indexOf('_') >= 0) {
            langParts = navigatorLang.split('_');
            userLang = langParts[0];
        } if (navigatorLang.indexOf('-') >= 0) {
            langParts = navigatorLang.split('-'); 
            userLang = langParts[0];
        } else {
            userLang = navigatorLang;
        }
        return userLang;
    };
    /**
     * @ngdoc method
     * @name evtviewer.translation.evtTranslation#getFallbackLanguage
     * @methodOf evtviewer.translation.evtTranslation
     *
     * @description
     * Retrieve fallback language (that is the language to select when selecting a language that is not available)
     * @returns {string} key code of fallback language
     */
    translation.getFallbackLanguage = function() {
        return (languages && languages.length > 0 ? languages[0] : 'en');
    };

	return translation;
});
