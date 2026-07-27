import { supabase } from "./supabase.js";

// ==========================
// HTML ELEMENTS
// ==========================

const playerName = document.getElementById("playerName");
const savePlayer = document.getElementById("savePlayer");
const drawGroups = document.getElementById("drawGroups");
const playerList = document.getElementById("playerList");


// ==========================
// LOAD PLAYERS
// ==========================

async function loadPlayers() {

    const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.log(error);
        return;
    }

    playerList.innerHTML = "";

    data.forEach(player => {

        playerList.innerHTML += `

        <div class="player-item">

            <span>${player.player_name}</span>

            <button onclick="deletePlayer(${player.id})">
                🗑 Delete
            </button>

        </div>

        `;

    });

}

loadPlayers();


// ==========================
// ADD PLAYER
// ==========================

savePlayer.addEventListener("click", async () => {

    if (playerName.value.trim() === "") {

        alert("Enter Player Name");

        return;

    }

    const { error } = await supabase

        .from("registrations")

        .insert([

            {

                player_name: playerName.value

            }

        ]);

    if (error) {

        console.log(error);

        alert(error.message);

        return;

    }

    alert("✅ Player Added");

    playerName.value = "";

    loadPlayers();

});


// ==========================
// DELETE PLAYER
// ==========================

async function deletePlayer(id) {

    if (!confirm("Delete Player?")) return;

    const { error } = await supabase

        .from("registrations")

        .delete()

        .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    loadPlayers();

}

window.deletePlayer = deletePlayer;


// ==========================
// DRAW GROUPS
// ==========================

drawGroups.addEventListener("click", () => {

    alert("Group Draw will be added in Part 2 🔥");

});
// ==========================
// MATCH ELEMENTS
// ==========================

const teamOne = document.getElementById("teamOne");
const teamTwo = document.getElementById("teamTwo");
const matchDate = document.getElementById("matchDate");
const matchTime = document.getElementById("matchTime");
const stadium = document.getElementById("stadium");
const saveMatch = document.getElementById("saveMatch");
const matchList = document.getElementById("matchList");


// ==========================
// LOAD MATCHES
// ==========================

async function loadMatches() {

    const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.log(error);
        return;
    }

    matchList.innerHTML = "";

    data.forEach(match => {

        matchList.innerHTML += `

        <div class="match-item">

            <h3>${match.team_one} ⚔️ ${match.team_two}</h3>

            <p>📅 ${match.match_date}</p>

            <p>⏰ ${match.match_time}</p>

            <p>🏟 ${match.stadium}</p>

            <button onclick="deleteMatch(${match.id})">
                🗑 Delete
            </button>

        </div>

        `;

    });

}

loadMatches();


// ==========================
// SAVE MATCH
// ==========================

saveMatch.addEventListener("click", async () => {

    if (
        teamOne.value === "" ||
        teamTwo.value === "" ||
        matchDate.value === "" ||
        matchTime.value === "" ||
        stadium.value === ""
    ) {

        alert("Fill all match information");

        return;

    }

    const { error } = await supabase
        .from("matches")
        .insert([
            {
                team_one: teamOne.value,
                team_two: teamTwo.value,
                match_date: matchDate.value,
                match_time: matchTime.value,
                stadium: stadium.value,
                status: "Upcoming"
            }
        ]);

    if (error) {

        console.log(error);

        alert(error.message);

        return;

    }

    alert("✅ Match Added");

    teamOne.value = "";
    teamTwo.value = "";
    matchDate.value = "";
    matchTime.value = "";
    stadium.value = "";

    loadMatches();

});


// ==========================
// DELETE MATCH
// ==========================

async function deleteMatch(id) {

    if (!confirm("Delete Match?")) return;

    const { error } = await supabase
        .from("matches")
        .delete()
        .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    loadMatches();

}

window.deleteMatch = deleteMatch;
// ==========================
// RESULT ELEMENTS
// ==========================

const matchSelect = document.getElementById("matchSelect");
const teamOneScore = document.getElementById("teamOneScore");
const teamTwoScore = document.getElementById("teamTwoScore");
const matchStatus = document.getElementById("matchStatus");
const manOfMatch = document.getElementById("manOfMatch");
const saveResultBtn = document.getElementById("saveResultBtn");


// ==========================
// LOAD MATCH SELECT
// ==========================

async function loadMatchSelect() {

    const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("id", { ascending: true });

    if (error) {

        console.log(error);

        return;

    }

    matchSelect.innerHTML =
        `<option value="">Select Match</option>`;

    data.forEach(match => {

        matchSelect.innerHTML += `
            <option value="${match.id}">
                ${match.team_one} vs ${match.team_two}
            </option>
        `;

    });

}

loadMatchSelect();


// ==========================
// LOAD PLAYERS
// ==========================

async function loadManOfMatchPlayers() {

    const { data } = await supabase
        .from("registrations")
        .select("player_name")
        .order("player_name");

    manOfMatch.innerHTML =
        `<option value="">Select Player</option>`;

    data.forEach(player => {

        manOfMatch.innerHTML += `
            <option value="${player.player_name}">
                ${player.player_name}
            </option>
        `;

    });

}

loadManOfMatchPlayers();


// ==========================
// SAVE RESULT
// ==========================

saveResultBtn.addEventListener("click", async () => {

    if (matchSelect.value === "") {

        alert("Select Match");

        return;

    }

    const { error } = await supabase

        .from("matches")

        .update({

            team_one_score: Number(teamOneScore.value),

            team_two_score: Number(teamTwoScore.value),

            status: matchStatus.value,

            man_of_match: manOfMatch.value

        })

        .eq("id", matchSelect.value);

    if (error) {

        alert(error.message);

        return;

    }

    alert("✅ Match Result Saved");

});