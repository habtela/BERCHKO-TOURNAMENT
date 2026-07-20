const db = window.client;

loadGroups();

async function loadGroups() {

    const { data: players, error } = await db
        .from("players")
        .select("*")
        .order("player_name");

    if (error) {
        console.log(error);
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

        if (groups[player.group_name]) {
            groups[player.group_name].push(player.player_name);
        }

    });

    document.getElementById("groupA").innerHTML =
        groups["Group A"].map(player => `<li>${player}</li>`).join("");

    document.getElementById("groupB").innerHTML =
        groups["Group B"].map(player => `<li>${player}</li>`).join("");

    document.getElementById("groupC").innerHTML =
        groups["Group C"].map(player => `<li>${player}</li>`).join("");

    document.getElementById("groupD").innerHTML =
        groups["Group D"].map(player => `<li>${player}</li>`).join("");

    document.getElementById("groupE").innerHTML =
        groups["Group E"].map(player => `<li>${player}</li>`).join("");

    document.getElementById("groupF").innerHTML =
        groups["Group F"].map(player => `<li>${player}</li>`).join("");

}