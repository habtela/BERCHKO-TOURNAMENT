import { supabase } from "./supabase.js";

const matchContainer = document.getElementById("matchContainer");

loadMatches();

async function loadMatches() {

    const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("match_date", { ascending: true });

    if (error) {
        console.log(error);
        return;
    }

    matchContainer.innerHTML = "";

    data.forEach(match => {

        matchContainer.innerHTML += `

        <div class="match-card">

            <div class="badge">
                ⚽ Official Match
            </div>

            <div class="team">
                <span>${match.team_one}</span>

                <span style="color:#FFD700;">VS</span>

                <span>${match.team_two}</span>
            </div>

            <div class="match-info">

                <p>📅 <strong>Date:</strong> ${match.match_date}</p>

                <p>⏰ <strong>Time:</strong> ${match.match_time}</p>

                <p>🏟 <strong>Stadium:</strong> ${match.stadium}</p>

            </div>

        </div>

        `;

    });

}