'use strict';

let LETTERS_QUEUE = ['e', 't', 'a', 'o', 'i', 'n', 's', 'h', 'r', 'd', 'l', 'u']
let BASE_CHAR_CODE = 'a'.charCodeAt(0);

function Brain(wordList) {
	this._init(wordList);
	this._currCollection = [];
	this._lastWord = '';
	this._chosenLetters = [];
}

Brain.prototype._init = function(wordList) {
	this.wordsWithLength = {};
	wordList.forEach((el, i) => {
		let l = el.length;
		if (!this.wordsWithLength[l]) {
			this.wordsWithLength[l] = [];
		}
		this.wordsWithLength[l].push(el);
	});
};

Brain.prototype.guess = function(word, isNewWord) {
	word = word.toLowerCase();
	if (isNewWord) {
		this._newWord(word);
	}

	let diff = this._diffWord(this._lastWord, word);
	let isFilterIn = !!diff.length;
	if (!isFilterIn) {
		diff = this._chosenLetters[this._chosenLetters.length - 1];
	}

	this._currCollection = this._filterCollection(this._currCollection, diff, isFilterIn);
	console.log(`Filtered collection length: ${this._currCollection.length}`);

	let letter = this._determineLetter(this._currCollection);
	this._chosenLetters.push(letter);
	return letter.toUpperCase();
};

Brain.prototype._filterCollection = function(collection, diff, isFilterIn) {
	debugger;
	if (!diff) return collection;
	let filterIn = (el, i) => {
		let isIn = true;
		diff.forEach((d, idx) => {
			isIn = isIn && el[d.index] === d.letter;
		});
		return isIn;
	};
	let filterOut = (el, i) => {
		return !el.includes(diff);
	};
	let filterFunc = isFilterIn ? filterIn : filterOut;
	return collection.filter(filterFunc);
};

Brain.prototype._determineLetter = function(collection) {
	let letterFrequency = new Array(26).fill(0);
	collection.forEach((word) => {
		let len = word.length;
		for (let i = 0; i < len; i++) {
			if (this._chosenLetters.indexOf(word[i]) >= 0) continue;
			letterFrequency[word.charCodeAt(i) - BASE_CHAR_CODE]++;
		}
	});
	let charCode = letterFrequency.indexOf(Math.max.apply(Math, letterFrequency)) + BASE_CHAR_CODE;
	return String.fromCharCode(charCode);
}

Brain.prototype._diffWord = function(oldWord, newWord) {
	let result = [];
	oldWord.split('').forEach((el, i) => {
		if (newWord[i] !== el) {
			result.push({
				index: i,
				letter: newWord[i]
			});
		}
	});
	return result;
};

Brain.prototype._newWord = function(word) {
	this._lastWord = word;
	this._chosenLetters = [];
	this._currCollection = this.wordsWithLength[word.length];
};

module.exports = Brain;