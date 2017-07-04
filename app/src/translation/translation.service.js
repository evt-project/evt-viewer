angular.module('evtviewer.translation')

.constant('TRANSLATIONDEFAULTS', {

})

.service('evtTranslation', function(TRANSLATIONDEFAULTS) {
	var translation = {},
		defaults = TRANSLATIONDEFAULTS,
		languages = ['en', 'it'];

	translation.setLanguages = function(data) {
		languages = data;
	};

	translation.getLanguages = function(data) {
		return languages;
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