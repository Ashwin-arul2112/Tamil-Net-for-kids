const tam = [
    "அம்மா",
    "அப்பா",
    "இளம்",
    "ஈரம்",
    "உதவிக",
    "ஊரா",
    "எலை",
    "ஏணி",
    "ஒட்டகம்",
    "ஓரம்",
    "கம்பி",
    "காப்பு",
    "கிணறு",
    "கீற்று",
    "கூடு",
    "கூட்டு"
  ];
  var word = ""

var modepoint = 0;

function setmode(mode){
    switch(mode) {
        case 'Easy':
            modepoint = 0;
            break;
        case 'Medium':
            modepoint = 15;
            break;
        case 'Hard':
            modepoint = 30;
            break;
      }
    }
var prob=0;
let cur = 0 ;
var character;
let letter = tam[cur];

suggest();

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

   
    
    const lenght = tam.length;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    

    function draw(e) {
        if (!isDrawing) return;

        console.log(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => isDrawing = false);
    canvas.addEventListener("mouseout", () => isDrawing = false);
});

function backspace(){
    word = word.slice(0, -1);
    const guess = document.getElementById("guess");
    guess.textContent = word;
}

function check(character){
    return true;
}

function submitImage() {
    const canvas = document.getElementById("canvas");
    var img = canvas.toDataURL();
    console.log("SUBMIT");
    predictImage(img);
    // suggest();
}

function predictImage(img) {
    fetch("/predict", {
        method: "POST",
        body: img
    }).then(resp => resp.text())
    .then(data => {
        const myguess = document.getElementById("myguess");
        myguess.textContent = "My guess:"
        
        console.log(data);
        var strings = data.split(" ");
        character = strings[0];
        
        prob = strings[1];
         
        const guess = document.getElementById("guess");
        

        if(check(character)){

            word += character ;
            guess.textContent = word;
            const confidence = document.getElementById("confidence");
            confidence.textContent = "(confidence: " + prob + "%)";
            chlet(word,80);
        }else{
            //code for error 5
        }
    });
}





function clearCanvas() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function chlet(c,p){
    console.log("vanten with "+c+" "+p+" "+letter)
    if(p>=(50+modepoint) && c==letter){
        cur++;
        letter = tam[cur];
        word = ""
        const guess = document.getElementById("guess");
        guess.textContent = "🤔";
    }
    console.log("vanten with "+c+" "+p+" "+letter)
    suggest()
}

function suggest() {
    const suggestion = document.getElementById("suggestion");
    

    fetch("/suggest").then(response => response.text())
    
    .then(data => suggestion.textContent =  letter );
}
