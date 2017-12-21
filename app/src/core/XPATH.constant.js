angular.module('evtviewer.core')

.constant('XPATH', {
   getLineNode: '//body//(l|pb|head|head[@type=\'sub\'])[not(ancestor::note)]',
   getDiplomaticChildNodes: './/(g | text())[not((ancestor::corr|ancestor::reg|ancestor::expan|ancestor::ex|ancestor::note))]',
   getInterpretativeChildNodes: './/(g | text())[not((ancestor::sic|ancestor::orig|ancestor::abbr|ancestor::am|ancestor::note))]',

   ns : {
      getLineNode: '//ns:body//(ns:l|ns:pb|ns:head|ns:head[@type=\'sub\'])[not(ancestor::ns:note)]',
      getDiplomaticChildNodes: './/(ns:g | text())[not((ancestor::ns:corr|ancestor::ns:reg|ancestor::ns:expan|ancestor::ns:ex|ancestor::ns:note))]',
      getInterpretativeChildNodes: './/(ns:g | text())[not((ancestor::ns:sic|ancestor::ns:orig|ancestor::ns:abbr|ancestor::ns:am|ancestor::ns:note))]',
   }
});
