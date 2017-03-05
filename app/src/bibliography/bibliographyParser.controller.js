angular.module('evtviewer.dataHandler')

.controller('BibliographyCtrl', function($scope, $element,$attrs,parsedData,config) {
	$scope.styles=config.allowedBibliographicStyles;
	$scope.string=[];
	$scope.bibliographicRefsCollection = parsedData.getBibliographicRefsCollection();
	
	/*/Format result/*/
	$scope.formatResult = function(styleCode, newBiblElement) {
		var string = '';
		if (newBiblElement) {
			//presentiamo i risultati estratti, in teoria in base a un codice scegliamo l'otput desiderato
			if (styleCode === $scope.styles[0]) {
				//autore-data-titolo-titolo_monografia(se presente)- edizione-luogo pubblicazione-data-numero pagina-idno(se dati)
				//il primo autore deve essere citato con cognome-nome
				if(newBiblElement.author && newBiblElement.author.length > 0){
					var firstAuthor = newBiblElement.author[0];
					//il nome lo prendiamo per mezzo del tag name o forename
					var firstName = firstAuthor.name != '' ? firstAuthor.name : firstAuthor.forename;
					var firstSurname = firstAuthor.surname;
					string += '<span data-style="chicago" class="author">';
					if (firstName != ''){
						string += '<span data-style="chicago" class="name">' + firstName + '</span>';
					}
					if(firstSurname != ''){
						string += '<span data-style="chicago" class="surname">' + firstSurname + '</span>';	
					}						
				}
					string += '</span>';
					//se c'è più di un autore gli altri sono citati con nome-cognome	
					angular.forEach(newBiblElement.author, function(authorElement,key){
						//il primo autore lo abbiamo già sistemato prima, adesso (se ci sono) aggiungiamo gli altri
						if(key>0){
							var name = authorElement.name != '' ? authorElement.name : authorElement.forename;
							var surname = authorElement.surname;
							string += '<span data-style="chicago" class="author">';
							if (name != ''){
								string += '<span data-style="chicago" class="name">' + name + '</span>';
							}
							if(surname != ''){
								string += '<span data-style="chicago" class="surname">' + surname + '</span>';
							}
							string += '</span>';
						}
					});		
				if(getPubblicationType(newBiblElement).toLowerCase() == 'journalarticle' ){
					if (getTitleAnalytic(newBiblElement)) {
						string += '<span data-style="chicago" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '</span>';
					}
					if (getTitleMonogr(newBiblElement)) {
						if (getTitleAnalytic(newBiblElement)) {
							string += '<span class data-style="chicago">in</span><span data-style="chicago" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
						}
						else {
							string += '<span data-style="chicago" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
						}
					}	
					if (getVolumes(newBiblElement)){
						string += '<span data-style="chicago" class="vol">' + getVolumes(newBiblElement) + '</span>';	
					}				
					if (getDate(newBiblElement)) {
						string += '<span data-style="chicago" class="date">' + getDate(newBiblElement) + '</span>';
					}
					if (getPages(newBiblElement)) {
						string += '<span data-style="chicago" class="pp">' + getPages(newBiblElement) + '</span>';
					}	
					angular.forEach(newBiblElement.idno,function(el,key){
						if(key === 'DOI'){
							string += '<span data-style="chicago" class="idno" data-type="'+key+'">' + el.textContent + '</span>';
						}
					});
				}
				else{
				//else if(getPubblicationType(newBiblElement).toLowerCase() == 'monograph' ){
					if (getTitleAnalytic(newBiblElement)) {
						string += '<span data-style="chicago" data-attr="titolo" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '.</span>';
					}
					if (getTitleMonogr(newBiblElement)) {
						string += '<span data-style="chicago" data-attr="titolo" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '.</span>';
					}
					if (getVolumes(newBiblElement)){
						string += '<span data-style="chicago" class="vol">' + getVolumes(newBiblElement) + '</span>';	
					}	
					if (getPubPlace(newBiblElement)){
						string += '<span data-style="chicago" class="pubPlace">' + getPubPlace(newBiblElement) + '</span>';	
					}	
					if (getEditor(newBiblElement)) {
						string += '<span data-style="chicago" class="editor">' + getEditor(newBiblElement) + '</span>';
					}
					if (getUrl(newBiblElement)){
						string += '<span data-style="chicago" class="url">' + getUrl(newBiblElement) + '</span>';	
					}						
					angular.forEach(newBiblElement.idno,function(el,key){
						if(key == 'ISSN'){
							string += '<span data-style="chicago" class="idno" data-type="'+key+'">' + el.textContent + '</span>';
						}
					});
				}
			}	
				
			/*/
			Altro stile
			/*/
			else if(styleCode === $scope.styles[1]){
				if(newBiblElement.author && newBiblElement.author.length > 0){
					var firstAuthor = newBiblElement.author[0];
					var firstName = firstAuthor.name != '' ? firstAuthor.name : firstAuthor.forename;
					var firstSurname = firstAuthor.surname;
					string += '<span data-style="apa" class="author">';
					if (firstSurname != ''){
						string += '<span data-style="apa" class="surname">' + firstSurname + '</span>';
					}
					if(firstName != ''){
						string += '<span data-style="apa" class="name">' + firstName + '</span>';		
					}
					string += '</span>';
					angular.forEach(newBiblElement.author, function(authorElement,key){
						//il primo autore lo abbiamo già sistemato prima, adesso (se ci sono) aggiungiamo gli altri
						if(key>0){
							var surname = authorElement.surname != '' ? authorElement.surname : authorElement.name;
							if (surname != ''){
								string += '<span data-style="apa" class="author">' + surname + '</span>';
							}							
						}
					});		
				}
				if (getDate(newBiblElement)) {
					string += '<span data-style="apa" class="date">' + getDate(newBiblElement) + '</span>';
				}	
				
				if (getTitleAnalytic(newBiblElement)) {
					string += '<span data-style="apa" data-attr="titolo" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '</span>';
				}
				//se non c'è il titolo dentro analytic allora prendiamo quello dentro monogr, entrambi no
				if (getTitleMonogr(newBiblElement) && !getTitleAnalytic(newBiblElement)) {
					string += '<span data-style="apa" data-attr="titolo" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
				}
				
				if(getVolumes(newBiblElement)){
					var vol=getVolumes(newBiblElement);
					if(getIssue(newBiblElement)){
						var issue=getVolumes(newBiblElement);
						string+='<span data-style="apa" class="vol">'+vol+'('+issue+')</span>';
					}
					else{
						string+='<span data-style="apa" class="vol">'+vol+'</span>'
					}
				}
				
				if (getPages(newBiblElement)) {
					string += '<span data-style="apa" class="pp">' + getPages(newBiblElement) + '</span>';
				}
				
				if (getAccessed(newBiblElement)){
					string += '<span data-style="apa" class="accessed">' + getAccessed(newBiblElement) + '</span>';
				}
				
				if (getUrl(newBiblElement)){
					string += '<span data-style="apa" class="url">' + getUrl(newBiblElement) + '</span>';
				}
			}				
		}
		$scope.string.push(string);
	}

	$scope.$on('styleChangedBroadcast', function(event, args) {
		//resettiamo il contenitore degli elementi bibliografici formattati
		$scope.string.length=0;
		for(var c=0;c<$scope.bibliographicRefsCollection.length;c++){
			$scope.formatResult(args.message,$scope.bibliographicRefsCollection[c]);
			}
    });
});