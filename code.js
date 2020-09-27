/*Function to read a Text file (words.txt) and get the derived words for a given root word*/
function readTextFile(btn) {
  // Clear existing lists
  while (rootlist.firstChild) {
    rootlist.removeChild(rootlist.firstChild);
  }
  // Using XMLHttp retrieve a CSV of derived words based on a selected root word
  var rawFile = new XMLHttpRequest(); // Setup HTTP request to read file
  rawFile.open("GET", "words.txt", true); // Open CSV file words.txt
  rawFile.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // State = 4 means Operation to GET the file is completed and 200 means HTTP success
      allText = this.responseText; // Command for retrieving file contents
      lines = allText.split(/[\s]+/); // Parsing a CSV file
      for (
        i = 0;
        i < lines.length;
        i++ // Looping through each line in CSV file
      ) {
        b = lines[i].split(","); // Splitting a line and creating an array of elements seperated  by commas
        if (b[0] == btn) {
          // check for a match of "Root Word"
          var numWords = b.length; // Retrieve total number of Derived words
          for (
            j = 1;
            j < numWords;
            j++ // Create a list of Derived words
          ) {
            var node = document.createElement("LI");
            var text = document.createTextNode(b[j]);
            node.appendChild(text);
            document.getElementById("rootlist").appendChild(node); // Add Derived words to the unordered list with id "rootlist"
          }
        }
      }
    }
  };
  rawFile.send(null); // Not updating the document
}

/*Function to read input word and display synonyms in an unordered list*/
function getsynonyms() {
  // Clear existing lists
  while (synonymlist.firstChild) {
    synonymlist.removeChild(synonymlist.firstChild);
  }
  word = document.getElementById("wordsyn").value; // Retrieve the word specified by the user
  // Using XMLHttp to call an API for obtaining information
  req = "https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/";
  req = req.concat(word, "?key=ceff39cb-6899-42a3-81c1-531c12dc3f5c");
  var wsreq = new XMLHttpRequest();
  // Open and Send the API request
  wsreq.open("GET", req, true);
  wsreq.send();
  // Execute the function when there is response from the API
  wsreq.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var RspCsv = wsreq.responseText;
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(RspCsv, "text/xml"); // Parse the API response (RspCsv) to an XML

      meaning = " "; // In case there is no existing meaning for a given word
      if (xmlDoc.getElementsByTagName("sens").length > 0) {
        // Search for element "sens" in the XML, as it contains the meaning
        var data = xmlDoc.getElementsByTagName("sens")[0]; // Retrieve first child of sens, if the element exists
        var dat = data.getElementsByTagName("mc")[0]; // Retrieve first instance of mc, mc[0] will have one meaning
        var y = dat.childNodes[0]; // Access inner text of mc tag <mc>Inner text </mc>
        var meaning = y.nodeValue; // Retrieve value from Inner text and save the meaning of the word
      }
      if (xmlDoc.getElementsByTagName("syn").length > 0) {
        // Search for element "syn" in the XML, as it contains synonyms
        var data = xmlDoc.getElementsByTagName("syn")[0];
        var y = data.childNodes[0];
        z = y.nodeValue;
        b = z.split(","); // Splitting a line and creating an array of elements seperated  by commas

        var numWords = b.length;
        var listlen = 5; // Limiting the display to maximum 5 Synonyms
        if (numWords > listlen) {
          numWords = listlen;
        }
        for (
          j = 0;
          j < numWords;
          j++ // Create a list of Synonyms
        ) {
          val = b[j].trim();
          valfinal = val.split(" ")[0];
          if (valfinal !== word) {
            // Avoid displaying the synonym if it matches the user entered word
            var node = document.createElement("li");
            // Save the meaning in the title attribute for hover functionality, title will automatically display it
            node.setAttribute("title", meaning);
            node.setAttribute("class", "synolist"); // Assign a class name for handling hover functionality
            var text = document.createTextNode(valfinal);
            node.appendChild(text);
            document.getElementById("synonymlist").appendChild(node); // Append child for Display
          }
        }
      } else {
        var node = document.createElement("li");
        var text = document.createTextNode("No Synonyms available"); // Display this when there are no synonyms to retrieve from the XML
        node.appendChild(text);
        document.getElementById("synonymlist").appendChild(node);
      }
    }
  };
}

/*Function to read input word, display the meaning and an example sentence if available*/
function getmeaning() {
  // Clear existing lists
  while (meaninglist.firstChild) {
    meaninglist.removeChild(meaninglist.firstChild);
  }
  var word = document.getElementById("wordmeaning").value; // Retrieve the word specified by the user
  // Using XMLHttp to call an API for obtaining information
  req = "https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/";
  req = req.concat(word, "?key=ceff39cb-6899-42a3-81c1-531c12dc3f5c");
  var wsreq = new XMLHttpRequest();
  // Open and Send the API request
  wsreq.open("GET", req, true);
  wsreq.send();
  // Execute the function when there is response from the API
  wsreq.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var RspCsv = wsreq.responseText;
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(RspCsv, "text/xml"); // Parse the API response (RspCsv) to an XML
      // Search for element "sens" and "mc"in the XML, as it contains the meaning
      if (
        xmlDoc.getElementsByTagName("sens").length > 0 &&
        xmlDoc.getElementsByTagName("mc").length > 0
      ) {
        var data = xmlDoc.getElementsByTagName("sens")[0];
        var dat = data.getElementsByTagName("mc")[0];
        var y = dat.childNodes[0]; // retrieve first child of mc
        z = y.nodeValue; // Retrieve value of first child of mc

        //Creating a list element under unordered list "meaninglist" consisting of meaning of the word specified by the user in Get Meaning
        var node = document.createElement("li");
        var text = document.createTextNode(z);
        node.appendChild(text);
        document.getElementById("meaninglist").appendChild(node); // Append Meaning as an item to the unordered list "meaninglist"

        /* Search for element "vi" as it contains examples for the user specified word and display Example sentence only if available.
                   This is an add on functionality and will not affect the meaning part.
                */
        if (xmlDoc.getElementsByTagName("vi").length > 0) {
          var zsen = "Example: "; // Initialize a value for the Example string
          var datsent = data.getElementsByTagName("vi")[0]; // Retrieve first instance of <vi>
          // Loop through all the child nodes of <vi> to construct the Example sentence
          for (var i = 0; i < datsent.childNodes.length; i++) {
            /* The XML consists of "<it> word being searched </it>" tag for each <vi> node.
                           If the current child in the loop is the one with the italics tag and its node value is null,
                           then append the word being searched.
                           Assumption: All words in the example sentence are embedded in italics tag under <vi> node.
                        */
            if (
              datsent.getElementsByTagName("it").length > 0 &&
              datsent.childNodes[i].nodeValue == null
            ) {
              zsen = zsen + word; // Appending the word to the sentence
            } else {
              var ysen = datsent.childNodes[i];
              zsen = zsen + ysen.nodeValue; // Forming the sentence from <vi> node children
            }
          }
          // Append Example Sentence as an item to the unordered list "meaninglist" after appending the meaning.
          var nodesen = document.createElement("li");
          var textsen = document.createTextNode(zsen);
          nodesen.appendChild(textsen);
          document.getElementById("meaninglist").appendChild(nodesen);
        }
      } else {
        // Display this when meaning cannot be retrieved from the XML
        var node = document.createElement("li");
        var text = document.createTextNode("No Data Found");
        node.appendChild(text);
        document.getElementById("meaninglist").appendChild(node);
      }
    }
  };
}

/*JQuery code to perform a function on hover over the elements with class attribute synolist.
Mainly used on Displayed Synonyms list. 
$(document).ready(function(){
    $(".synolist").hover(function(){ // Applicable on "synolist" class when hovered
        var title = $(this).attr('title'); // Retrieve title attribute value of the active element <in this case hovered element>
        $(this).data('tipText', title).removeAttr('title'); // Remove any previous date
        $('<p class="tooltip"></p>') // Create a Paragraph Display with class "tooltip", Styling for this is defined in the Master_w3_Dictionary.html
        .text(title)
        .appendTo('body')
        .fadeIn('slow');
}, function() {
        // Hover out code
        $(this).attr('title', $(this).data('tipText'));
        $('.tooltip').remove();
}).mousemove(function(e) {
        var mousex = e.pageX + 20; //Get X coordinates
        var mousey = e.pageY + 10; //Get Y coordinates
        $('.tooltip')
        .css({ top: mousey, left: mousex })
});
});
*/

//On load of the web page, default flashcards to show the word written below
function showfc() {
  document.getElementById("wordsyn").value = ""; // No default value for Synonyms Display
  document.getElementById("wordmeaning").value = ""; // No default value for Get Meaning Display
  document.getElementById("wordfront").innerHTML = "abysmal"; // Default value for Flash Card Dislay
  $("card").show();
  audioURL = "https://media.merriam-webster.com/soundc11/a/abysma01.wav"; // Hard coding URL of audio file for "abysmal", useful for flashcard display
  audio = document.getElementById("audio"); // Accessing audio element for loading purpose
  var audioSrc = document.getElementById("wordAudio"); // Accessing source element for dynamically assigning "src" value
  audioSrc.setAttribute("src", audioURL); // Assing "src" value for accessing the audio file
  audio.load(); // Loading the audio file to be played by the user
}

//Function to show the meaning after hovering in Flash Cards
function flipword() {
  $(".card").toggleClass("flipped");
  // Start a new code block by inserting new braces <Reason Unknown>
  {
    word_front = document.getElementById("wordfront").innerHTML;

    // Using XMLHttp to call an API for obtaining information
    req = "https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/";
    req = req.concat(word_front, "?key=ceff39cb-6899-42a3-81c1-531c12dc3f5c");
    var wsreq = new XMLHttpRequest();
    // Open and Send the API request
    wsreq.open("GET", req, true);
    wsreq.send();
    // Execute the function when there is response from the API
    wsreq.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var RspCsv = wsreq.responseText;
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(RspCsv, "text/xml"); // Parse the API response (RspCsv) to an XML

        if (xmlDoc.getElementsByTagName("sens").length > 0) {
          // Search for element "sens" in the XML, as it contains the meaning
          var data = xmlDoc.getElementsByTagName("sens")[0];
          var dat = data.getElementsByTagName("mc")[0];
          var y = dat.childNodes[0];
          z = y.nodeValue;
          document.getElementById("wordback").innerHTML = z;
        } else {
          document.getElementById("wordback").innerHTML = "Meaning not found";
        }
      }
    };
  }
}

// Toggles the display, used in Flash Cards for bringing back Word display <front display>
function flipback() {
  $(".card").toggleClass("flipped");
}

// Randomly pick a word from the "Words.txt" set
function nextWord() {
  // Importing words from Words.txt for now TODO: Import from an API
  file = "words.txt";
  // Creates an XML HTTP Request to access the file
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        allText = rawFile.responseText;
        rows = allText.split(/[\s]+/); // Parse the file and save lines as rows

        for (
          i = 0;
          i < rows.length;
          i++ // Loop through all the lines
        ) {
          b = rows[i].split(","); // Split each line by using comma as a seperator
          if (b[0] == "SET") {
            // Hardcoded the "SET" value for now TODO: Improve it
            var numWords = b.length - 1; // avoid overshooting the range, to be realistic
            a = Math.floor(Math.random() * numWords); // TODO: Can improve random function
            document.getElementById("wordfront").innerHTML = b[a + 1]; // Assigning the random selected word to the "wordfront" for Display
            $("card").show(); // Shows the value
          }
        }
      }
    }
  };
  rawFile.send(null); // makes sure not to send anything to the file
}

// Prints Word of the day and Meaning both if available
function Wotd() {
  // Clear existing lists
  while (wotday.firstChild) {
    wotday.removeChild(wotday.firstChild);
  }
  // Importing words from Words.txt for now TODO: Import from an API
  file = "words.txt";
  // Creates an XML HTTP Request to access the file
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        allText = rawFile.responseText;
        rows = allText.split(/[\s]+/); // Parse the file and save lines as rows

        for (
          i = 0;
          i < rows.length;
          i++ // Loop through all the lines
        ) {
          b = rows[i].split(","); // Split each line by using comma as a seperator
          if (b[0] == "SET") {
            // Hardcoded the "SET" value for now TODO: Improve it
            var numWords = b.length - 1; // avoid overshooting the range, to be realistic
            a = Math.floor(Math.random() * numWords); // TODO: Can improve random function
            WOTD = b[a + 1]; // Assigning a random word
          }
        }
      }
    }
  };
  rawFile.send(null); // makes sure not to send anything to the file

  // Using XMLHttp to call an API for obtaining information
  req = "https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/";
  req = req.concat(WOTD, "?key=ceff39cb-6899-42a3-81c1-531c12dc3f5c");
  var wsreq = new XMLHttpRequest();
  // Open and Send the API request
  wsreq.open("GET", req, true);
  wsreq.send();
  // Execute the function when there is response from the API
  wsreq.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var RspCsv = wsreq.responseText;
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(RspCsv, "text/xml"); // Parse the API response (RspCsv) to an XML

      if (xmlDoc.getElementsByTagName("sens").length > 0) {
        // Search for element "sens" in the XML, as it contains the meaning
        var data = xmlDoc.getElementsByTagName("sens")[0];
        var dat = data.getElementsByTagName("mc")[0];
        var y = dat.childNodes[0];
        z = y.nodeValue;

        var node = document.createElement("li");
        var text = document.createTextNode(WOTD);
        node.appendChild(text);
        document.getElementById("wotday").appendChild(node); // Append word as a list item to the "wotday" unordered list

        var node = document.createElement("li");
        var text = document.createTextNode(z);
        node.appendChild(text);
        document.getElementById("wotday").appendChild(node); // Append Meaning as a list item to the unordered list "wotday"
      } else {
        var node = document.createElement("li");
        var text = document.createTextNode(
          "Take a Break! Eat a Cake! No Words to Take!"
        );
        node.appendChild(text);
        document.getElementById("wotday").appendChild(node); // Append above message as an item to the unordered list "wotday" if the meaning is not available
      }
    }
  };
}

// Plays the audio when "Play Audio" button is clicked by user in FlashCards
function playAudio() {
  // Using XMLHttp to call an API for obtaining audio information
  // Note: Word Audio information requires a different key as the API call being made is not same as the other API calls in this code base.
  wordAud = document.getElementById("wordfront").innerHTML;
  // retrieving the word from the flashcard front for generating audio file
  req = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
  req = req.concat(wordAud, "?key=dc82f7d7-526f-468b-aaa7-a6285e77d6a9");
  var wsreq = new XMLHttpRequest();

  // Open and Send the API request
  wsreq.open("GET", req, true);
  wsreq.send();
  // Execute the function to access audio file when there is response from the API
  wsreq.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var RspCsv = JSON.parse(this.responseText);
      if (RspCsv[0].hwi.prs[0].sound.audio !== "");
      {
        // Search for element "sens" in the XML, as it contains the meaning
        //var data = RspCsv.getElementsByTagName("wav")[0]; // File name can be accessed from this node
        //var soun = data.childNodes[0];
        audiofc = RspCsv[0].hwi.prs[0].sound.audio; // WAV file name containg the audio of the flash card word
        firstAlpha = audiofc.charAt(0); // Accessing the first character from the file name, in the process of creating the URL
        audioURL =
          "https://media.merriam-webster.com/soundc11/" +
          firstAlpha +
          "/" +
          audiofc +
          ".wav"; // Creating URL for audio access

        audio = document.getElementById("audio"); // Accessing audio element for loading purpose
        var audioSrc = document.getElementById("wordAudio"); // Accessing source element for dynamically assigning "src" value
        audioSrc.setAttribute("src", audioURL); // Assing "src" value for accessing the audio file
        audio.load();
        audio.play();
      }
    }
  };
}

/*TODO: Optimize the code, get meaning code is used many times.
Add additional root words and respective derived words in "Words.txt".
Change variable names.
*/
