let currentUser = null;
let currentSubject = null;

let doubts = JSON.parse(localStorage.getItem("doubts")) || [];
let users = JSON.parse(localStorage.getItem("users")) || {};

const aiReplies = {
  Maths: "AI: Use the correct formula and solve step by step.",
  Science: "AI: Explain the concept using laws or examples.",
  English: "AI: Identify grammar, meaning, or literary device.",
  Hindi: "AI: प्रश्न को ध्यान से पढ़ें और सरल उत्तर लिखें।",
  "Social Science":
    "AI: Write the answer in points. Include facts, causes and effects, important dates, and examples."
};

window.onload = () => {
  const saved = localStorage.getItem("currentUser");
  if (saved) {
    currentUser = saved;
    show("home");
    loadLeaderboard();
  } else {
    show("login");
  }
};

function save() {
  localStorage.setItem("doubts", JSON.stringify(doubts));
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", currentUser);
}

function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function login() {
  const name = document.getElementById("loginName").value.trim();
  if (!name) return alert("Enter name");
  currentUser = name;
  if (!users[name]) users[name] = 0;
  save();
  show("home");
  loadLeaderboard();
}

function openSubject(sub) {
  currentSubject = sub;
  document.getElementById("subjectTitle").innerText = sub;
  show("subject");
  loadDoubts();
}

function goHome() {
  show("home");
}

function previewImage(e) {
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("imgPreview").innerHTML =
      `<img src="${reader.result}" class="preview-img">`;
  };
  reader.readAsDataURL(e.target.files[0]);
}

function submitDoubt() {
  const text = doubtText.value.trim();
  if (!text) return alert("Write a doubt");

  const img = document.querySelector(".preview-img")?.src || "";

  doubts.push({
    subject: currentSubject,
    text,
    image: img,
    reply: "",
    best: false
  });

  save();
  doubtText.value = "";
  imgPreview.innerHTML = "";
  loadDoubts();
}

function loadDoubts() {
  doubtList.innerHTML = "";

  doubts.forEach((d, i) => {
    if (d.subject !== currentSubject) return;

    const div = document.createElement("div");
    div.className = "doubt-card" + (d.best ? " best" : "");

    div.innerHTML = `
      <p><b>Doubt:</b> ${d.text}</p>
      ${d.image ? `<img src="${d.image}" class="preview-img">` : ""}

      <select id="role-${i}">
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="ai">AI</option>
      </select>

      <textarea id="reply-${i}" placeholder="Reply"></textarea>
      <button onclick="reply(${i})">Reply</button>
      <p>${d.reply}</p>
    `;
    doubtList.appendChild(div);
  });
}

function reply(i) {
  const role = document.getElementById(`role-${i}`).value;

  if (role === "ai") {
    doubts[i].reply = aiReplies[doubts[i].subject];
  } else {
    const text = document.getElementById(`reply-${i}`).value.trim();
    if (!text) return alert("Write reply");

    if (role === "teacher") {
      doubts[i].best = true;
      users[currentUser] += 10;
      doubts[i].reply = `TEACHER (${currentUser}) ⭐: ${text}`;
    } else {
      users[currentUser] += 5;
      doubts[i].reply = `STUDENT (${currentUser}): ${text}`;
    }
  }

  save();
  loadLeaderboard();
  loadDoubts();
}

function loadLeaderboard() {
  leaderboard.innerHTML = "";
  Object.entries(users)
    .sort((a, b) => b[1] - a[1])
    .forEach(([n, p], i) => {
      leaderboard.innerHTML += `<p>${i + 1}. ${n} - ${p} pts</p>`;
    });
}







