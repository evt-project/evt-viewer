/**
 * @ngdoc service
 * @module evtviewer.translation
 * @name evtviewer.translation.evtTranslation
 * @description 
 * # evtTranslation
 * TODO: Add description and comments for every method
**/
angular.module('evtviewer.translation')

.constant('TRANSLATIONDEFAULTS', {

})

.service('evtTranslation', function(TRANSLATIONDEFAULTS, $translate) {
	var translation = {},
		defaults = TRANSLATIONDEFAULTS,
		languages = ['en', 'it'],
        current;

    translation.setLanguage = function(langKey) {
        current = langKey;
        $translate.use(langKey);
    };

	translation.setLanguages = function(data) {
		languages = data;
	};

    translation.setFallbackLanguage = function(fallbackLangKey) {
        $translate.fallbackLanguage(fallbackLangKey);
    };

	translation.getLanguages = function(data) {
		return languages;
	};

    translation.getCurrentLanguage = function() {
        return current;
    };

    translation.getUserLanguage = function() {
        var userLang,
            navigatorLang = navigator.language;
        if (navigatorLang.indexOf('_') >= 0) {
            var langParts = navigatorLang.split('_');
            userLang = langParts[0];
        } else {
            userLang = navigatorLang;
        }
        return userLang;
    };

    translation.getFallbackLanguage = function() {
        return (languages && languages.length > 0 ? languages[0] : 'en');
    };

	return translation;
});