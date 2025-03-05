// Fonction init exécutée une fois la page chargée
$(init);

function init() {
    let password;
    let usernameOK, emailOK, passwordOK, pwdCheckOK;
    let usernameInput, emailInput;
    
    let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    let themes = {
        "scrabble" : "alphabet-scrabble",
        "animals" : "animaux",
        "animals-animated" : "animauxAnimes","pets" : "animauxDomestiques",
        "dogs" : "chiens",
        "dinos" : "dinosaures",
        "dinos-named" : "dinosauresAvecNom",
        "vegetables" : "memory-legume"
    }

    /**** Vérification  à la volée des éléments du formulaire d'inscription ****/
    $("input").on("input", checkInput);
    function checkInput() {
        const MAIL_REGEX = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
        const PWD_REGEX = /^(?=.*[0-9])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^&!+=*.\-_]){6,}$/gm;

        switch (this.name) {
            // username plus de 3 caractères
            case "username":
                if (this.value.length >= 3) {
                    console.log("username OK");
                    usernameOK = true;
                    usernameInput = this.value;
                }
                else {
                    console.log("username PAS OK");
                    usernameOK = false;
                }
                break;
            // email vérifie le pattern
            case "email":
                if (this.value.match(MAIL_REGEX)) {
                    console.log("email OK");
                    emailOK = true;
                    emailInput = this.value;
                }
                else {
                    console.log("email PAS OK");
                    emailOK = false;
                }
                break;
            // password vérifie le pattern
            case "password":
                displaySafety(this.value);
                if (this.value.match(PWD_REGEX)) {
                    console.log("password OK");
                    password = this.value;
                    passwordOK = true;
                }
                else {
                    console.log("password PAS OK");
                    passwordOK = false;
                }
                break;
            // pwd-check identique à password
            case "pwd-check":
                if (this.value === password) {
                    console.log("pwd-check OK");
                    pwdCheckOK = true;
                }
                else {
                    console.log("pwd-check PAS OK");
                    pwdCheckOK = false;
                }
                break;
        }
    }
    
    // Affichage du niveau de sécurité du mot de passe
    function displaySafety(value) {
        // Mot de passe avec au moins 6 caractères + un chiffre + un symbole
        const MID_REGEX = /^(?=.*[0-9])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^&!+=*.\-_]){6,}$/gm;
        // Mot de passe avec au moins 9 caractères + un chiffre + un symbole
        const STRONG_REGEX = /^(?=.*[0-9])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^&!+=*.\-_]){9,}$/gm;

        // Si password non vide, afficher les couleurs
        if (value.length) {
            $("#faible").addClass("faible");
            if (value.match(MID_REGEX)) {
                $("#moyen").addClass("moyen");
            } else {
                $("#moyen").removeClass("moyen");
            }
            if (value.match(STRONG_REGEX)) {
                $("#fort").addClass("fort");
            } else {
                $("#fort").removeClass("fort");
            }
        }
        // Sinon, tout est grisé
        else {
            $("#faible").removeClass("faible");
        }
    }

    // Clic sur le bouton Valider du formulaire d'inscription
    $("#btn-signin").on("click", signIn);

    function signIn() {
        if (canSubmit()) {
            addUser();
            alert("Utilisateur créé, vous pouvez vous connecter");
            redirectLogin();
        }
        else {
            console.log("form PAS OK");
        }
    }

    // Vérification de la disponibilité du nom et du mail 
    function canSubmit() {
        let usernameExists = false;
        let emailExists = false;

        for (let i = 0; i < localStorage.length; i++) {
            const storedEmail = localStorage.key(i);
            const storedUsername = JSON.parse(localStorage.getItem(storedEmail)).username;

            if (emailInput === storedEmail) {
                emailExists = true;
                console.log("Email already exists");
                break;
            }
            if (usernameInput === storedUsername) {
                usernameExists = true;
                console.log("Username already exists");
                break;
            }
        }
        // True si tous les champs sont valides, le nom et le mail sont disponibles
        return (!usernameExists && !emailExists && usernameOK && emailOK && passwordOK && pwdCheckOK)
    }

    // Ajout de l'utilisateur dans le localStorage
    // key = email ; value = objet user
    function addUser() {
        let userObject = {
            "username": usernameInput,
            "email" : emailInput,
            "password": password,
            "theme": "",
            "size": "",
            "lastScores": []
        };
        localStorage.setItem(emailInput, JSON.stringify(userObject));
    }

    /***********
     * Connexion
     ***********/
    // Clic sur le bouton Valider du formulaire de connexion
    $("#btn-login").on("click", checkLogin);

    // Vérifie si le login existe ou pas dans le localStorage
    // Si oui, vérifie si le mot de passe entré correspond
    function checkLogin() {
        // Objet user s'il existe, null autrement
        let userObject = JSON.parse(localStorage.getItem($("#email-login").val()));
        console.log(userObject);
        // Login valide
        if (userObject) {
            console.log("Email exists : " + userObject.email);
            console.log("Password : " + userObject.password);
            // Mot de passe correspondant
            if($("#password-login").val() === userObject.password) {
                alert("Utilisateur connecté avec l'email : " + userObject.email);
                userObject.logged = true;
                localStorage.setItem($("#email-login").val(), JSON.stringify(userObject));

                localStorage.setItem("loggedUser", JSON.stringify(userObject));
                redirectProfile();
            }
            else {
                alert("Mot de passe erroné");
            }
        }
        // Login invalide
        else {
            console.log("Email does not exist : " + userObject);
            alert("Login inconnu");
        }
    };

    /***********
     * Profil
     ***********/
    if (window.location.pathname == "/Projet%20Memory/profile.html") {
        displayProfile();
        $("#save-settings").on("click", saveSettings);
    }

    // Enregistrer les préférences de l'utilisateur 
    function saveSettings() {
        //TODO : enregistrer les données de loggedUser vers le user avec l'adresse e-mail correspondante
        localStorage.setItem(loggedUser.email, JSON.stringify(loggedUser));
    }

    // Récupérer la taille choisie par l'utilisateur connecté
    function getSize() {
        loggedUser.size = this.value;
        localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    }

    // Afficher le profil utilisateur selon les informations stockées
    function displayProfile() {
        // console.log(loggedUser);

        $("#email-display").attr("value",
            loggedUser.email);

        $("#username-display").attr("value",
            loggedUser.username);

        displayPreview();
        $("#memory-theme").on("change", displayPreview);
        $("#memory-size").on("change", getSize);
    }
    
    // Afficher une image des cartes selon la valeur du select et enregistrer dans le localStorage
    function displayPreview() {
        let url = "";
        loggedUser.theme = $("#memory-theme").val();

        switch(loggedUser.theme) {
            case "scrabble":
                url = "/ressource/alphabet-scrabble/memory_detail_scrabble.png";
                break;
            case "animals":
                url = "/ressource/animaux/memory_detail_animaux.png";
                break;
            case "animals-animated":
                url="/ressource/animauxAnimes/memory_detail_animaux_animes.png";
                break;
            case "pets":
                url = "/ressource/animauxdomestiques/memory_detail_animaux_domestiques.png";
                break;
            case "dogs":
                url = "/ressource/chiens/memory_details_chiens.png";
                break;
            case "dinos":
                url = "/ressource/dinosaures/memory_detail_dinosaures.png";
                break;
            case "dinos-named":
                url = "/ressource/dinosauresAvecNom/memory_details_dinosaures_avec_nom.png";
                break;
            case "vegetables":
                url = "/ressource/memory-legume/memory_detail.png";
                break;
            default:
                url = "/ressource/animaux/memory_detail_animaux.png";
                break;
        }

        $("#preview").attr("src", url);

        // $("#memory-theme option").attr("selected", false);
        // $(`[value="${loggedUser.theme}"]`).attr("selected", true);

        localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    }

    /*********
     * Scores
    **********/

    /*********
     * Memory
    **********/
    let memorySize = ["2", "4"];
    let memoryTheme = "animals";
    generateMemory();

    // Génération du jeu, en fonction du thème choisi et de la taille
    function generateMemory() {
        console.log("Start generateMemory");
        if(loggedUser) {
            memorySize = loggedUser.size.split("by");
            memoryTheme = loggedUser.theme;
            console.log(memorySize);
            console.log(memoryTheme);
        }
        let url = `/ressource/${themes[memoryTheme]}`;
        console.log(url);

        let cardNumber = 0;
        for (let i = 0; i < memorySize[0]; i++) {        
            $("#memory-board").append("<div></div>");
            for (let j = 0; j < memorySize[1]; j++) {
                $("#memory-board div").append(
                    `<div id=card-${cardNumber}>
                    <img src="/ressource/memory-legume/1.svg">
                    </div>`);
                cardNumber++;
            }
        }

        console.log("End generateMemory");
    }




    



    
    function redirectHome() {
        document.location.href="index.html";
    }
    function redirectGame() {
        document.location.href="memory.html";
    }
    function redirectProfile() {
        document.location.href="profile.html";
    }
    function redirectLogin() {
        document.location.href="login.html";
    }
}