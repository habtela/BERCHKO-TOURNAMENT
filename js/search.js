import { supabase } from "./supabase.js";
const searchBtn = document.getElementById("searchBtn");
const playerInput = document.getElementById("playerName");
const result = document.getElementById("result");

searchBtn.addEventListener("click", searchPlayer);

playerInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchPlayer();
    }
});

async function searchPlayer() {

    const name = playerInput.value.trim();

    if (name === "") {
        result.innerHTML = "<p class='not-found'>Please enter your name.</p>";
        return;
    }

    // Search player
    const { data: playerData, error: playerError } = await supabase
        .from("registrations")
        .select("*")
        .ilike("player_name", `%${name}%`)
        .limit(1);

    if (playerError) {
        console.log(playerError);
        result.innerHTML = "<p class='not-found'>Database Error</p>";
        return;
    }
if (!playerData || playerData.length === 0) {

    const { data: suggestions } = await supabase
        .from("registrations")
        .select("player_name")
        .ilike("player_name", `%${name.substring(0,3)}%`)
        .limit(5);

    if (suggestions && suggestions.length > 0) {

        let list = "";

        suggestions.forEach(player => {
            list += `<li>${player.player_name}</li>`;
        });

        result.innerHTML = ` 
            <div class="player-card">
                <h2>❌ Player Not Found</h2>
                <p>Did you mean one of these?</p>
                <ul>${list}</ul>
            </div>
        `;

    } else {

        result.innerHTML = `
            <div class="player-card">
                <h2>❌ Player Not Found</h2>
                <p>No similar player was found.</p>
            </div>
        `;
    }

    return;
}
   
    const player = playerData[0];

    const { data: match } = await supabase
    .from("matches")
    .select("*")
    .or(
        `team_one.eq.${player.group_name},team_two.eq.${player.group_name}`
    )
    .single();

    // Group Members
    const { data: members } = await supabase
        .from("registrations")
        .select("player_name")
        .eq("group_name", player.group_name);

    let membersHTML = "";

    if (members) {
        members.forEach(member => {
            membersHTML += `<li>${member.player_name}</li>`;
        });
    }

    result.innerHTML = `
    <div class="player-card">

        <h2>👤 ${player.player_name}</h2>

        <p><strong>🏆 Group:</strong> ${player.group_name || "Not Drawn Yet"}</p>

        <h3>👥 Group Members</h3>

        <ul>
            ${membersHTML}
        </ul>

        <div class="info">

            <p>📅 <strong>Date:</strong> ${match?.match_date || "Not Scheduled"}</p>

            <p>⏰ <strong>Time:</strong> ${match?.match_time || "Not Scheduled"}</p>

            <p>⚽ <strong>Opponent:</strong> ${match ? (match.team_one === player.group_name ? match.team_two: match.team_one) : "Not Assigned"}</p>

            <p>🏟 <strong>Stadium:</strong> ${match?.stadium || "Not Assigned"}<p/>

        </div>

    </div>
    `;
}
const inputs = document.querySelectorAll("input, textarea");

inputs.forEach(input => {
    input.addEventListener("focus", () => {
        setTimeout(() => {
            input.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 300);
    });
});
document.querySelectorAll("input").forEach(input=>{

input.addEventListener("focus",()=>{

setTimeout(()=>{

input.scrollIntoView({

behavior:"smooth",

block:"center"

});

},300);

});

});