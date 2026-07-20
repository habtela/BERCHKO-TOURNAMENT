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
    const { data: playerData, error: playerError } = await client
        .from("players")
        .select("*")
        .ilike("player_name", `%${name}%`)
        .limit(1);

    if (playerError) {
        result.innerHTML = "<p class='not-found'>Database Error</p>";
        return;
    }

    if (playerData.length === 0) {
        result.innerHTML = "<p class='not-found'>❌ Player Not Found</p>";
        return;
    }

    const player = playerData[0];

    // Get Group Members
    const { data: members, error: membersError } = await client
    .from("groups")
    .select("*")
    .eq("group_name", player.group_name);

console.log("Members:", members);
console.log("Members Error:", membersError);

    let membersHTML = "";

    members.forEach(member => {
        membersHTML += `<li>${member.player_name}</li>`;
    });

    result.innerHTML = `

    <div class="player-card">

        <h2>👤 ${player.player_name}</h2>

        <p><strong>🏆 Group:</strong> ${player.group_name}</p>

        <h3>👥 Group Members</h3>

        <ul>
            ${membersHTML}
        </ul>

        <div class="info">

            <p>📅 <strong>Date:</strong> ${player.match_date}</p>

            <p>⏰ <strong>Time:</strong> ${player.match_time}</p>

            <p>⚽ <strong>Opponent:</strong> ${player.opponent}</p>

            <p>📍 <strong>Stadium:</strong> ${player.stadium}</p>

        </div>

    </div>

    `;
}