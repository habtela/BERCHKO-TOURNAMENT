import { supabase } from "./supabase.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");


loginBtn.addEventListener("click", async () => {

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    });


    if(error){

        message.innerHTML = "❌ Login failed";
        console.log(error.message);

    }else{

        message.innerHTML = "✅ Login successful";

        window.location.href = "admin.html";

    }

});