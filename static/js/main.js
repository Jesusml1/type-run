const sample = ["we", "very", "after", "interest", "new", "open", "follow",
                "turn", "fact", "little", "place", "after", "around", "leave",
                "around", "back", "leave", "those", "hand", "find", "more",
                "other", "for", "be", "off", "however", "number", "come",
                "around", "home", "right", "home", "between", "lead", "any",
                "great", "form", "as", "begin", "program", "long", "school",
                "have", "on", "do", "when", "never", "on", "however", "how",
                "one", "he", "before", "good", "like", "group", "still",
                "school", "how", "school", "too", "in", "change", "would",
                "general", "govern", "a", "ask", "nation", "feel", "order",
                "or", "same", "order", "than", "come", "long", "hand", "like",
                "turn", "up", "school", "fact", "back", "in", "we", "may",
                "need", "which", "such", "around", "such", "large", "with",
                "high", "get", "each", "he", "consider", "you", "interest",
                "about", "again", "may", "way", "high", "more", "even", "head",
                "give", "because", "a", "any", "that", "over", "in", "plan",
                "know", "time", "than", "which", "by", "one", "few", "those",
                "however", "in", "interest", "back", "never", "there", "at",
                "use", "who", "but", "after", "form", "lead", "help", "people",
                "those", "lead", "life", "say", "also", "because", "late",
                "have", "head", "take", "much", "at", "head", "than", "tell",
                "much", "about", "large", "new", "since", "when", "real",
                "large", "between", "however", "face", "up", "or", "when",
                "help", "might", "place", "back", "at", "early", "want",
                "stand", "follow", "while", "school", "because", "where",
                "as", "this", "more", "show", "not", "own", "house", "lead",
                "think", "more", "fact", "tell", "set", "hold", "old", "of",
                "problem", "form", "do", "have", "which", "any", "would",
                "from", "little", "group", "first", "many", "real", "small",
                "all", "on", "against", "work", "just", "change", "good",
                "through", "still", "must", "look", "course", "year", "take",
                "than", "much", "help", "up", "form", "and", "man", "after",
                "that", "think", "go", "now", "like", "who", "school",
                "consider", "be", "will", "end", "public", "form", "head",
                "mean", "another"];


// WORDS COLOR

const wrongly_spelled_color = "FireBrick";
const correctly_spelled_color = "ForestGreen";
const current_word_color = "DarkMagenta";
const normal_input_color = "rgb(255, 255, 255)";
const checkSpell_input_color = "#f8c4c4";

const getRandomInt = (max) => (Math.floor(Math.random() * Math.floor(max)));
const wordWrapper = "word-bank-wrapper";


// BANKWORD 

class BankWord {

    static wordBankGenerator(numberOfWords) {
        let words = [];
        while(words.length < numberOfWords){
  	        let toAdd = sample[getRandomInt(250)];
                if(!words.includes(toAdd)){
                    words.push(toAdd);
                }
        }
        return words;
    }

    static pickWords (mode, customText) {

        let wordbank = [];

        switch (mode) {
            case "30-words":
                wordbank = this.wordBankGenerator(30);
                break;
            case "50-words":
                wordbank = this.wordBankGenerator(50);
                break;
            case "100-words":
                wordbank = this.wordBankGenerator(100);
                break;
            case "custom":
                wordbank = customText.split(" ");
                break;
        }

        wordbank = wordbank.map((word) => (word + " "));
        return wordbank;
    
    }

}


// USER INTERFACE

class UI {

    static displayWords(selection, customText){

        let wrapper = "#word-bank-wrapper"
        let words = BankWord.pickWords(selection, customText);
        for (let word of words) {

            let newpre = document.createElement("pre");
            let container = document.querySelector(wrapper);
            newpre.innerText = word;
            container.appendChild(newpre);
        
        }

    }

    static clearDisplay() {
        let display = document.querySelector("#word-bank-wrapper");
        display.innerHTML = "";
    }

    static clearInput() {
        document.querySelector("#input").value = "";
    }

    static displayACC() {
        let acc = document.querySelector("#acc-value")
        acc.innerHTML = `${Checker.countAcc()}%`;
    }

    static displayWPM() {

        let intervals = JSON.parse(document.querySelector("#wpm").dataset.words);
        intervals.unshift(Checker.currentBank().length);
        let avg = intervals.map( (a, i, n) => (a - (n[i + 1])) * 10 ).filter(n => (!isNaN(n))).reduce((total, amount, index, array) => {
            total += amount;
            if(index === array.length - 1) { 
              return total/array.length;
            } else { 
              return total;
            }
          });

        avg = Math.round(avg);
        console.log("Avg: ", avg);
        document.querySelector("#wpm-value").innerHTML = `${avg}`;
        this.clearWpmDataset();
        
    }

    static clearWpmDataset() {
        document.querySelector("#wpm").dataset.words = JSON.stringify([]);
    }


    static toggleInputColor( color ) {
        const input = document.querySelector("#input");
        input.style.backgroundColor = `${color}`;
    }

}


// SPELL CHECKER

class Checker{

    static currentBank = () => {
        
        let currentWords = [];
        for (let element = 1; element < document.querySelector("#word-bank-wrapper").childElementCount + 1; element++) {
            currentWords.push(document.querySelector(`#word-bank-wrapper pre:nth-child(${element})`).textContent);
        }
        let result = currentWords.map(word => word.trim());
        return result;

    }

    static storeActualBank = () => {
    
        let toStore = JSON.stringify(Checker.currentBank());
        document.querySelector("#label").textContent = toStore;
        
    }

    static getActualBank = () => {
        let mydata = document.querySelector("#label").innerHTML;
        let myArray = mydata.split(" ");
        return JSON.parse(myArray.shift());
    }

    static shiftAtualBank = () => {
        let arrayToShift = this.getActualBank();
        arrayToShift.shift();
        document.querySelector("#label").textContent = JSON.stringify(arrayToShift);
    }

    static checkSpell(input, currentWord, key){

        input = input.toLowerCase();
        currentWord = currentWord.toLowerCase();

        if (input == currentWord) {
            document.querySelector(`#word-bank-wrapper pre:nth-child(${key})`).setAttribute("style", "color: darkgreen;");
            return true; 

        } else {
            document.querySelector(`#word-bank-wrapper pre:nth-child(${key})`).setAttribute("style", "color: darkred;");
            return false;
        }
           
            
    }

    static colorWord(color, key) {
        
        const actualBank = this.getActualBank();

        if (key) {
            document.querySelector(`#word-bank-wrapper pre:nth-child(${key})`).setAttribute("style", `color: ${color};`);
        } else if (!key && actualBank[0] != "") {
            document.querySelector(`#word-bank-wrapper pre:nth-child(1)`).setAttribute("style", `color: ${color};`);           
        } else {
            console.log("clear");
        }

    
    }

    static countAcc() {

        const bankSize = document.querySelector("#word-bank-wrapper").childElementCount;
        let correct = 0;
        let x = 0;
        let result = "";
        
        for (let i = 0; i < bankSize; i++) {
            if(document.querySelector("#word-bank-wrapper").children[i].style["color"] == correctly_spelled_color.toLowerCase()){
                correct += 1;
            }
            
        }
        
        x = (correct * 100) / bankSize;
        result = Math.round(x);
        return result;
    }

    static wpm () {

        let dataset = JSON.parse(document.querySelector("#wpm").dataset.words)
        let toPush = this.getActualBank().length;
        dataset.push(toPush);
        document.querySelector("#wpm").dataset.words = JSON.stringify(dataset);

    }

    static getInput() {
        const input = document.querySelector("#input").value;
        return input;
    }

    


}


// SELECTING MODE EVENT

const selector = document.querySelector("#mode-selector").addEventListener("change", (event) => {
    
    UI.clearDisplay();
    UI.displayWords(event.target.value);
    Checker.storeActualBank();
    document.querySelector(`#word-bank-wrapper pre:nth-child(1)`).setAttribute("style", "color: purple;");
    document.querySelector("#input").focus();
      
});


// TIMER

let timer;

const Timer = (n1, n2) => {
          
    if (n1 == n2) {

        timer = setInterval(() => Checker.wpm(), 10000);

    } else if (n1 == 1 && n2 == 0) {

        clearInterval(timer);
        

    }
}



// TYPING EVENT

const input = document.querySelector("#input");
input.addEventListener('keydown', (event) => {

    let currentBank = Checker.currentBank();
    let labelBank = Checker.getActualBank();

    switch(event.code){

        case ("Space"):

            Timer(labelBank.length, currentBank.length);
            let capture = document.querySelector("#input").value;
            if (capture == " " || capture == "") {

                UI.clearInput();
                
            } else if(capture != " " && capture.trim().toLowerCase() == labelBank[0]){

                try {

                    let currentInFixed = currentBank.indexOf(capture.trim().toLowerCase()) + 1;
                    Checker.colorWord(correctly_spelled_color, currentInFixed);
                    UI.clearInput();
                    Checker.shiftAtualBank();
                    Checker.colorWord(current_word_color, currentInFixed + 1);

                } catch (TypeError) {

                    UI.displayACC();
                    UI.displayWPM();
                    Timer(1,0)
                    console.log("Round finished");
                }
                

            } else if(capture != " " && capture.trim().toLowerCase() != labelBank[0]) {

                try{

                    let currentInFixed = currentBank.indexOf(labelBank[0]) + 1;
                    Checker.colorWord(wrongly_spelled_color, currentInFixed);
                    UI.clearInput();
                    Checker.shiftAtualBank();
                    Checker.colorWord(current_word_color, currentInFixed + 1);

                } catch (TypeError) {

                    UI.displayACC();
                    UI.displayWPM();
                    Timer(1,0)
                    console.log("clear");
                } 

            }

            break;

        case ("Backspace"):
    
            let captureBehind = Checker.getInput();
            captureBehind = captureBehind.trim().slice(0, captureBehind.length - 1);
            let actual = Checker.getActualBank()[0];
            let wordString = actual.slice(0, captureBehind.length);
            
            if (wordString == captureBehind) {
                UI.toggleInputColor(normal_input_color);
            } else if (wordString != captureBehind) {
                UI.toggleInputColor(checkSpell_input_color);
            }
            break;
        
        default: // Any other key

            let input = event.key;
            let currentLength = document.querySelector("#input").value.trim().length;
            let currentWord = Checker.getActualBank()[0];
        
            if (input == currentWord[currentLength]) {
                UI.toggleInputColor(normal_input_color);
            } else {
                UI.toggleInputColor(checkSpell_input_color);
            }

            break;
    

    }       
    
     
});


// REDO EVENT

const redo = document.querySelector("#redo-buttom");
redo.addEventListener("click", (event) => {
    
    const actualMode = document.querySelector("#mode-selector").value; 
    UI.clearDisplay();
    UI.displayWords(actualMode);
    UI.clearWpmDataset();
    UI.clearInput();
    UI.toggleInputColor(normal_input_color);
    Timer(1, 0);
    Checker.storeActualBank();
    Checker.colorWord("purple");
    document.querySelector("#input").focus();

});