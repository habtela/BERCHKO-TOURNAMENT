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