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

document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.getElementById('loginForm');
    const btnLogout = document.getElementById('btnLogout');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // MOSTRA / NASCONDI PASSWORD CON L'OCCHIO
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            
            // Cambia l'icona dell'occhio (aperto/chiuso)
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

            // Cerca l'agente (confronto non sensibile alle maiuscole/minuscole)
            const agenteTrovato = agentiDatabase.find(agente => 
                agente.username.toLowerCase() === userInput.toLowerCase() && 
                agente.password.toLowerCase() === passInput.toLowerCase()
            );

            if (agenteTrovato) {
                if (errorBox) errorBox.style.display = 'none';
                caricaDashboard(agenteTrovato);
            } else {
                if (errorBox) errorBox.style.display = 'block';
            }
        });
    }

    // LOGOUT
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            document.getElementById('dashboard-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'flex';
            if (loginForm) loginForm.reset();
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
    
    // Generatore Avatar (Sistemato l'ID per farlo funzionare con l'HTML)
    const fotoEl = document.getElementById('mieiDatiFoto');
    if (fotoEl) {
        fotoEl.src = `https://ui-avatars.com/api/?name=${agente.nome}+${agente.cognome}&background=0284c7&color=fff&size=128`;
    }

    // Cambio schermata
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
}

// ----------------------------------------------------
// FUNZIONI PER LA GESTIONE E REGOLAZIONE DELLA FOTO
// ----------------------------------------------------

// 1. Modifica URL della Foto con la Matita
function mieiDatiModificaFoto() {
    const nuovaUrl = prompt("Inserisci l'URL dell'immagine del tuo profilo:");
    if (nuovaUrl && nuovaUrl.trim() !== "") {
        const img = document.getElementById('mieiDatiFoto');
        if (img) {
            img.src = nuovaUrl.trim();
        }
    }
}

// 2. Mostra/Nascondi il pannello degli slider
function mieiDatiTogglePosFoto() {
    const box = document.getElementById('mieiDatiFotoPosBox');
    if (box) {
        box.style.display = (box.style.display === 'none' || box.style.display === '') ? 'block' : 'none';
    }
}

// 3. Applica la posizione orizzontale e verticale alla foto
function mieiDatiApplicaPosFoto() {
    const posX = document.getElementById('mieiDatiFotoPosX').value;
    const posY = document.getElementById('mieiDatiFotoPosY').value;
    const img = document.getElementById('mieiDatiFoto');

    if (img) {
        img.style.objectFit = 'cover';
        img.style.objectPosition = `${posX}% ${posY}%`;
    }
}

// 4. Ripristina la posizione della foto ai valori di default
function mieiDatiResetPosFoto() {
    document.getElementById('mieiDatiFotoPosX').value = 50;
    document.getElementById('mieiDatiFotoPosY').value = 30;
    mieiDatiApplicaPosFoto();
}
