function selectProfile(type){

    alert(type + " Profile Selected");

    // Redirect example

    if(type === "Individual"){

        window.location.href = "individual-dashboard.html";

    }

    if(type === "Business"){

        window.location.href = "business-dashboard.html";

    }

}

function goBack(){

    window.history.back();

}