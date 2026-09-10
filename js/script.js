// DATABASE UTENTI PREIMPOSTATI
const agentiDatabase = [
    {
        username: "Ethan.Buzzi",
        password: "123",
        nome: "Ethan",
        cognome: "Buzzi",
        matricola: "PDS-134",
        grado: "Agente Scelto",
        mansione: "Pattugliamento",
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

// EVENTO DI ACCESS COMPILANDO IL FORM DI LOGIN
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value.trim();
    const errorBox = document.getElementById('login-error');

    // Cerca l'agente inserito
    const agenteTrovato = agentiDatabase.find(agente => 
        agente.username.toLowerCase() === userInput.toLowerCase() && agente.password === passInput
    );

    if (agenteTrovato) {
        errorBox.style.display = 'none';
        caricaDashboard(agenteTrovato);
    } else {
        errorBox.style.display = 'block';
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
    
    // Generatore Avatar basato sui dati dell'agente
    document.getElementById('dash-avatar').src = `https://ui-avatars.com/api/?name=${agente.nome}+${agente.cognome}&background=0284c7&color=fff&size=128`;

    // Cambio schermata
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
}

// LOGOUT
document.getElementById('btnLogout').addEventListener('click', function() {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('loginForm').reset();
});
