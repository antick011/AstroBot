window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById("popup").classList.remove("hidden");
    loadQuestion();
  }, 1500);
});

const questions = [
  { q: "May I know your name?", type: "text", key: "name" },
  { q: "What is your date of birth?", type: "date", key: "dob" },
  { q: "What is your birth time?", type: "time", key: "birthTime" },
  { q: "May I know your birth place?", type: "text", key: " " },
  {
    q: "What type of Fate Line do you have?",
    type: "image",
    key: "fate",
    options: ["present", "broken", "absent"]
  },
  {
    q: "Where does your Heart Line point?",
    type: "image",
    key: "heart",
    options: ["index", "middle", "both"]
  },
  {
    q: "What type of Life Line do you have?",
    type: "image",
    key: "life",
    options: ["long", "short", "broken"]
  },
  {
    q: "What type of Mind Line do you have?",
    type: "image",
    key: "mind",
    options: ["straight", "curve", "short"]
  },
  {
    q: "Where is your Marriage Line located?",
    type: "image",
    key: "marriage",
    options: ["top", "middle", "bottom"]
  },
  {
    q: "Do you have a cross between Heart and Mind lines?",
    type: "yesno",
    key: "sign_cross"
  },
  {
    q: "Do you see a parallel line beside your Life Line?",
    type: "yesno",
    key: "sign_parallel"
  },
  {
    q: "Do you see a long mark from the left edge to your Fate Line?",
    type: "yesno",
    key: "sign_abroad"
  },
  {
    q: "Do you have a second Heart Line curved above the original?",
    type: "yesno",
    key: "sign_secondHeart"
  }
];

let current = 0;
let answers = {};

function loadQuestion() {
  const q = questions[current];
  const qText = document.getElementById("questionText");
  const textInput = document.getElementById("textInput");
  const dateInput = document.getElementById("dateInput");
  const timeInput = document.getElementById("timeInput");
  const imageOptions = document.getElementById("imageOptions");
  const yesNoOptions = document.getElementById("yesNoOptions");

  qText.innerText = q.q;
  textInput.classList.add("hidden");
  dateInput.classList.add("hidden");
  timeInput.classList.add("hidden");
  imageOptions.classList.add("hidden");
  yesNoOptions.classList.add("hidden");
  imageOptions.innerHTML = "";

  if (q.type === "text") {
    textInput.classList.remove("hidden");
    textInput.value = "";
  } else if (q.type === "date") {
    dateInput.classList.remove("hidden");
    dateInput.value = "";
  } else if (q.type === "time") {
    timeInput.classList.remove("hidden");
    timeInput.value = "";
  } else if (q.type === "image") {
    imageOptions.classList.remove("hidden");
    q.options.forEach((opt) => {
      const container = document.createElement("div");
      container.classList.add("image-option-container");

      const img = document.createElement("img");
      img.src = `images/${q.key}_${opt}.webp`;
      img.alt = opt;
      img.classList.add("option-image");

      const label = document.createElement("div");
      label.innerText = opt.charAt(0).toUpperCase() + opt.slice(1);
      label.classList.add("image-option-label");

      img.addEventListener("click", () => {
        [...imageOptions.querySelectorAll(".option-image")].forEach(i => i.classList.remove("selected"));
        img.classList.add("selected");
        answers[q.key] = opt;
      });

      container.appendChild(img);
      container.appendChild(label);
      imageOptions.appendChild(container);
    });

  } else if (q.type === "yesno") {
    yesNoOptions.classList.remove("hidden");

    const img = document.createElement("img");
    img.src = `images/${q.key}.webp`;
    img.alt = q.q;
    img.classList.add("option-image");
    imageOptions.innerHTML = "";
    imageOptions.appendChild(img);
    imageOptions.classList.remove("hidden");

    document.getElementById("yesBtn").onclick = () => selectYesNo("yes");
    document.getElementById("noBtn").onclick = () => selectYesNo("no");
  }
}

document.getElementById("nextBtn").addEventListener("click", () => {
  const q = questions[current];

  if (q.type === "text") {
    const val = document.getElementById("textInput").value.trim();
    if (val) answers[q.key] = val;
    else return alert("Please enter your name.");
  } else if (q.type === "date") {
    const val = document.getElementById("dateInput").value;
    if (val) answers[q.key] = val;
    else return alert("Please select a valid date.");
  } else if (q.type === "time") {
    const val = document.getElementById("timeInput").value;
    if (val) answers[q.key] = val;
    else return alert("Please select a time.");
  } else if (q.type === "image") {
    if (!answers[q.key]) return alert("Please select an option.");
  } else if (q.type === "yesno") {
    if (!answers[q.key]) return alert("Please choose Yes or No.");
  }

  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    showFinalPrediction();
  }
});

function selectYesNo(choice) {
  const q = questions[current];
  answers[q.key] = choice;
}

function calculateMoolank(dob) {
  const day = parseInt(dob.split("-")[2]);
  let sum = day;
  while (sum > 9) {
    sum = sum.toString().split("").reduce((a, b) => a + parseInt(b), 0);
  }
  return sum;
}

function getMulyankPrediction(m) {
  const table = {
    1: "☀️ Sun: Leader, ambitious, confident. Great in leadership, politics, or entrepreneurship. Beware ego and embrace teamwork.",
    2: "🌙 Moon: Sensitive, artistic, and intuitive. Best in creative, healing, or counselling roles. Mood balance brings success after 35.",
    3: "♃ Jupiter: Wise, disciplined, spiritual. Gains in teaching, law, religion. Fortune and respect after 30.",
    4: "☊ Rahu: Hardworking, unconventional. Sudden rise after struggle in tech or politics. Control stress and rebellion.",
    5: "☿ Mercury: Witty, adaptable, smart. Fast success in media, business, writing. Focus needed to avoid scattered energy.",
    6: "♀ Venus: Romantic, luxurious, charming. Growth in beauty, fashion, or partnerships. Avoid overindulgence.",
    7: "☋ Ketu: Mysterious, spiritual, lone thinker. Research, occult, or IT fields suit you. Self-discovery is key.",
    8: "♄ Saturn: Serious, loyal, persistent. Late bloomer. Big stability and power after 36–40 in law or administration.",
    9: "♂ Mars: Energetic, fiery, bold. Sports, defense, leadership are your strengths. Learn patience for long-term gain."
  };
  return table[m] || "No Moolank prediction found.";
}

function getZodiacSign(dob) {
  const [year, month, day] = dob.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const signs = [
    ["Capricorn", new Date(year, 0, 1), new Date(year, 0, 19)],
    ["Aquarius", new Date(year, 0, 20), new Date(year, 1, 18)],
    ["Pisces", new Date(year, 1, 19), new Date(year, 2, 20)],
    ["Aries", new Date(year, 2, 21), new Date(year, 3, 19)],
    ["Taurus", new Date(year, 3, 20), new Date(year, 4, 20)],
    ["Gemini", new Date(year, 4, 21), new Date(year, 5, 20)],
    ["Cancer", new Date(year, 5, 21), new Date(year, 6, 22)],
    ["Leo", new Date(year, 6, 23), new Date(year, 7, 22)],
    ["Virgo", new Date(year, 7, 23), new Date(year, 8, 22)],
    ["Libra", new Date(year, 8, 23), new Date(year, 9, 22)],
    ["Scorpio", new Date(year, 9, 23), new Date(year, 10, 21)],
    ["Sagittarius", new Date(year, 10, 22), new Date(year, 11, 21)],
    ["Capricorn", new Date(year, 11, 22), new Date(year, 11, 31)],
  ];
  return signs.find(([_, start, end]) => date >= start && date <= end)?.[0] || "Unknown";
}

function getZodiacPrediction(sign) {
  const messages = {
    Aries: "Big opportunities will open soon. Bold steps will turn dreams into reality. Control impatience in relationships. Use these number -> 1, 9, 17, 22",
    Taurus: "Financial or emotional peace is near. Let go of old habits to embrace a lasting reward. Use these numbers -> 2, 6, 9, 12",
    Gemini: "A new social connection will unlock a major life turn. Be ready for a tough decision between two paths. Use these numbers -> 5, 7, 14, 23",
    Cancer: "Home and family matters will require attention. A surprising event will bring healing and clarity. Use these numbers -> 2, 7, 11, 16",
    Leo: "Public recognition is coming. A creative project may define your next chapter. Use these numbers -> 1, 3, 10, 19",
    Virgo: "A small act of service will return in abundance. Your skill will solve an important problem soon. Use these numbers -> 5, 14, 15, 23",
    Libra: "A relationship shift will happen. Balance will return only after honest confrontation. Use these numbers -> 6, 9, 15, 24",
    Scorpio: "A deep secret will be revealed soon. Transformation in your love or career is guaranteed. Use these numbers -> 4, 8, 11, 18",
    Sagittarius: "An unexpected journey will reshape your destiny. Stay humble during success. Use these numbers -> 3, 7, 9, 21",
    Capricorn: "Your dedication will be rewarded with a leadership opportunity. An emotional connection may emerge. Use these numbers -> 4, 8, 13, 22",
    Aquarius: "Your innovation will spark change. Your vision may inspire a community project. Use these numbers -> 4, 7, 11, 22",
    Pisces: "A spiritual or creative breakthrough is near. Let intuition guide you through confusing times. Use these numbers -> 3, 7, 12, 19"
  };
  return messages[sign] || "Your stars are aligning for something truly unique.";
}

function getPalmPredictions(answers) {
  const lines = {
    fate: {
      present: "You’re destined for success in your pursuit. The result will be fruitful soon.",
      broken: "A shift is required. A redirection will bring you closer to success.",
      absent: "Hard work will be your only tool. Stay strong — it will pay off eventually."
    },
    heart: {
      index: "An emotional storm may shake your trust. Remain alert in relationships.",
      middle: "A bold decision for personal gain will present itself. Choose wisely.",
      both: "You’ll soon make a selfless choice that alters your love life deeply."
    },
    life: {
      long: "Health and vitality will stay with you. Your path will be strong and long.",
      short: "An upcoming challenge may test your strength. Prioritize wellness.",
      broken: "A new path awaits you. The past is gone — your future is calling."
    },
    mind: {
      straight: "Your memory will help you excel in academics or career. Study and achieve.",
      curve: "An artistic opportunity will arrive. Express yourself and you’ll stand out.",
      short: "Hard work will be required soon — don't rely on shortcuts."
    },
    marriage: {
      bottom: "An early commitment or romantic proposal may appear sooner than expected.",
      middle: "Marriage or serious partnership will develop around your late 20s.",
      top: "Marriage may be delayed — focus on building your future first."
    }
  };

  const signs = {
    sign_cross: "A surprise income source will emerge. Prepare to receive unexpected wealth.",
    sign_parallel: "A divine force will guide you. Obstacles will melt before you.",
    sign_abroad: "You may get an opportunity to settle or work abroad very soon.",
    sign_2heart: "A deep love story will unfold. You are bound to experience a rare romance."
  };

  let output = "";
  for (let key in lines) {
    const val = answers[key];
    if (val) output += `🌟 ${lines[key][val]}\n`;
  }
  for (let key in signs) {
    if (answers[key] === "yes") output += `✨ ${signs[key]}\n`;
  }

  return output.trim();
}

function showFinalPrediction() {
  document.getElementById("popup").innerHTML = `
    <h2>⏳ Generating your future prediction...</h2>
    <p style="margin-top: 10px;">Please wait a moment while we analyze your stars and lines...</p>
  `;

  setTimeout(() => {
    const zodiac = getZodiacSign(answers.dob);
    const zodiacPrediction = getZodiacPrediction(zodiac);
    const palmPrediction = getPalmPredictions(answers);
    const moolank = calculateMoolank(answers.dob);
    const moolankPrediction = getMulyankPrediction(moolank);

    document.getElementById("popup").innerHTML = `
      <h2>🔮 Your Generated Future Prediction, ${answers.name}...</h2>
      <div class="result-box">
        <h3>✨ Zodiac Sign: ${zodiac}</h3>
        <p class="zodiac-msg">${zodiacPrediction}</p>
        <h3>🔢 Moolank (Birth Number): ${moolank}</h3>
        <p class="zodiac-msg">${moolankPrediction}</p>
        <h3>🖐 Palm-Based Predictions:</h3>
        <pre class="palm-msg">${palmPrediction}</pre>
      </div>
    `;
  }, 2000);
}
