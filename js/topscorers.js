import { supabase } from "./supabase.js";

const playerSelect = document.getElementById("scorerName");
const goalInput = document.getElementById("goalCount");
const saveBtn = document.getElementById("saveScorerBtn");

// ተጫዋቾችን ጫን
async function loadPlayers() {
    const { data, error } = await supabase
        .from("registrations")
        .select("player_name")
        .order("player_name");

    if (error) {
        console.log(error);
        return;
    }

    playerSelect.innerHTML =
        `<option value="">-- Select Player --</option>`;

    data.forEach(player => {
        playerSelect.innerHTML += `
            <option value="${player.player_name}">
                ${player.player_name}
            </option>
        `;
    });
}

loadPlayers();

const adminList = document.getElementById("adminTopScorers");

async function loadTopScorersAdmin() {

    const { data, error } = await supabase
        .from("registrations")
        .select("id, player_name, goals")
        .gt("goals", 0)
        .order("goals", { ascending: false });

    if (error) {
        console.log(error);
        return;
    }

    adminList.innerHTML = "";

    data.forEach(player => {

        adminList.innerHTML += `
        <div class="scorer-card">

            <strong>${player.player_name}</strong>

            <span>⚽ ${player.goals}</span>

            <button onclick="editScorer(${player.id}, '${player.player_name}', ${player.goals})">
                ✏️ Edit
            </button>

            <button onclick="deleteScorer(${player.id})">
                🗑 Delete
            </button>

        </div>
        `;

    });

}

loadTopScorersAdmin();

// Goal Save
saveBtn.addEventListener("click", async () => {

    const player_name = playerSelect.value;
    const goals = Number(goalInput.value);

    if (!player_name) {
        alert("Please select a player.");
        return;
    }

    if (isNaN(goals) || goals < 0) {
        alert("Enter a valid goal.");
        return;
    }

    const { error } = await supabase
        .from("registrations")
        .update({ goals: goals })
        .eq("player_name", player_name);

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    alert("✅ Goals Updated Successfully");

    goalInput.value = "";
    playerSelect.value = "";
});
window.editScorer = async function(id, playerName, goals) {

    const newGoals = prompt(`Edit goals for ${playerName}`, goals);

    if (newGoals === null) return;

    const { error } = await supabase
        .from("registrations")
        .update({
            goals: Number(newGoals)
        })
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    alert("✅ Goal Updated");

    loadTopScorersAdmin();

};

window.deleteScorer = async function(id) {

    if (!confirm("Delete this scorer?")) return;

    const { error } = await supabase
        .from("registrations")
        .update({
            goals: 0
        })
        .eq("id", id);

    if (error) {
        alert(error.message);
        return;
    }

    alert("🗑 Scorer Removed");

    loadTopScorersAdmin();

};