const chatArea = document.getElementById("chat-area");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const progressFill = document.getElementById("progress-fill");

let stage = 0;
let userData = {
  name: "",
  dob: "",
  birthTime: "",
  address: "",
  palm: {},
  signs: {},
  zodiac: {}
};

const palmQuestions = [
  {
    key: "fateLine",
    question: "What type of Fate Line do you have?",
    options: ["Present", "Broken", "Absent"],
    images: ["images/fate_present.jpg", "images/fate_broken.jpg", "images/fate_absent.jpg"]
  },
  {
    key: "heartLine",
    question: "Where does your Heart Line point?",
    options: ["Index Finger", "Middle Finger", "Both Fingers"],
    images: ["images/heart_index.jpg", "images/heart_middle.jpg", "images/heart_both.jpg"]
  },
  {
    key: "lifeLine",
    question: "What type of Life Line do you have?",
    options: ["Long", "Short", "Broken"],
    images: ["images/life_long.jpg", "images/life_short.jpg", "images/life_broken.jpg"]
  },
  {
    key: "mindLine",
    question: "What type of Mind Line do you have?",
    options: ["Straight", "Short", "Curved"],
    images: ["images/mind_straight.jpg", "images/mind_short.jpg", "images/mind_curve.jpg"]
  },
  {
    key: "marriageLine",
    question: "Where is your Marriage Line located?",
    options: ["Bottom", "Middle", "Top"],
    images: ["images/marriage_bottom.jpg", "images/marriage_middle.jpg", "images/marriage_top.jpg"]
  }
];

const signQuestions = [
  { key: "crossSign", question: "Do you have a cross between heart and mind lines?", image: "images/sign_cross.jpg" },
  { key: "parallelLifeLine", question: "Do you see a parallel line beside your Life Line?", image: "images/sign_parallel.jpg" },
  { key: "abroadMark", question: "Do you see a long mark from the left edge to your Fate Line?", image: "images/sign_abroad.jpg" },
  { key: "secondHeartLine", question: "Do you have a second Heart Line curved above the original?", image: "images/sign_secondHeart.jpg" }
];

const zodiacData = [
  { sign: "Aries", symbol: "♈", start: "03-21", end: "04-19", numbers: [1, 9, 17, 22], prediction: "In the coming weeks, your natural drive and leadership will open new doors — but impatience may test your patience in relationships. Pause before you push. A bold idea could take shape if you stay focused." },
  { sign: "Taurus", symbol: "♉", start: "04-20", end: "05-20", numbers: [2, 6, 9, 12], prediction: " A period of financial or emotional stability is approaching, but only if you're willing to release old stubborn ways. A long-term reward awaits if you choose growth over comfort." },
  { sign: "Gemini", symbol: "♊", start: "05-21", end: "06-20", numbers: [5, 7, 14, 23], prediction: "Conversations and social interactions will spark unexpected opportunities. Stay flexible — your dual nature will help you juggle choices. But beware of spreading yourself too thin." },
  { sign: "Cancer", symbol: "♋", start: "06-21", end: "07-22", numbers: [2, 7, 11, 16], prediction: "Emotions will run deep this month — don’t fight them. A family or home-related matter may need your nurturing touch. Guard your heart, but don’t isolate yourself from those who care." },
  { sign: "Leo", symbol: "♌", start: "07-23", end: "08-22", numbers: [1, 3, 10, 19], prediction: "Recognition and admiration are heading your way — but remember, true strength lies in humility. A creative project or personal spotlight moment may shape your future path dramatically." },
  { sign: "Virgo", symbol: "♍", start: "08-23", end: "09-22", numbers: [5, 14, 15, 23], prediction: "Your attention to detail will save the day in an upcoming task. However, don't let perfectionism paralyze progress. A small act of kindness or service will return to you tenfold." },
  { sign: "Libra", symbol: "♎", start: "09-23", end: "10-22", numbers: [6, 9, 15, 24], prediction: "A decision you've been avoiding must be faced. Harmony will return once you speak your truth. A relationship may evolve — or dissolve — based on how honest you are with your heart." },
  { sign: "Scorpio", symbol: "♏", start: "10-23", end: "11-21", numbers: [4, 8, 11, 18], prediction: "Secrets may come to light — both yours and others’. How you handle this moment will define a bond. Intuition will guide you toward a powerful transformation, possibly in love or career." },
  { sign: "Sagittarius", symbol: "♐", start: "11-22", end: "12-21", numbers: [3, 7, 9, 21], prediction: "You’ll soon be offered a journey — literal or mental — that expands your worldview. Be cautious with blunt honesty; not everyone is ready for your truth. Luck favors you if you embrace change without arrogance." },
  { sign: "Capricorn", symbol: "♑", start: "12-22", end: "01-19", numbers: [4, 8, 13, 22], prediction: "A career milestone or major responsibility is around the corner. Your discipline will lead to success, but don’t forget to nurture your personal life. A surprise emotional connection may surface." },
  { sign: "Aquarius", symbol: "♒", start: "01-20", end: "02-18", numbers: [4, 7, 11, 22], prediction: "A sudden innovation or creative idea will set you apart. Your individuality will attract both admiration and criticism — embrace both. A humanitarian cause may unexpectedly become your passion." },
  { sign: "Pisces", symbol: "♓", start: "02-19", end: "03-20", numbers: [3, 7, 12, 19], prediction: "Dreams and reality will blur — but inside your imagination lies the seed of something beautiful. Avoid escapism. A moment of spiritual clarity or emotional breakthrough is on the horizon." }
];

function getZodiacSign(dob) {
  const [day, month, year] = dob.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  for (let z of zodiacData) {
    const [sMonth, sDay] = z.start.split("-").map(Number);
    const [eMonth, eDay] = z.end.split("-").map(Number);
    const start = new Date(year, sMonth - 1, sDay);
    const end = new Date(year, eMonth - 1, eDay);

    if (start <= end) {
      if (date >= start && date <= end) return z;
    } else {
      // Capricorn range
      if (date >= start || date <= end) return z;
    }
  }
  return null;
}

function appendMessage(text, sender = "bot") {
  const msg = document.createElement("div");
  msg.classList.add(sender === "bot" ? "bot-msg" : "user-msg");
  msg.textContent = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function appendOptions(options, images = []) {
  const container = document.createElement("div");
  container.className = "options-container";
  options.forEach((option, index) => {
    const btn = document.createElement("div");
    btn.className = "option-btn";
    if (images[index]) {
      const img = document.createElement("img");
      img.src = images[index];
      btn.appendChild(img);
    }
    const label = document.createElement("span");
    label.textContent = option;
    btn.appendChild(label);
    btn.onclick = () => handleAnswer(option);
    container.appendChild(btn);
  });
  chatArea.appendChild(container);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function askInputField(label) {
  appendMessage(label);
  userInput.disabled = false;
  sendBtn.disabled = userInput.value.trim() === "";
  userInput.focus();
}

function handleAnswer(answer) {
  const current = stage - 4;
  if (stage >= 4 && stage < 9) {
    userData.palm[palmQuestions[current].key] = answer;
    stage++;
    nextStage();
  } else if (stage >= 9 && stage < 13) {
    userData.signs[signQuestions[stage - 9].key] = answer === "Yes";
    stage++;
    nextStage();
  }
}

function handleInputSubmit() {
  const val = userInput.value.trim();
  if (!val) return;
  appendMessage(val, "user");

  switch (stage) {
    case 0: userData.name = val; break;
    case 1: userData.dob = val; userData.zodiac = getZodiacSign(val); break;
    case 2: userData.birthTime = val; break;
    case 3: userData.address = val; break;
  }
  userInput.value = "";
  userInput.disabled = true;
  stage++;
  nextStage();
}

function nextStage() {
  progressFill.style.width = `${(stage / 13) * 100}%`;

  if (stage < 4) {
    const prompts = [
      "What is your name?",
      "Enter your date of birth (dd-mm-yyyy):",
      "Enter your birth time:",
      "Enter your address:"
    ];
    askInputField(prompts[stage]);
  } else if (stage < 9) {
    const i = stage - 4;
    appendMessage(palmQuestions[i].question);
    appendOptions(palmQuestions[i].options, palmQuestions[i].images);
  } else if (stage < 13) {
    const i = stage - 9;
    appendMessage(signQuestions[i].question);
    appendOptions(["Yes", "No"], [signQuestions[i].image, "images/sign_none.jpg"]);
  } else {
    showPrediction();
  }
}

function showPrediction() {
  appendMessage("Analyzing your data... ✨");
  setTimeout(() => {
    appendMessage(generatePrediction());
  }, 1200);
}

function generatePrediction() {
  const p = userData.palm;
  const s = userData.signs;
  const z = userData.zodiac;
  const results = [];

  if (z) {
    results.push(`\n🔮 Your Zodiac Sign is ${z.symbol} ${z.sign}\n`);
    results.push(`Your Lucky Numbers: ${z.numbers.join(", ")}\n`);
    results.push(`Cosmic Message: ${z.prediction}\n`);
  }

  if (p.fateLine === "Present") results.push("You will succeed in whatever you target.\n");
  else if (p.fateLine === "Broken") results.push("You should change your path and strategy for success.\n");
  else results.push("You must rely entirely on hard work.\n");

  if (p.heartLine === "Index Finger") results.push("You are sensitive and might get betrayed.\n");
  else if (p.heartLine === "Middle Finger") results.push("You are an opportunist and driven.\n");
  else results.push("You are intelligent and deeply emotional for your loved ones.\n");

  if (p.lifeLine === "Long") results.push("You have a healthy and long life span.\n");
  else if (p.lifeLine === "Short") results.push("You may face health issues — take care.\n");
  else results.push("Your life has taken a new path — stay focused now.\n");

  if (p.mindLine === "Straight") results.push("You have great memory and should pursue higher studies.\n");
  else if (p.mindLine === "Short") results.push("You forgive easily but must work harder.\n");
  else results.push("You are highly talented with artistic potential.\n");

  if (p.marriageLine === "Bottom") results.push("You may marry very early.\n");
  else if (p.marriageLine === "Middle") results.push("You’ll likely marry between 28-30.\n");
  else results.push("You may marry later in life.\n");

  if (s.crossSign) results.push("You have potential for high income.\n");
  if (s.parallelLifeLine) results.push("You are blessed with divine protection.\n");
  if (s.abroadMark) results.push("You have chances to settle abroad.\n");
  if (s.secondHeartLine) results.push("You are extremely emotional and born to love.\n");

  

  return `
Welcome, ${userData.name}!

Based on your palm lines and zodiac alignment, here is your personalized reading:

${results.map(r => `• ${r}`).join("\n")}

Thank you for trusting the stars and your palms.
Stay curious, stay cosmic.
`;

}

sendBtn.addEventListener("click", handleInputSubmit);
userInput.addEventListener("input", () => {
  sendBtn.disabled = userInput.value.trim() === "";
});

nextStage();
