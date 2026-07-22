import {supabase} from "./supabase.js"; const db =supabase;
// ===============================
// BERCHKO TOURNAMENT 2026
// ADMIN DASHBOARD
// PART 1
// ===============================

// Supabase Client

// ===============================
// ELEMENTS
// ===============================
const matchList = document.getElementById("matchList");
const updateMatchBtn = document.getElementById("updateMatch");

let editMatchId = null;

const playerInput = document.getElementById("playerName");

const savePlayerBtn = document.getElementById("savePlayer");

const drawGroupsBtn = document.getElementById("drawGroups");

const playerList = document.getElementById("playerList");

const saveMatchBtn = document.getElementById("saveMatch");

saveMatchBtn.addEventListener("click", saveMatch);

const teamOne = document.getElementById("teamOne");

const teamTwo = document.getElementById("teamTwo");

const matchDate = document.getElementById("matchDate");

const matchTime = document.getElementById("matchTime");

const stadium = document.getElementById("stadium");

// ===============================
// START APP
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadPlayers();

});
setInterval(() => {
    loadPlayers();
}, 5000);

// ===============================
// BUTTON EVENTS
// ===============================

savePlayerBtn.addEventListener("click", savePlayer);

drawGroupsBtn.addEventListener("click", drawGroups);

saveMatchBtn.addEventListener("click", saveMatch);

// ===============================
// SAVE PLAYER
// ===============================

async function savePlayer() {

    const name = playerInput.value.trim();

    if (name === "") {
        alert("Please enter player name.");
        return;
    }

    // Check if player already exists
    const { data: existingPlayer, error: checkError } = await db
        .from("registrations")
        .select("*")
        .ilike("player_name", name);

    if (checkError) {
        console.log(checkError);
        alert("Database Error");
        return;
    }

    if (existingPlayer.length > 0) {
        alert("Player already exists.");
        return;
    }

    // Save player
    const { error } = await db
        .from("players")
        .insert([
            {
                player_name: name
            }
        ]);

    if (error) {
        console.log(error);
        alert("Failed to save player.");
        return;
    }

    alert("✅ Player Added Successfully");

    playerInput.value = "";

    loadPlayers();

}

// ===============================
// LOAD PLAYERS
// ===============================

async function loadPlayers() {

    const { data, error } = await db
        .from("registrations")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.log(error);
        return;
    }

    playerList.innerHTML = "";

    if (!data || data.length === 0) {
    playerList.innerHTML = `
        <div class="empty-state">
            <h3>No Registered Players</h3>
            <p>Players will appear here after registration.</p>
        </div>
    `;
    return;
}

    data.forEach((player, index) => {

       playerList.innerHTML +=`
<div class="player-item">
    <span>
    ${index + 1}. ${player.player_name}
    <br>
    <small style="color:#FFD700;">
🏆 ${player.group_name || "Not Drawn Yet"}
</small>

<br>

<small style="color:#8BC34A;">
📅 ${player.match_date || "No Match"}
</small>
</span>
    <div>
        <button onclick="editPlayer(${player.id}, '${player.player_name}')">
            ✏ Edit
        </button>

        <button onclick="deletePlayer(${player.id})">
            🗑 Delete
        </button>
    </div>
</div>
`;

    });

}
// ===============================
// DRAW GROUPS
// ===============================

async function drawGroups() {

    const { data: players, error } = await db
        .from("registrations")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.log(error);
        alert("Failed to load players.");
        return;
    }

    if (players.length === 0) {
        alert("No players found.");
        return;
    }

    // Shuffle players
    players.sort(() => Math.random() - 0.5);

    const groups = ["Group A", "Group B", "Group C", "Group D", "Group E", "Group F"];

    for (let i = 0; i < players.length; i++) {

        const group = groups[i % groups.length];

        const { error } = await db
            .from("players")
            .update({
                group_name: group
            })
            .eq("id", players[i].id);

        if (error) {
            console.log(error);
        }

    }

    alert("🏆 Groups Created Successfully!");

    loadPlayers();

}
async function deletePlayer(id) {

    if (!confirm("Delete this player?")) return;

    const { error } = await db
        .from("registrations")
        .delete()
        .eq("id", id);

    if (error) {
        console.log(error);
        alert("Delete failed!");
        return;
    }

    alert("Player Deleted Successfully");

    loadPlayers();
}
window.editPlayer = editPlayer;
window.deletePlayer = deletePlayer;
// ===============================
// DELETE MATCH
// ===============================

async function deleteMatch(id){


    if(!confirm("Delete this match?")){
        return;
    }



    const { error } = await db
        .from("matches")
        .delete()
        .eq("id", id);



    if(error){

        console.log(error);

        alert("❌ Delete failed");

        return;

    }



    alert("🗑 Match deleted successfully");



    loadMatches();


}

// ===============================
// SAVE MATCH
// ===============================

async function saveMatch() {

    if (
        teamOne.value === "" ||
        teamTwo.value === "" ||
        matchDate.value === "" ||
        matchTime.value === "" ||
        stadium.value === ""
    ) {
        alert("Please fill all match information.");
        return;
    }

    const { error } = await db
        .from("matches")
        .insert([
            {
                team_one: teamOne.value,
                team_two: teamTwo.value,
                match_date: matchDate.value,
                match_time: matchTime.value,
                stadium: stadium.value
            }
        ]);

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    // Update Team One players

await db
.from("registrations")
.update({
    match_date: matchDate.value,
    match_time: matchTime.value,
    opponent: teamTwo.value,
    stadium: stadium.value
})
.eq("group_name", teamOne.value);


// Update Team Two players

await db
.from("registrations")
.update({
    match_date: matchDate.value,
    match_time: matchTime.value,
    opponent: teamOne.value,
    stadium: stadium.value
})
.eq("group_name", teamTwo.value);

    alert("✅ Match Added Successfully");

    teamOne.value = "";
    teamTwo.value = "";
    matchDate.value = "";
    matchTime.value = "";
    stadium.value = "";

    loadMatches();

}
// ===============================
// LOAD MATCHES
// ===============================

loadMatches();


async function loadMatches(){

    const { data, error } = await db
        .from("matches")
        .select("*")
        .order("id", { ascending: true });


    if(error){
        console.log(error);
        return;
    }


    matchList.innerHTML = "";


    data.forEach(match => {

        matchList.innerHTML += ` 

        <div class="match-item">

            <h3>
            ${match.team_one}
            ⚔️
            ${match.team_two}
            </h3>

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
async function editPlayer(id, currentName) {

    const newName = prompt("Edit Player Name", currentName);

    if (!newName) return;

    const { error } = await db
        .from("registrations")
        .update({
            player_name: newName
        })
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    alert("✅ Player Updated");

    loadPlayers();
}