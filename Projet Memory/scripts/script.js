// Fonction init exécutée une fois la page chargée
$(init);

function init() {
    let password;
    let usernameOK, emailOK, passwordOK, pwdCheckOK;
    let usernameInput, emailInput;

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
        // Tableau d'objets utilisateurs
        let users = JSON.parse(localStorage.getItem("users"));
        console.log(users);
        if (canSubmit(users)) {
            addUser(users);
        }
        else {
            console.log("form PAS OK");
        }
    }

    // Vérification de la disponibilité du nom et du mail 
    function canSubmit(users) {
        let usernameExists = false;
        let emailExists = false;

        users.forEach((userObject) => {
            if (userObject.username == usernameInput) {
                usernameExists = true;
                console.log("Username already exists");
            }
            if (userObject.email == emailInput) {
                emailExists = true;
                console.log("Email already exists");
            }
        });
        // True si tous les champs sont valides, le nom et le mail sont disponibles
        return (!usernameExists && !emailExists && usernameOK && emailOK && passwordOK && pwdCheckOK)
    }

    // Ajout de l'utilisateur dans le localStorage
    function addUser(users) {
        // Si le tableau users existe déjà, ajouter l'utilisateur
        if (users) {
            users.push({
                "username": usernameInput,
                "email": emailInput,
                "password": password
            });
            localStorage.setItem("users", JSON.stringify(users));
        }
        // Sinon, créer le tableau
        else {
            localStorage.setItem("users",
                JSON.stringify(
                    [{
                        "username": usernameInput,
                        "email": emailInput,
                        "password": password
                    }]
                )                    
            );
        }

    }

    /***********
     * Connexion
     ***********/
    // Clic sur le bouton Valider du formulaire de connexion
    $("btn-login").on("click", checkLogin);

    // Vérification des identifiants par rapport aux utilisateurs inscrits dans le localStorage
    function checkLogin() {
        let emailExists = false;
        let passwordChecks = false;

        users.forEach((userObject) => {
            // Login valide
            if (userObject.email === $("#email-login").value) {
                emailExists = true;
                console.log("Email exists");
            }
            // Login invalide
            else {
                console.log("Email does not exist");
            }
        });

    };









    function redirectJS() {
        document.location.href="login.html";
    }

    
}