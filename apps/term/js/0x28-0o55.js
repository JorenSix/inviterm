

const flicker = () => {
    const terminal = document.getElementById('terminalcontainer');
    terminal.style.backgroundColor = 'rgba(10, 250, 10, 0.4)';
    setTimeout(() => {
      terminal.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    }, 400 + Math.random() * 1000);
    setTimeout(flicker, 9000 + Math.random() * 7000);
};

const rsvp_data = {
    name: '',
    attend: '',
    message: ''
};

const system_prompt = `You are a helpful AI assistant to answer questions about the birthday party of Joren Six to help guests. 
You can answer questions about the date, time, location, dresscode, food, drinks, music, and how and why to RSVP.
You steer the conversation towards information around the party.
Your answers are limited to one short paragraph and should be informative and engaging. 
Use the following information to answer questions about the birthday pary of Joren Six:
- Date: 14th of December 2024
- Time: from 18:30 onwards. True hackers arrive when they want and leave in the early hours.
- Location: Hackerspace Ghent, Wiedowkaai 51, 9000 Ghent. It is located on the fist floor in a factory building using the stairs in the back.
- Latitude and longitude: 51°04'29.5"N 3°43'26.9"E
- Dresscode: Hacker style attire is encouraged.
- Food: hacker fuel is provided: pizza.
- Drinks: Beer and soft drinks.
- Gifts: no need for gifts, just bring your hacker spirit.
- Music: electronic, click, glitch.
- Info about the location on the hackerspace ghent website: https://hackerspace.gent/
- Parking: there is enough carparking lot next to the building.
- RSVP: use the terminal application to send an rsvp to help organise the party. Even if you are not attending, please let me know.
`

const state = { shell: 1, rsvp: 2, llm: 3};

let currentState = state.shell;


const welcome_message = `Hello hacker!

You have been invited to Joren's 40th.
Type \x1b[1;33minfo\x1b[0m followed by enter in the terminal below.
Use \x1b[1;33mrsvp\x1b[0m to register.
Type \x1b[1;33mq\x1b[0m for further questions.

See you soon!

Joren - AKA 0110
$ `;

const fileSystem = {
    'welcome.txt': welcome_message,
    'llm_sys_prompt.txt': system_prompt,
    'rsvp_data.txt': JSON.stringify(rsvp_data),
    'all_commands.txt': JSON.stringify(['tux', 'date', 'info', 'cat', 'rsvp', 'ls', 'clear', 'q', 'help', 'cowsay']),
};

const sanitize = (str) => {
  let finalString = "";
  for(let i = 0; i < str.length; i++ ) {
    
    // skip control characters
    if(str.charCodeAt(i) < 32) continue;
    // skip DEL character
    if(str.charCodeAt(i) == 127) continue;

    //lowercase
    finalString += str.charAt(i).toLowerCase();
  }
  // remove leading and trailing spaces
  return finalString.trim();
};

var term = new Terminal({cursorBlink: true, convertEol: true,scrollback:0,theme: {foreground: '#3fff60',background: "rgba(0,0,0,0)"},fontSize: window.devicePixelRatio * 14,cols:40,rows:16} );

// Buffer to store user input
let input = '';

let commands = [
  {handler: () => helpCommand(), matcher: (line) => { return sanitize(line).startsWith('help') && currentState === state.shell; }},
  {handler: () => {term.writeln(new Date().toString());}, matcher: (line) => { return sanitize(line).startsWith('date') && currentState === state.shell; }},
  {handler: () => {tuxCommand()}, matcher: (line) => { return sanitize(line).startsWith('tux') && currentState === state.shell; }},
  {handler: () => cowSayCommand(), matcher: (line) => { return sanitize(line).startsWith('cowsay') && currentState === state.shell; }},
  {handler: () => {term.write('\n\r');term.clear();}, matcher: (line) => { return sanitize(line).startsWith('clear') }},
  {handler: () => lsCommand(), matcher: (line) => { return sanitize(line).startsWith('ls') }},
  {handler: (line) => catCommand(line), matcher: (line) => { return sanitize(line).startsWith('cat') }},
  {handler: () => infoCommand(), matcher: (line) => { return sanitize(line).startsWith('info') }},
  {handler: () => { currentState = state.rsvp }, matcher: (line) => { return sanitize(line).startsWith('rsvp') && currentState === state.shell; }},
  {handler: () => { currentState = state.llm }, matcher: (line) => { return sanitize(line) === 'q' && currentState === state.shell; }},
];

function rsvpCommand(){

  if(state.shell === currentState){
    return;
  }

  console.log(rsvp_data);

  if(rsvp_data.name.trim() === ''){
    term.writeln('');
    term.writeln('Please enter your name(s):');
    term.write('rsvp>> ');
  } else if(rsvp_data.attend.trim() === '') {
    term.writeln('');
    term.writeln('Can you attend (yes/no)?');
    term.write('rsvp>> ');
  }else if(rsvp_data.message.trim() === '') {
    term.writeln('');
    term.writeln('Send me an optional message: ');
    term.write('rsvp>> ');
  } else {
    term.writeln('');
    term.writeln('Send your rsvp (yes/no)?');
    term.write('rsvp>> ');
  }
}

function fillRsVpData(input){
  if(sanitize(input) === '' || sanitize(input).startsWith('rsvp')){
    input='';
    return;
  }

  if(rsvp_data.name.trim() === ''){
    rsvp_data.name = sanitize(input);
  } else if(rsvp_data.attend ===''){
    rsvp_data.attend = sanitize(input);
  } else if(rsvp_data.message.trim() === ''){
    rsvp_data.message = sanitize(input) + '_';
  } else if(sanitize(input) === 'yes' || sanitize(input) === 'ja' || sanitize(input) === 'nee' || sanitize(input) === 'no'){
    term.writeln('');
    if(sanitize(input).includes('yes') || sanitize(input) === 'ja'){
      term.writeln('Your RSVP has been registered.');
      rsvp_data.attend = (rsvp_data.attend.includes("yes") || rsvp_data.attend.includes("ja")) ? true : false; // rsvp_data.attend === 'yes' ?
      fetch('/rsvp/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rsvp_data)
      });
    } else {
      term.writeln('Your RSVP has been cancelled.');
      term.writeln('Please let me know if you are not attending also.');
    }

    rsvp_data.name ='';
    rsvp_data.attend = '';
    rsvp_data.message = '';
    
    currentState = state.shell;
  }
}

function infoCommand(){
  term.writeln('');
  term.writeln('Practical information:');
  term.writeln('- Dresscode: Hacker style');
  term.writeln('- Food: Pizza');
  term.writeln('- Drinks: Available');
  term.writeln('- Gifts: your presence and hacker spirit');
  term.writeln('- Music: electronic, click, glitch');
  term.writeln('- RSVP: type the \x1b[1;33mrsvp\x1b[0m command');
  term.writeln('- Date: 14th of December 2024');
  term.writeln('- Time: welcome from 18:30');
  term.writeln('- Location: Hackerspace Ghent, Wiedowkaai 51');
  term.writeln('- Further questions: type \x1b[1;33mq\x1b[0m and ask questions'); 
}

function helpCommand(){
  term.writeln('');
  term.writeln('Available commands:');
  term.writeln('- \x1b[1;33mtux\x1b[0m: Show tux');
  term.writeln('- \x1b[1;33mcowsay\x1b[0m: beuh.');
  term.writeln('- \x1b[1;33mdate\x1b[0m: Show the current date and time');
  term.writeln('- \x1b[1;33minfo\x1b[0m: Pracical information');
  term.writeln('- \x1b[1;33mcat\x1b[0m: Print file contents');
  term.writeln('- \x1b[1;33mrsvp\x1b[0m: Let me knoz you are coming.');
  term.writeln('- \x1b[1;33mls\x1b[0m: List directory contents');
  term.writeln('- \x1b[1;33mclear\x1b[0m: Clear the terminal');
  term.writeln('- \x1b[1;33mq\x1b[0m: ask further questions via llm');
}

function cowSayCommand(line){
  message =`
  ________________________
/      MOOOO !!          \\
\\          BUUUUU !      /
 -------------------------
  \\   ^__^
   \\  (oo)\\_______
      (__)\\      )\\/\\
          ||----w |
          ||     ||
`
  term.writeln(message);
} 

function tuxCommand(line){
  message = `
   _________________________
  / You are only young once, \\  
  | but you can stay         |   
  \\ immatureindefinitely.  /
    -----------------------
   \\
   \\
     .--.
    |o_o |
    |:_/ |
   //  \\ \\
   (|    | )
   /'\_   _/\\\`\\
   \\___)=(___/`
   term.writeln(message);
}

const handleLLMCommand = (prompt) =>{
    console.log(prompt);
    if (prompt.startsWith('exit')){
        term.write('\n\rq>> ');
        currentState = state.shell;
    } else if (prompt.startsWith('clear')){
        term.clear();
        term.write('\n\rq>> ');
    } else if (prompt.startsWith('help') || prompt.trim() === '' || prompt.trim() === 'q'){
        term.writeln('\n\rUsage: ask any question via a large language model');
        term.write('q>> ');
    } else {
      term.writeln('');
      postAndStream('/api/generate', { "role": "user", model: 'llama3.2:3b', prompt: prompt , system: system_prompt });
    }
    input = '';
}

  // Handle user key presses
term.onData(char => {
    let command_matched = false;
    if (char === '\r' ) { // Enter key
      commands.forEach(command => {
        if (command.matcher(input.trim())) {
          command.handler(input.trim());
          command_matched = true;
        }
      });

      if (currentState === state.rsvp){

        if(sanitize(input) === 'rsvp'){
          input = '';
          term.writeln('');
          term.write('Please answer the following questions.');
        } else {
          fillRsVpData(input.trim());
          input = '';
        }       
        rsvpCommand();
      }

      if (!command_matched && currentState === state.shell && input.trim() !== '') {
        term.write('\n\r');
        term.write(`Command not recognized: \x1b[1;33m${input.trim()}\x1b[0m`);
        input = '';
      }

      if(currentState === state.llm){
        handleLLMCommand(input);
      }
      
      if (currentState === state.shell){
        input = '';
        term.write('\n\r$ ');
      }

    } else if (char === '\x7F' && input.length > 0) { // Backspace key
      input = input.slice(0, -1);
      term.write('\b \b');
    } else if (char) {

        if(char!= '\n') input += char;
        term.write(char);
    }
    sound();
});

var rsvp = function() {
    term.writeln("rsvp");
};

function sound() {
    var sounds =  ["sounds/193945__soundslikewillem__d.wav" , "sounds/193946__soundslikewillem__c.wav" , "sounds/193947__soundslikewillem__b.wav" , "sounds/193948__soundslikewillem__a.wav" , "sounds/193949__soundslikewillem__h.wav" , "sounds/193950__soundslikewillem__g.wav" , "sounds/193951__soundslikewillem__f.wav" , "sounds/193952__soundslikewillem__e.wav" , "sounds/193953__soundslikewillem__j.wav" , "sounds/193954__soundslikewillem__i.wav" , "sounds/193955__soundslikewillem__w.wav" , "sounds/193956__soundslikewillem__x.wav" , "sounds/193957__soundslikewillem__u.wav" , "sounds/193958__soundslikewillem__v.wav" , "sounds/193959__soundslikewillem__y.wav" , "sounds/193960__soundslikewillem__z.wav" , "sounds/193961__soundslikewillem__n.wav" , "sounds/193962__soundslikewillem__m.wav" , "sounds/193963__soundslikewillem__l.wav" , "sounds/193964__soundslikewillem__k.wav" , "sounds/193965__soundslikewillem__r.wav" , "sounds/193966__soundslikewillem__q.wav" , "sounds/193967__soundslikewillem__p.wav" , "sounds/193968__soundslikewillem__o.wav" , "sounds/193969__soundslikewillem__t.wav" , "sounds/193970__soundslikewillem__s.wav"]
    var audio = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
    audio.play();
}

function showWelcomeMessage() {
    welcome_message.split('').forEach((char, i) => {
      let timeout = 20 * i + Math.random() * 10;
      setTimeout(() => {term.write(char)}, timeout );
    });
}

function showBackground() {
    VANTA.NET({
        el: "#background",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x4fff60,
        backgroundColor: 0x23202d
    });
}


// Command handling function
function lsCommand() {
  //case 'ls':
  term.write('\n\r');
  Object.keys(fileSystem).forEach(filename => term.writeln(filename));
  // case 'dir':
}

function catCommand(line) {
  term.write('\n\r');
  const args = line.split(' ').slice(1);
  if (args.length === 0) {
    term.writeln('Usage: cat <filename>');
  } else {
    const filename = args[0];
    if (fileSystem[filename]) {
      term.writeln(fileSystem[filename]);
    } else {
      term.writeln(`cat: ${filename}: No such file or directory`);
    }
  }
}

window.onload = () => {



    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.open(document.getElementById('terminal'));
    term.focus();

    fitAddon.fit();

    showWelcomeMessage();
    flicker();
    showBackground();
}

async function postAndStream(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            term.write('\nq>>> ');
            break;
        }
            

        buffer += decoder.decode(value, { stream: true });
        let lines = buffer.split('\n');
        buffer = lines.pop(); // Keep the last partial line in the buffer

        for (let line of lines) {
            if (line.trim()) {
                try {
                    const message = JSON.parse(line);
                    handleMessage(message); // Process each message
                } catch (e) {
                    console.error('Failed to parse JSON:', e);
                }
            }
        }
    }
}

function handleMessage(message) {
    term.write(message.response);
}
