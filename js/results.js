import { supabase } from "./supabase.js";

const latestResults = document.getElementById("latestResults");

async function loadResults() {
    const { data, error } = await supabase
        .from("results")
        .select("*")
        .order("match_date", { ascending: false });

    if (error) {
        console.log(error);
        latestResults.innerHTML =
            "<h2 style='color:red'>Failed to load results</h2>";
        return;
    }

    if (!data || data.length === 0) {
        latestResults.innerHTML =
            "<h2>No Match Results Yet</h2>";
        return;
    }

    latestResults.innerHTML = "";

    data.forEach(match => {

        latestResults.innerHTML += `
            <div class="result-card">
            <div class="result-status">
    🏁 FINISHED
</div>

                <h2>
                    ${match.team_one}
                    ${match.team_one_score}
                    -
                    ${match.team_two_score}
                    ${match.team_two}
                </h2>

                <p>
                    🏆 Man of the Match:
                    <strong>${match.man_of_match || "Not Selected"}</strong>
                </p>

                <p>
                    📅 ${match.match_date}
                </p>

                <p>
                    🏟 ${match.stadium}
                </p>

            </div>
        `;
    });

}

loadResults();