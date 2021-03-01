// load a book from disk
function loadBook(fileName, dispalyName){
    let currentBook = "";
    let url = "books/" + fileName;

    // reset ui
    document.getElementById("file_name").innerHTML = dispalyName;
    document.getElementById("keyword").value = "";

    // server request to load book
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200){
            currentBook = xhr.responseText;

            getDocStat(currentBook);

            // replace line break and carriage returns and replace with <br>
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, "<br>");

            var element = document.getElementById("file_content");
            element.innerHTML = currentBook;
            element.style.color = "#505050";
            element.scrollTop = 0;

        }
    }
}

// get the stats of the book
function getDocStat(fileContent){
    var docLength = document.getElementById("doc_length");
    var wordCount = document.getElementById("word_count");
    var charCount = document.getElementById("char_count");

    let text = fileContent.toLowerCase();
    let wordArray = text.match(/\b\S+\b/g);
    let wordDictionary = {};

    // filter out uncommon words
    var unCommonWords = filterStopWords(wordArray)

    // count every word in word array
    for(let word in unCommonWords){
        let wordValue = unCommonWords[word];

        if(wordDictionary[wordValue] > 0){
            wordDictionary[wordValue] += 1;
        }else{
            wordDictionary[wordValue] = 1;
        }
    }

    // sort the array
    let wordList = sortProperties(wordDictionary);

    // top 5 words
    let top5words = wordList.slice(0,6);

    // least 5 fords
    let least5words = wordList.slice(-6, wordList.length);

    // send values to page
    template(top5words, document.getElementById("most_used"));
    template(least5words, document.getElementById("least_used"));

    docLength.innerText = "document length: " + text.length;
    wordCount.innerText = "word count: " + wordArray.length;

}

// funtion to send most/least used words to page
function template(items, element){
    let rowTemplate = document.getElementById("template");
    let template = rowTemplate.innerHTML;
    let result = "";

    for(i=0; i < items.length-1; i++){
        result += template.replace("{{val}}", items[i][0] + " : " + items[i][1] + " time(s)");

        element.innerHTML = result;
    }
}


// function to convert the object to array and then sort it
function sortProperties(obj){
    // convert object to an array
    let returnArray = (Object.entries(obj));
    
    // sort the array
    returnArray.sort(function (first, second){
        return second[1] - first[1];
    })

    return returnArray;
}


// filter words we dont want (Stop words)
function filterStopWords(wordArray){
    var commonWords = getStopWords();
    var commonObj = {};
    var unCommonArray = [];

    for(i=0; i < commonWords.length; i++){
        commonObj[commonWords[i].trim()] = true
    }

    for(i=0; i< wordArray.length; i++){
        word = wordArray[i].trim().toLowerCase();

        if(!commonObj[word]){
            unCommonArray.push(word);
        }
    }

    return unCommonArray;
}

// a list of stop words taht don't want to include in stats
function getStopWords(){
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}

// mark the words in the search
function performMark(){
    // read the keyword
    var keyword = document.getElementById("keyword").value;
    var display = document.getElementById("file_content");

    var newContent = "";

    // find all the currently marked items
    let spans = document.querySelectorAll("mark");
    // <mark></mark>

    for( let i=0; i < spans,length; i++){
        spans[i].outerHTML = spans[i].innerText;
    }

    var re = new RegExp(keyword, "gi");
    var replaceText = "<mark id='markme'>$&</mark>";
    var bookContent = display.innerHTML;

    // add the mark to the book content
    newContent = bookContent.replace(re,replaceText);

    display.innerHTML = newContent;
    var count = document.querySelectorAll("mark").length;
    document.getElementById("search_stat").innerHTML = "found " + count + " matches";

    if(count > 0){
        var element = document.getElementById("markme");
        element.scrollIntoView()
    }

}