/*/
	Getters, ritornano o il valore richiesto relativo a una entrata bibliografica estratta o undefined. 
	/*/
	
	function getID(newBiblElement){
		if (newBiblElement.id !== '') {
			return newBiblElement.id;
		}
	}
	
	function getTitleAnalytic(newBiblElement){
		if (newBiblElement.titleAnalytic !== '') {
			return newBiblElement.titleAnalytic;
		}
	}
	
	function getTitleMonogr(newBiblElement){
		if (newBiblElement.titleMonogr !== '') {
			return newBiblElement.titleMonogr;
		}
	}
	function getEditionMonogr(newBiblElement){
		if (newBiblElement.editionMonogr !== ''){
			return newBiblElement.editionMonogr;	
		}
	}
	function getPubPlace(newBiblElement){				
		if (newBiblElement.pubPlace !== '') {
			return newBiblElement.pubPlace;
		}
	}
	function getDate(newBiblElement){
		if (newBiblElement.date !== '') {
			return newBiblElement.date;
		}
	}
	
	function getPages(newBiblElement){
		if (typeof newBiblElement.note !== 'undefined') {
			if (typeof newBiblElement.note.pp !== 'undefined') {
				return newBiblElement.note.pp;
			}
			//magari si chiama pages
			else if (typeof newBiblElement.note.pages !== 'undefined') {
				return newBiblElement.note.pages;
			}
		}
	}
			
			
	function getAccessed(newBiblElement){		
			if (typeof newBiblElement.note.accessed !== 'undefined'){
				return newBiblElement.note.accessed;
			}
	}
	
	function getUrl(newBiblElement){
			if (typeof newBiblElement.note.url !== 'undefined'){
				return newBiblElement.note.url;
			}
		}
	
	function getVolumes(newBiblElement){
		if(typeof newBiblElement.biblScope.vol !== 'undefined'){
			return newBiblElement.biblScope.vol;
		}
	}

	function getIssue(newBiblElement){
		if(typeof newBiblElement.biblScope.issue !== 'undefined'){
			return newBiblElement.biblScope.issue;
		}
	}	
	
	function getPubblicationType(newBiblElement){
		if(typeof newBiblElement.type !== ''){
			return newBiblElement.type;
		}
	}
	
	function getEditor(newBiblElement){
	if(newBiblElement.editor !== ''){
		return newBiblElement.editor;
	}
}