let btnVisibility, pwdInput, validateBtn;

function init() {
    validateBtn = document.getElementById("valider");
    validateBtn.setAttribute("disabled", "true")

    btnVisibility = document.getElementById("btn-visibilite-password");
    pwdInput = document.getElementById("mdp");
    btnVisibility.addEventListener("click", togglePassword);

    pwdInput.addEventListener("input", checkConstraints);
}

function togglePassword() {
    let oeil = document.getElementById("oeil");

    if (pwdInput.type === "password") {
        oeil.src = "images/eye-open.png";
        pwdInput.type = "text";
    }
    else {
        oeil.src = "images/eye-close.png";
        pwdInput.type = "password";
    }
}

function checkConstraints() {
    const password = document.getElementById("mdp").value;

    let isMin = checkMin(password);
    let isMaj = checkMaj(password);
    let isLen = checkLength(password);
    let isNumber = checkNumber(password);

    if (isMin && isMaj && isLen && isNumber) {
        validateBtn.disabled = false;
    } else {
        validateBtn.disabled = true;
    }
}

function checkMin(password) {
    let isOk = password.match(/[a-z]/);
    if (isOk) {
        colorText("minuscule", "green");
        return true;
    }
    else {
        colorText("minuscule", "red");
        return false;
    }
}

function checkMaj(password) {
    let isOk = password.match(/[A-Z]/);
    if (isOk) {
        colorText("majuscule", "green");
        return true;
    }
    else {
        colorText("majuscule", "red");
        return false;
    }
}

function checkNumber(password) {
    let isOk = password.match(/[0-9]/);
    if (isOk) {
        colorText("chiffre", "green");
        return true;
    }
    else {
        colorText("chiffre", "red");
        return false;
    }
}

function checkLength(password) {
    if (password.length >= 8) {
        colorText("nbCaracteres", "green");
        return true;
    }
    else  {
        colorText("nbCaracteres", "red");
        return false;
    }
}

function colorText(id, color) {
    document.getElementById(id).style.color = color;
}

// Exécution quand la page est chargée
window.onload = init;