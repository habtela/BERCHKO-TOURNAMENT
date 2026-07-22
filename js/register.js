import { supabase } from "./supabase.js";

const playerName = document.getElementById("playerName");
const phone = document.getElementById("phone");

const registerBtn = document.getElementById("registerBtn");
const drawBtn = document.getElementById("drawBtn");

const result = document.getElementById("result");

registerBtn.addEventListener("click", registerPlayer);
drawBtn.addEventListener("click", drawGroup);

// ===============================
// REGISTER PLAYER
// ===============================
async function registerPlayer() {

    const name = playerName.value.trim();
    const phoneNumber = phone.value.trim();

    if (name === "" || phoneNumber === "") {
        alert("Please fill all fields.");
        return;
    }

    // Duplicate check
    const { data: existing } = await supabase
        .from("registrations")
        .select("*")
        .eq("player_name", name);

    if (existing && existing.length > 0) {
        alert("This player is already registered.");
        return;
    }

    // Tournament Full?
    const { data: players } = await supabase
        .from("registrations")
        .select("id");

    if (players.length >= 42) {
        alert("Tournament registration is closed.");
        return;
    }

    // Save Player
    const { error } = await supabase
        .from("registrations")
        .insert([
            {
                player_name: name,
                phone: phoneNumber,
                has_drawn: false
            }
        ]);

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }
    localStorage.setItem("currentPlayer",name);

    result.innerHTML = `
<div class="success-card">

<h2>✅ Registration Successful</h2>

<p>
You can now draw your tournament group.
</p>

</div>
`;
    registerBtn.style.display = "none";
    drawBtn.style.display = "block";
    setTimeout(() => {

    drawBtn.scrollIntoView({
        behavior: "smooth"
    });

}, 500);
}

// ===============================
// DRAW GROUP
// ===============================
async function drawGroup() {

    const name = localStorage.getItem("currentPlayer");

if (!name) {
    alert("Please register first.");
    return;
}

let currentPlayer = null;

for (let i = 0; i < 5; i++) {

    const { data } = await supabase
        .from("registrations")
        .select("*")
        .eq("player_name", name)
        .limit(1);

    if (data && data.length > 0) {
        currentPlayer = data[0];
        break;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
}

if (!currentPlayer) {
    alert("Player not found.");
    return;
}


    if (currentPlayer.has_drawn) {
        alert("You have already drawn your group.");
        return;
    }

    const groups = [
        "Group A",
        "Group B",
        "Group C",
        "Group D",
        "Group E",
        "Group F"
    ];

    let availableGroups = [];

    for (const group of groups) {

        const { data } = await supabase
            .from("registrations")
            .select("id")
            .eq("group_name", group);

        if (data.length < 7) {
            availableGroups.push(group);
        }
    }

    if (availableGroups.length === 0) {
        alert("Tournament is Full.");
        return;
    }

    const randomGroup =
        availableGroups[
            Math.floor(Math.random() * availableGroups.length)
        ];

    const { error } = await supabase
        .from("registrations")
        .update({
            group_name: randomGroup,
            has_drawn: true
        })
        .eq("player_name", name);

    if (error) {
        alert(error.message);
        return;
    }

    result.innerHTML = `
        <h2>🏆 Congratulations!</h2>

        <p>Your Group is</p>

        <h1 style="color:#FFD700;">
            ${randomGroup}
        </h1>
    `;

    drawBtn.disabled = true;
    localStorage.removeItem("currentPlayer");
}