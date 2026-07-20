// ===============================
// BERCHKO MATCH CENTER
// LOAD MATCHES
// ===============================


// Supabase Client
const db = window.client;


// Load matches when page opens
loadMatches();



async function loadMatches(){


    const { data: matches, error } = await db
        .from("matches")
        .select("*")
        .order("match_date", { ascending: true });



    if(error){

        console.log(error);

        return;

    }



    const container = document.getElementById("matchContainer");


    container.innerHTML = "";



    if(matches.length === 0){

        container.innerHTML = `

        <h2 style="text-align:center;color:white;">
        No Matches Available ⚽
        </h2>

        `;

        return;

    }



    matches.forEach(match => {



        container.innerHTML += ` 


        <div class="match-card">


            <div class="teams">


                <div class="team">
                    ${match.team_one}
                </div>



                <div class="vs">
                    VS
                </div>



                <div class="team">
                    ${match.team_two}
                </div>


            </div>





            <div class="match-info">


                <p>
                📅 
                <span>Date:</span>
                ${match.match_date}
                </p>



                <p>
                ⏰
                <span>Time:</span>
                ${match.match_time}
                </p>



                <p>
                🏟
                <span>Stadium:</span>
                ${match.stadium}
                </p>



            </div>


        </div>


        `;



    });



}