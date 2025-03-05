// Fonction init exécutée une fois la page chargée
$(init);

function init() {
    let password;
    let usernameOK, emailOK, passwordOK, pwdCheckOK;
    let usernameInput, emailInput;
    
    let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

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
            "scores": []
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
        // Enregistrer les données de loggedUser vers le user avec l'adresse e-mail correspondante
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
    /* Tableau d'objets themes
    key = valeur dans localStorage
    key.dir = répertoire contenant les images
    key.size = nb d'images dans le répertoire
    key.extension = extension des fichiers pour insertion
    */
    let themes = {
        "scrabble": {
            "dir": "alphabet-scrabble",
            "size": 26,
            "extension": ".png"
        },
        "animals": {
            "dir": "animaux",
            "size": 28,
            "extension": ".webp"
        },
        "animals-animated": {
            "dir": "animauxAnimes",
            "size": 8,
            "extension": ".webp"
        },
        "pets": {
            "dir": "animauxDomestiques",
            "size": 10,
            "extension": ".jpg"
        },
        "dogs": {
            "dir": "chiens",
            "size": 23,
            "extension": ".webp"
        },
        "dinos": {
            "dir": "dinosaures",
            "size": 10,
            "extension": ".jpg"
        },
        "dinos-named": {
            "dir": "dinosauresAvecNom",
            "size": 10,
            "extension": ".jpg"
        },
        "vegetables": {
            "dir": "memory-legume",
            "size": 6,
            "extension": ".svg"
        }
    };

    let memorySize = ["2", "4"];
    let memoryTheme = "animals";
    let imgCount = parseInt(memorySize[0]) * parseInt(memorySize[1]);
    let maxImg = themes[memoryTheme].size;
    let board = [];
    let url = `/ressource/${themes[memoryTheme].dir}`;
    let firstCard, secondCard;
    let movesCounter = 0;
    let pairsFound = 0;

    generateMemory();

    // Clic sur une carte
    $(".card").on("click", main);

    // Recommencer la partie quand appui sur espace
    $(window).on("keypress", function(event) {
        if(event.code === "Space") {
            event.preventDefault();
            if(confirm("Recommencer la partie ?")) {
                resetVariables();
                generateMemory();
                $(".card").on("click", main);
            }
        }
    })

    function resetVariables() {
        memorySize = ["2", "4"];
        memoryTheme = "animals";
        imgCount = parseInt(memorySize[0]) * parseInt(memorySize[1]);
        maxImg = themes[memoryTheme].size;
        board = [];
        url = `/ressource/${themes[memoryTheme].dir}`;
        firstCard, secondCard;
        movesCounter = 0;
        pairsFound = 0;
        $("#moves-counter").text(movesCounter);
    }

    function main() {
        // Voir pourquoi l'alerte s'affiche avant la dernière carte
        showCard(this);
        movesCounter++;
        $(this).off("click");

        if(movesCounter % 2 == 0) {
            secondCard = this;
            console.log("Deuxième clic : " + secondCard);
            $("#moves-counter").text(movesCounter/2);
            checkPair();
        }
        else {
            firstCard = this;
            console.log("Premier clic : " + firstCard);
        }
        if (pairsFound === imgCount/2) {
            victory();
        }
    }

    function victory() {
        alert("Bravo ! Vous avez gagné en " + movesCounter/2 + " coups");
        if (loggedUser) {
            saveScore();
        }
    }

    function saveScore() {
        let today  = new Date().toLocaleDateString("fr-FR");
        console.log(today);

        let score = {
            "username": loggedUser.username,
            "date": today,
            "score": movesCounter/2,
            "size": loggedUser.size,
            "theme": loggedUser.theme
        };
    }

    function showCard(card) {
        console.log("Enter showCard");
        // Affichage de la bonne image
        card.src = `${url}/${board[$(card).attr("id").split("-")[1]]}${themes[memoryTheme].extension}`;
        console.log("Leave showCard");
    }

    function hideCard(card) {
        // Retour au point d'interrogation
        card.src ="/ressource/question.svg";

        // Réécouter l'événement click
        $(card).on("click", main);
    }

    function checkPair() {
        console.log("Enter checkPair");

        console.log(firstCard.src === secondCard.src);

        if(firstCard.src === secondCard.src) {
            console.log("Paire trouvée !");
            pairsFound++;
        }
        else {
            setTimeout(hideCard, 1000, firstCard);
            setTimeout(hideCard, 1000, secondCard);
        }
        console.log("Leave checkPair");
    }

    // Génération du jeu, en fonction du thème choisi et de la taille
    function generateMemory() {
        console.log("Start generateMemory");
        if(loggedUser) {
            memorySize = loggedUser.size.split("by");
            memoryTheme = loggedUser.theme;
            imgCount = parseInt(memorySize[0]) * parseInt(memorySize[1]);
            maxImg = themes[memoryTheme].size;
            url = `/ressource/${themes[memoryTheme].dir}`;
            // console.log(memorySize);
            // console.log(imgCount);
            // console.log(memoryTheme);
            // console.log(maxImg);
        }

        // Génère un tableau d'entiers avec chacun deux occurrences
        generateBoard();

        // Mélange in-place du tableau board
        shuffleArray(board);

        // Affichage du plateau de jeu caché
        // Paires dans board
        displayBoard();
        
        console.log("End generateMemory");
    }

    // Affichage des cartes selon les valeurs trouvées dans board
    // div englobant class = row
    // img class=card id=card-(0 à imgCount-1)
    function displayBoard() {
        $("#memory-board").children().remove();
        let cardNumber = 0;
        for (let i = 0; i < memorySize[0]; i++) {
            $("#memory-board").append("<div class=row></div>");
            for (let j = 0; j < memorySize[1]; j++) {
                // $(".row:last-child").append(
                //     `<img class=card
                //     id=card-${cardNumber}
                //     style='display:none'
                //     src="${url}/${board[cardNumber]}${themes[memoryTheme].extension}">`);
                $(".row:last-child").append(
                    `<img class=card
                    id=card-${cardNumber}
                    src="/ressource/question.svg">`);
                cardNumber++;
            }
        }
    }

    // Boucle sur la taille du memory/2
    // push() si l'élément n'est pas déjà présent
    function generateBoard() {
        for (let i = 0; i < imgCount/2; i++) {
            const randNumber = Math.floor(Math.random() * maxImg + 1);
            if(board.find((el) => el == randNumber)) {
                i--;
                continue;
            }
            else {
                board.push(randNumber, randNumber);
            }
        }
        console.log(board);
    }

    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    function shuffleArray(array) {
        for (let i = array.length - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
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