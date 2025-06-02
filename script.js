const chatArea = document.getElementById("chat-area");
const inputArea = document.getElementById("input-area");

let userSelections = {
  fateLine: null,
  heartLine: null,
  lifeLine: null,
  mindLine: null,
  marriageLine: null,
  signs: []
};

function botReply(msg) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "bot-msg";
  msgDiv.innerText = msg;
  chatArea.appendChild(msgDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function userReply(msg) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "user-msg";
  msgDiv.innerText = msg;
  chatArea.appendChild(msgDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function showOptions(options, multiple = false) {
  const container = document.createElement("div");
  container.className = "options-container";

  options.forEach(opt => {
    const btn = document.createElement("div");
    btn.className = "option-btn";
    btn.innerHTML = `
      <img src="${opt.img}" alt="${opt.label}" />
      <span>${opt.label}</span>
    `;
    btn.addEventListener("click", () => {
      if (!multiple) {
        userReply(opt.label);
        container.remove();
        proceed(opt.label);
      } else {
        btn.classList.toggle("selected");
      }
    });
    container.appendChild(btn);
  });

  if (multiple) {
    const doneBtn = document.createElement("button");
    doneBtn.innerText = "Done";
    doneBtn.className = "done-btn";
    doneBtn.addEventListener("click", () => {
      const selected = Array.from(container.querySelectorAll(".selected span")).map(s => s.innerText);
      userReply(selected.join(", "));
      container.remove();
      proceed(selected);
    });
    container.appendChild(doneBtn);
  }

  chatArea.appendChild(container);
  chatArea.scrollTop = chatArea.scrollHeight;
}

let step = 0;

function startBot() {
  botReply("👋 Hello! I’m AstroBot — your palm reading assistant.");
  setTimeout(() => {
    botReply("Let’s read your palm based on some images. Please choose what matches your hand.");
    setTimeout(() => {
      askFateLine();
    }, 1200);
  }, 1200);
}

function askFateLine() {
  botReply("👉 Select your *Fate Line* type:");
  showOptions([
    { label: "Present", img: "images/fate_present.jpg" },
    { label: "Broken", img: "images/fate_broken.jpg" },
    { label: "Absent", img: "images/fate_absent.jpg" }
  ]);
  step = 1;
}

function askHeartLine() {
  botReply("💖 Select your *Heart Line*:");
  showOptions([
    { label: "Pointing Index Finger", img: "images/heart_index.jpg" },
    { label: "Pointing Middle Finger", img: "images/heart_middle.jpg" },
    { label: "Pointing Both", img: "images/heart_both.jpg" }
  ]);
  step = 2;
}

function askLifeLine() {
  botReply("💫 Select your *Life Line*:");
  showOptions([
    { label: "Long", img: "images/life_long.jpg" },
    { label: "Short", img: "images/life_short.jpg" },
    { label: "Broken", img: "images/life_broken.jpg" }
  ]);
  step = 3;
}

function askMindLine() {
  botReply("🧠 Select your *Mind Line*:");
  showOptions([
    { label: "Straight", img: "images/mind_straight.jpg" },
    { label: "Short", img: "images/mind_short.jpg" },
    { label: "Curved", img: "images/mind_curve.jpg" }
  ]);
  step = 4;
}

function askMarriageLine() {
  botReply("💒 Select your *Marriage Line* position:");
  showOptions([
    { label: "Bottom", img: "images/marriage_bottom.jpg" },
    { label: "Middle", img: "images/marriage_middle.jpg" },
    { label: "Top", img: "images/marriage_top.jpg" }
  ]);
  step = 5;
}

function askSigns() {
  botReply("✨ Do you see any of these signs?");
  showOptions([
    { label: "Cross between Heart & Mind Line", img: "images/sign_cross.jpg" },
    { label: "Parallel Line with Life Line", img: "images/sign_parallel.jpg" },
    { label: "Line from left to Fate Line", img: "images/sign_abroad.jpg" },
    { label: "Second Heart Line Curve", img: "images/sign_secondHeart.jpg" }
  ], true);
  step = 6;
}

function proceed(selection) {
  switch (step) {
    case 1:
      userSelections.fateLine = selection;
      askHeartLine();
      break;
    case 2:
      userSelections.heartLine = selection;
      askLifeLine();
      break;
    case 3:
      userSelections.lifeLine = selection;
      askMindLine();
      break;
    case 4:
      userSelections.mindLine = selection;
      askMarriageLine();
      break;
    case 5:
      userSelections.marriageLine = selection;
      askSigns();
      break;
    case 6:
      userSelections.signs = selection;
      showFinalPrediction();
      break;
  }
}

function showFinalPrediction() {
  const { fateLine, heartLine, lifeLine, mindLine, marriageLine, signs } = userSelections;
  const parts = [];

  // Fate Line
  if (fateLine === "Present") parts.push("you are naturally aligned for success in your endeavors");
  else if (fateLine === "Broken") parts.push("your journey may require adaptability and a change in strategy");
  else if (fateLine === "Absent") parts.push("your path depends purely on persistence and hard work");

  // Heart Line
  if (heartLine === "Pointing Index Finger") parts.push("you have a sensitive heart that may lead to emotional vulnerability");
  else if (heartLine === "Pointing Middle Finger") parts.push("you are an opportunist, doing whatever it takes to achieve your desires");
  else if (heartLine === "Pointing Both") parts.push("you are deeply intellectual and emotional, especially devoted to those you love");

  // Life Line
  if (lifeLine === "Long") parts.push("you have a strong constitution and a long life expectancy");
  else if (lifeLine === "Short") parts.push("you may face health concerns, so self-care is important");
  else if (lifeLine === "Broken") parts.push("your life’s path has experienced major shifts and transitions");

  // Mind Line
  if (mindLine === "Straight") parts.push("you are sharp and focused, ideal for academic or logical fields");
  else if (mindLine === "Short") parts.push("you live in the moment and prefer action over overthinking");
  else if (mindLine === "Curved") parts.push("your creativity and imagination are gifts that can lead to artistic success");

  // Marriage Line
  if (marriageLine === "Bottom") parts.push("you are likely to marry early in life");
  else if (marriageLine === "Middle") parts.push("your marriage will likely happen around the age of 28–30");
  else if (marriageLine === "Top") parts.push("marriage may be delayed, but will come at the right time");

  // Signs
  if (signs.includes("Cross between Heart & Mind Line")) parts.push("you are destined for financial success");
  if (signs.includes("Parallel Line with Life Line")) parts.push("you have divine protection in life’s challenges");
  if (signs.includes("Line from left to Fate Line")) parts.push("you have strong chances of settling abroad");
  if (signs.includes("Second Heart Line Curve")) parts.push("your emotions run deep and you are born to love passionately");

  const finalMessage = `🔮 Based on your palm reading, ${parts.join(", ")}. ✨ Trust in yourself and follow your destiny — the stars are with you!`;

  setTimeout(() => {
    botReply(finalMessage);
    setTimeout(() => {
      botReply("🤖 Thank you for using AstroBot. © 2025 AstroBot by Antick Bhattacharjee 🌟");
    }, 1500);
  }, 1000);
}

window.onload = startBot;
