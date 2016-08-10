module.exports = {
	languages: {
		'cmn': 'cn'
	},
	getCountryCode: function(language) {
		return (this.languages[language])? this.languages[language] : language.substr(0, 2)
	}
};