// DATABASE UTENTI PREIMPOSTATI
const agentiDatabase = [
    {
        username: "Eric.Guidi",
        password: "Polizia1234",
        nome: "Eric",
        cognome: "Guidi",
        matricola: "PDS-0001",
        grado: "Dirigente Generale di Pubblica Sicurezza",
        mansione: "Funzionario",
        discordId: "1292573195408507014",
        specializzazione: "Squadra Volante"
    },
    {
        username: "Marco.Rossi",
        password: "polizia2026",
        nome: "Marco",
        cognome: "Rossi",
        matricola: "PDS-042",
        grado: "Ispettore Capo",
        mansione: "Coordinatore Turni",
        discordId: "987654321012345678",
        specializzazione: "Nucleo Operativo"
    },
    {
        username: "Giuseppe.Verdi",
        password: "pds12345",
        nome: "Giuseppe",
        cognome: "Verdi",
        matricola: "PDS-001",
        grado: "Commissario",
        mansione: "Comandante Reparto",
        discordId: "555666777888999000",
        specializzazione: "Direzione"
    }
];

let utenteCorrente = null;

document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.getElementById('loginForm');
    const btnLogout = document.getElementById('btnLogout');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Modale Cambia Password
    const btnOpenChangePassword = document.getElementById('btnOpenChangePassword');
    const modalChangePassword = document.getElementById('modalChangePassword');
    const btnClosePwdModal = document.getElementById('btnClosePwdModal');
    const formChangePassword = document.getElementById('formChangePassword');

    // Modale Logout
    const modalLogout = document.getElementById('modalLogout');
    const btnCancelLogout = document.getElementById('btnCancelLogout');
    const btnConfirmLogout = document.getElementById('btnConfirmLogout');

    // Tasto Aggiorna Profilo
    const btnUpdateProfile = document.getElementById('btnUpdateProfile');

    // MOSTRA / NASCONDI PASSWORD CON L'OCCHIO
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // GESTIONE ACCESSO FORM LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userInput = document.getElementById('username').value.trim();
            const passInput = document.getElementById('password').value.trim();
            const errorBox = document.getElementById('login-error');

            const agenteTrovato = agentiDatabase.find(agente => 
                agente.username.toLowerCase() === userInput.toLowerCase() && 
                agente.password === passInput
            );

            if (agenteTrovato) {
                if (errorBox) errorBox.style.display = 'none';
                utenteCorrente = agenteTrovato;
                caricaDashboard(agenteTrovato);
            } else {
                if (errorBox) errorBox.style.display = 'block';
            }
        });
    }

    // MODALE ESCI (LOGOUT)
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            modalLogout.style.display = 'flex';
        });
    }

    if (btnCancelLogout) {
        btnCancelLogout.addEventListener('click', function() {
            modalLogout.style.display = 'none';
        });
    }

    if (btnConfirmLogout) {
        btnConfirmLogout.addEventListener('click', function() {
            modalLogout.style.display = 'none';
            document.getElementById('dashboard-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'flex';
            utenteCorrente = null;
            if (loginForm) loginForm.reset();
        });
    }

    // MODALE CAMBIA PASSWORD
    if (btnOpenChangePassword) {
        btnOpenChangePassword.addEventListener('click', function() {
            document.getElementById('pwd-error').style.display = 'none';
            document.getElementById('pwd-success').style.display = 'none';
            formChangePassword.reset();
            modalChangePassword.style.display = 'flex';
        });
    }

    if (btnClosePwdModal) {
        btnClosePwdModal.addEventListener('click', function() {
            modalChangePassword.style.display = 'none';
        });
    }

    if (formChangePassword) {
        formChangePassword.addEventListener('submit', function(e) {
            e.preventDefault();
            const oldPwd = document.getElementById('oldPassword').value;
            const newPwd = document.getElementById('newPassword').value;
            const confirmPwd = document.getElementById('confirmNewPassword').value;

            const errorBox = document.getElementById('pwd-error');
            const successBox = document.getElementById('pwd-success');

            errorBox.style.display = 'none';
            successBox.style.display = 'none';

            if (oldPwd !== utenteCorrente.password) {
                errorBox.innerText = 'La password attuale inserita non è corretta.';
                errorBox.style.display = 'block';
                return;
            }

            if (newPwd !== confirmPwd) {
                errorBox.innerText = 'Le nuove password non corrispondono.';
                errorBox.style.display = 'block';
                return;
            }

            // Aggiorna la password nell'oggetto utente corrente e nel DB
            utenteCorrente.password = newPwd;
            successBox.innerText = 'Password aggiornata con successo!';
            successBox.style.display = 'block';

            setTimeout(() => {
                modalChangePassword.style.display = 'none';
            }, 1200);
        });
    }

    // BOTTONE AGGIORNA PROFILO / GRADO
    if (btnUpdateProfile) {
        btnUpdateProfile.addEventListener('click', function() {
            const icon = document.getElementById('iconUpdateProfile');
            if (icon) icon.classList.add('fa-spin');
            
            setTimeout(() => {
                if (icon) icon.classList.remove('fa-spin');
                if (utenteCorrente) {
                    caricaDashboard(utenteCorrente);
                }
            }, 600);
        });
    }

});

// POPOLA I DATI DELLA DASHBOARD CON L'UTENTE AUTENTICATO
function caricaDashboard(agente) {
    document.getElementById('dash-fullname').innerText = `${agente.nome} ${agente.cognome}`;
    document.getElementById('dash-card-name').innerText = `${agente.nome} ${agente.cognome}`;
    document.getElementById('dash-card-grado-sub').innerText = agente.grado;
    document.getElementById('dash-matricola').innerText = agente.matricola;

    document.getElementById('dash-username').value = agente.username;
    document.getElementById('dash-nome').value = agente.nome;
    document.getElementById('dash-cognome').value = agente.cognome;
    document.getElementById('dash-discord').value = agente.discordId;
    document.getElementById('dash-grado').value = agente.grado;
    document.getElementById('dash-mansione').value = agente.mansione;
    document.getElementById('dash-spec').innerHTML = `<i class="fa-solid fa-shield"></i> ${agente.specializzazione}`;

    document.getElementById('dash-status-grado').innerText = agente.grado;
    document.getElementById('dash-status-user').innerText = `${agente.nome} ${agente.cognome} - @${agente.username}`;
    
    // Avatar
    const fotoEl = document.getElementById('mieiDatiFoto');
    if (fotoEl) {
        fotoEl.src = `https://ui-avatars.com/api/?name=${agente.nome}+${agente.cognome}&background=0284c7&color=fff&size=180`;
    }

    // Cambio schermata
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
}

// ----------------------------------------------------
// FUNZIONI PER LA GESTIONE E REGOLAZIONE DELLA FOTO
// ----------------------------------------------------

function mieiDatiModificaFoto() {
    const nuovaUrl = prompt("Inserisci l'URL dell'immagine del tuo profilo:");
    if (nuovaUrl && nuovaUrl.trim() !== "") {
        const img = document.getElementById('mieiDatiFoto');
        if (img) {
            img.src = nuovaUrl.trim();
        }
    }
}

function mieiDatiTogglePosFoto() {
    const box = document.getElementById('mieiDatiFotoPosBox');
    if (box) {
        box.style.display = (box.style.display === 'none' || box.style.display === '') ? 'block' : 'none';
    }
}

function mieiDatiApplicaPosFoto() {
    const posX = document.getElementById('mieiDatiFotoPosX').value;
    const posY = document.getElementById('mieiDatiFotoPosY').value;
    const img = document.getElementById('mieiDatiFoto');

    if (img) {
        img.style.objectFit = 'cover';
        img.style.objectPosition = `${posX}% ${posY}%`;
    }
}

function mieiDatiResetPosFoto() {
    document.getElementById('mieiDatiFotoPosX').value = 50;
    document.getElementById('mieiDatiFotoPosY').value = 30;
    mieiDatiApplicaPosFoto();
}
