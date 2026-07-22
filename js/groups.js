import { supabase } from "./supabase.js";

loadGroups();

async function loadGroups() {

    const { data: players, error } = await supabase
        .from("registrations")
        .select("*")
        .order("player_name", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    const groups = {
        "Group A": [],
        "Group B": [],
        "Group C": [],
        "Group D": [],
        "Group E": [],
        "Group F": []
    };

    players.forEach(player => {
        if (player.group_name && groups[player.group_name]) {
            groups[player.group_name].push(player.player_name);
        }
    });

    // Player Counters
    document.getElementById("countA").innerHTML =
        groups["Group A"].length >= 7 ? "🟢 FULL (7/7)" : `👥 ${groups["Group A"].length} / 7 Players`;

    document.getElementById("countB").innerHTML =
        groups["Group B"].length >= 7 ? "🟢 FULL (7/7)" : `👥 ${groups["Group B"].length} / 7 Players`;

    document.getElementById("countC").innerHTML =
        groups["Group C"].length >= 7 ? "🟢 FULL (7/7)" : `👥 ${groups["Group C"].length} / 7 Players`;

    document.getElementById("countD").innerHTML =
        groups["Group D"].length >= 7 ? "🟢 FULL (7/7)" : `👥 ${groups["Group D"].length} / 7 Players`;

    document.getElementById("countE").innerHTML =
        groups["Group E"].length >= 7 ? "🟢 FULL (7/7)" : `👥 ${groups["Group E"].length} / 7 Players`;

    document.getElementById("countF").innerHTML =
        groups["Group F"].length >= 7 ? "🟢 FULL (7/7)" : `👥 ${groups["Group F"].length} / 7 Players`;

    // Show Players
    document.getElementById("groupA").innerHTML =
        groups["Group A"].map(player => `<li>👤 ${player}</li>`).join("");

    document.getElementById("groupB").innerHTML =
        groups["Group B"].map(player => `<li>👤 ${player}</li>`).join("");

    document.getElementById("groupC").innerHTML =
        groups["Group C"].map(player => `<li>👤 ${player}</li>`).join("");

    document.getElementById("groupD").innerHTML =
        groups["Group D"].map(player => `<li>👤 ${player}</li>`).join("");

    document.getElementById("groupE").innerHTML =
        groups["Group E"].map(player => `<li>👤 ${player}</li>`).join("");

    document.getElementById("groupF").innerHTML =
        groups["Group F"].map(player => `<li>👤 ${player}</li>`).join("");
}