const isAdminPage = window.location.pathname.includes("admin");
import { supabase } from "./supabase.js";

// =====================
// TOP SCORERS
// =====================
async function loadTopScorers() {

    const { data, error } = await supabase
        .from("registrations")
        .select("id, player_name, goals")
        .gt("goals", 0)
        .order("goals", { ascending: false })
        .limit(10);

    if (error) {
        console.log(error);
        return;
    }

    const list = document.getElementById("topScorersList");

    list.innerHTML = "";

    data.forEach((player, index) => {

       list.innerHTML += `
<div class="scorer-card">
    <span>${index + 1}.</span>
    <strong>${player.player_name}</strong>
    <span>⚽️ ${player.goals}</span>

    ${
        isAdminPage
            ? ` 
            <button onclick="editScorer(${player.id})">✏️ Edit</button>
            <button onclick="deleteScorer(${player.id})">🗑 Delete</button>
               `
            : ""
    }
</div>
`;

    });

}

// =====================
// MATCH RESULTS
// =====================

async function loadResults() {

    const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("status", "Finished")
        .order("match_date", { ascending: false })
        .limit(10);

    if (error) {
        console.log(error);
        return;
    }

    const results = document.getElementById("latestResults");

    results.innerHTML = "";

    data.forEach(match => {

        results.innerHTML += `
        <div class="result-card">

            <h3>${match.team_one} ${match.team_one_score} - ${match.team_two_score} ${match.team_two}</h3>

            <p>🏆 Man of the Match: ${match.man_of_match}</p>

        </div>
        `;

    });

}

loadTopScorers();
loadResults();
window.editScorer = async function(id){

    const goals = prompt("Enter New Goal Count");

    if(goals === null) return;

    const { error } = await supabase
        .from("registrations")
        .update({
            goals:Number(goals)
        })
        .eq("id", id);

    if(error){
        alert(error.message);
        return;
    }

    alert("✅ Goal Updated");

    loadTopScorers();

}

window.deleteScorer = async function(id){

    if(!confirm("Remove this player from Top Scorers?")) return;

    const { error } = await supabase
        .from("registrations")
        .update({
            goals:0
        })
        .eq("id", id);

    if(error){
        alert(error.message);
        return;
    }

    alert("✅ Player Removed");

    loadTopScorers();

}
// ======================
// LIVE STATISTICS
// ======================

async function loadStatistics(){

    // Registered Players
    const { count: playerCount } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true });

    document.getElementById("totalPlayers").textContent =
        playerCount ?? 0;


    // Matches
    const { count: matchCount } = await supabase
        .from("matches")
        .select("*", { count: "exact", head: true });

    document.getElementById("totalMatches").textContent =
        matchCount ?? 0;


    // Top Scorer
    const { data: scorer } = await supabase
        .from("registrations")
        .select("player_name,goals")
        .gt("goals",0)
        .order("goals",{ascending:false})
        .limit(1);

    if(scorer && scorer.length){

        document.getElementById("bestScorer").textContent =
            `${scorer[0].player_name} (${scorer[0].goals})`;

    }

}

loadStatistics();
// ======================
// LIVE MATCH
// ======================

async function loadLiveMatch(){

const { data } = await supabase

.from("matches")

.select("*")

.in("status",["Live","Upcoming"])

.order("match_date",{ascending:true})

.limit(1);

if(!data || !data.length) return;

const match=data[0];

document.getElementById("liveTeamOne").textContent=match.team_one;

document.getElementById("liveTeamTwo").textContent=match.team_two;

document.getElementById("liveScoreOne").textContent=match.team_one_score ?? 0;

document.getElementById("liveScoreTwo").textContent=match.team_two_score ?? 0;

document.getElementById("liveStatus").textContent=match.status;

}

loadLiveMatch();