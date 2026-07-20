// ===============================
// BERCHKO ADMIN SECURITY
// ===============================


const ADMIN_EMAIL = "habetela@gmail.com";



async function checkAdmin(){


    const { data } = await supabase.auth.getSession();



    const user = data.session?.user;



    if(!user){

        alert("Please login first");

        window.location.href = "login.html";

        return;

    }



    if(user.email !== ADMIN_EMAIL){


        alert("Access Denied!");

        window.location.href = "index.html";


        return;

    }



    console.log("Admin Access Granted");

}



checkAdmin();