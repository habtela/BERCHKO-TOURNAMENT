import { supabase } from "./supabase.js";

const standingsBody = document.getElementById("standingsBody");

async function loadStandings() {

    const { data, error } = await supabase
        .from("standings")
        .select("*")
        .order("points", { ascending: false })
        .order("gd", { ascending: false })
        .order("gf", { ascending: false });

    if (error) {
        console.log(error);
        return;
    }

    standingsBody.innerHTML = "";

    data.forEach((team, index) => {

        standingsBody.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${team.team}</td>
            <td>${team.played}</td>
            <td>${team.win}</td>
            <td>${team.draw}</td>
            <td>${team.loss}</td>
            <td>${team.gf}</td>
            <td>${team.ga}</td>
            <td>${team.gd}</td>
            <td><strong>${team.points}</strong></td>
        </tr>
        `;

    });

}

loadStandings();