angular.module('evtviewer.core')

.constant('XPATH', {
   getLineNode: '//body//(l|ns:p//ns:lb|pb|head|head[@type=\'sub\'])[not(ancestor::note)]',
   getPrevLb:'preceding::lb',

   getProseDiplomaticNodes: '//body//p//(g|text())[not((ancestor::corr|ancestor::reg|ancestor::expan|ancestor::ex|ancestor::note))]',
   getDiplomaticChildNodes: './/(g | text())[not((ancestor::corr|ancestor::reg|ancestor::expan|ancestor::ex|ancestor::note))]',
   getDiplomaticNodesBetween:'(.//(following::text()|following::g) intersect .//following::lb[1]//(preceding::text()|preceding::g))[not((ancestor::corr|ancestor::reg|ancestor::expan|ancestor::ex|ancestor::note))]',
   getDiplomaticNodesFollowing: './/(following::text()|following::g)[not((ancestor::corr|ancestor::reg|ancestor::expan|ancestor::ex|ancestor::note))]',
   
   getInterpretativeChildNodes: './/(g | text())[not((ancestor::sic|ancestor::orig|ancestor::abbr|ancestor::am|ancestor::note))]',
   getCriticalChildNodes: './/(lem | rdg)[@wit]',
   getCurrentTitle: 'string(.//ancestor::text/@n)',
   getCurrentTextNode: './/ancestor::text[max(1)]',

   ns : {
      getLineNode: '//ns:body//(ns:l|ns:p//ns:lb|ns:pb|ns:head|ns:head[@type=\'sub\'])[not(ancestor::ns:note)]',
      getPrevLb:'preceding::ns:lb',
      
      getProseDiplomaticNodes: '//ns:body//ns:p//(ns:g|text())[not((ancestor::ns:corr|ancestor::ns:reg|ancestor::ns:expan|ancestor::ns:ex|ancestor::ns:note))]',
      getDiplomaticChildNodes: './/(ns:g | text())[not((ancestor::ns:corr|ancestor::ns:reg|ancestor::ns:expan|ancestor::ns:ex|ancestor::ns:note))]',
      getDiplomaticNodesBetween:'(.//(following::text()[normalize-space()]|following::ns:g) intersect .//following::ns:lb[1]//(preceding::text()[normalize-space()]|preceding::ns:g))[not((ancestor::ns:corr|ancestor::ns:reg|ancestor::ns:expan|ancestor::ns:ex|ancestor::ns:note))]',
      getDiplomaticNodesFollowing: './/(following::text()|following::ns:g)[not((ancestor::ns:corr|ancestor::ns:reg|ancestor::ns:expan|ancestor::ns:ex|ancestor::ns:note))]',

      getInterpretativeChildNodes: './/(ns:g | text())[not((ancestor::ns:sic|ancestor::ns:orig|ancestor::ns:abbr|ancestor::ns:am|ancestor::ns:note))]',
      getCriticalChildNodes: './/((ns:lem | ns:rdg)[@wit]|text())',
      getCurrentTitle: 'string(.//ancestor::ns:text/@n)',
      getCurrentTextNode: './/ancestor::ns:text[max(1)]',
   }
});
