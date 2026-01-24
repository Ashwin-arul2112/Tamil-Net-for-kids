let tam = [
    'அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ', 'க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன', 
    'க்', 'ங்', 'ச்', 'ஞ்', 'ட்', 'ண்', 'த்', 'ந்', 'ப்', 'ம்', 'ய்', 'ர்', 'ல்', 'வ்', 'ழ்', 'ள்', 'ற்', 'ன்', 
    'ஃ', 'கி', 'ஙி', 'சி', 'ஞி', 'டி', 'ணி', 'தி', 'நி', 'பி', 'மி', 'யி', 'ரி', 'லி', 'வி', 'ழி', 'ளி', 'றி', 'னி', 
    'ஸி', 'ஷி', 'ஜி', 'ஹி', 'க்ஷி', 'கீ', 'ஙீ', 'சீ', 'ஞீ', 'டீ', 'ணீ', 'தீ', 'நீ', 'பீ', 'மீ', 'யீ', 'ரீ', 'லீ', 'வீ', 
    'ழீ', 'ளீ', 'றீ', 'னீ', 'ஸீ', 'ஷீ', 'ஜீ', 'ஹீ', 'ஏ', 'ஐ', 'க்ஷ', 'கு', 'ஙு', 'சு', 'ஞு', 'டு', 'ணு', 'து', 'நு', 'பு', 'மு', 'யு', 
    'ரு', 'லு', 'வு', 'ழு', 'ளு', 'று', 'னு', 'கூ', 'ஸ்ரீ', 'ஸு', 'ஷு', 'ஜு', 'ஹு', 'க்ஷு', 'ஸூ', 'ஷூ', 'ஜூ', 'ஹூ', 'க்ஷூ'
]

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
        guess.textContent = character;

        const confidence = document.getElementById("confidence");
        confidence.textContent = "(confidence: " + prob + "%)";
        chlet(character,prob);
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
    }
    console.log("vanten with "+c+" "+p+" "+letter)
    suggest()
}

function suggest() {
    const suggestion = document.getElementById("suggestion");
    

    fetch("/suggest").then(response => response.text())
    
    .then(data => suggestion.textContent = "Draw a Tamil character. Not sure what to draw? Try " + letter + ".");
}
