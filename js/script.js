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
let timerCartellino = null; // Gestione del cronometro del turno

// CALCOLA IL SALUTO IN BASE ALL'ORARIO UFFICIALE DI ROMA (Europe/Rome)
function ottieniSalutoOrario() {
    const oraRoma = parseInt(new Intl.DateTimeFormat('it-IT', {
        timeZone: 'Europe/Rome',
        hour: 'numeric',
        hour12: false
    }).format(new Date()), 10);

    if (oraRoma >= 5 && oraRoma < 12) return "Buongiorno";
    if (oraRoma >= 12 && oraRoma < 17) return "Buon Pomeriggio";
    if (oraRoma >= 17 && oraRoma <= 23) return "Buona Sera";
    return "Buona Nottata";
}

// APPLICA E SALVA LA POSIZIONE DELLA FOTO (PERMANENTE IN LOCALSTORAGE)
function applicaESalvaPosFoto() {
    const posX = document.getElementById('mieiDatiFotoPosX')?.value || 50;
    const posY = document.getElementById('mieiDatiFotoPosY')?.value || 30;
    const img = document.getElementById('mieiDatiFoto');

    if (img) {
        img.style.objectFit = 'cover';
        img.style.objectPosition = `${posX}% ${posY}%`;
    }

    if (utenteCorrente) {
        localStorage.setItem(`mdc_fotopos_x_${utenteCorrente.username}`, posX);
        localStorage.setItem(`mdc_fotopos_y_${utenteCorrente.username}`, posY);
    }
}

// FORMATTA UN INTERVALLO DI TEMPO (IN SECONDI) IN HH:MM:SS
function formattaTempo(secondiTotali) {
    const ore = Math.floor(secondiTotali / 3600).toString().padStart(2, '0');
    const minuti = Math.floor((secondiTotali % 3600) / 60).toString().padStart(2, '0');
    const secondi = (secondiTotali % 60).toString().padStart(2, '0');
    return `${ore}:${minuti}:${secondi}`;
}

// AGGIORNA E GESTISCE LO STATO DEL CARTELLINO
function aggiornaStatoCartellino() {
    if (!utenteCorrente) return;

    const btnEntrata = document.getElementById('btnEntrataServizio');
    const btnUscita = document.getElementById('btnUscitaServizio');
    const badgeStato = document.getElementById('cartellinoStatoBadge');
    const txtOraInizio = document.getElementById('cartellinoOraInizio');
    const txtTimer = document.getElementById('cartellinoTimer');

    const oraInizioSalvata = localStorage.getItem(`mdc_cartellino_inizio_${utenteCorrente.username}`);

    if (oraInizioSalvata) {
        // IN SERVIZIO
        if (btnEntrata) btnEntrata.disabled = true;
        if (btnUscita) btnUscita.disabled = false;

        if (badgeStato) {
            badgeStato.innerText = "IN SERVIZIO";
            badgeStato.className = "badge bg-success";
        }

        const dataInizio = new Date(parseInt(oraInizioSalvata, 10));
        if (txtOraInizio) {
            txtOraInizio.innerText = dataInizio.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        }

        // Avvia il cronometro live
        if (timerCartellino) clearInterval(timerCartellino);
        timerCartellino = setInterval(() => {
            const diffSecondi = Math.floor((new Date().getTime() - dataInizio.getTime()) / 1000);
            if (txtTimer) txtTimer.innerText = formattaTempo(diffSecondi);
        }, 1000);

    } else {
        // FUORI SERVIZIO
        if (btnEntrata) btnEntrata.disabled = false;
        if (btnUscita) btnUscita.disabled = true;

        if (badgeStato) {
            badgeStato.innerText = "FUORI SERVIZIO";
            badgeStato.className = "badge bg-secondary";
        }

        if (txtOraInizio) txtOraInizio.innerText = "--:--";
        if (txtTimer) txtTimer.innerText = "00:00:00";

        if (timerCartellino) {
            clearInterval(timerCartellino);
            timerCartellino = null;
        }
    }
}

// POPOLA I DATI DELLA DASHBOARD
function caricaDashboard(agente) {
    const dashGreeting = document.getElementById('dash-greeting');
    if (dashGreeting) dashGreeting.innerText = ottieniSalutoOrario();

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

    // RIPRISTINO FOTO DA LOCALSTORAGE (PERMANENTE)
    const fotoEl = document.getElementById('mieiDatiFoto');
    const fotoSalvata = localStorage.getItem(`mdc_foto_${agente.username}`);

    if (fotoEl) {
        if (fotoSalvata && fotoSalvata.trim() !== "") {
            fotoEl.src = fotoSalvata;
        } else {
            fotoEl.src = `https://ui-avatars.com/api/?name=${agente.nome}+${agente.cognome}&background=0284c7&color=fff&size=180`;
        }
    }

    // RIPRISTINO POSIZIONE FOTO
    const posXSalvata = localStorage.getItem(`mdc_fotopos_x_${agente.username}`) || 50;
    const posYSalvata = localStorage.getItem(`mdc_fotopos_y_${agente.username}`) || 30;

    const posXInput = document.getElementById('mieiDatiFotoPosX');
    const posYInput = document.getElementById('mieiDatiFotoPosY');

    if (posXInput) posXInput.value = posXSalvata;
    if (posYInput) posYInput.value = posYSalvata;

    if (fotoEl) {
        fotoEl.style.objectFit = 'cover';
        fotoEl.style.objectPosition = `${posXSalvata}% ${posYSalvata}%`;
    }

    // CARICA LO STATO DEL CARTELLINO PER L'UTENTE ATTUALE
    aggiornaStatoCartellino();

    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
}

// INIZIALIZZAZIONE EVENTI
document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.getElementById('loginForm');
    const btnLogout = document.getElementById('btnLogout');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    const btnOpenChangePassword = document.getElementById('btnOpenChangePassword');
    const modalChangePassword = document.getElementById('modalChangePassword');
    const btnClosePwdModal = document.getElementById('btnClosePwdModal');
    const formChangePassword = document.getElementById('formChangePassword');

    const modalLogout = document.getElementById('modalLogout');
    const btnCancelLogout = document.getElementById('btnCancelLogout');
    const btnConfirmLogout = document.getElementById('btnConfirmLogout');

    const btnUpdateProfile = document.getElementById('btnUpdateProfile');

    // ELEMENTI DEL CARTELLINO
    const btnEntrataServizio = document.getElementById('btnEntrataServizio');
    const btnUscitaServizio = document.getElementById('btnUscitaServizio');

    // CONTROLLO SESSIONE GIÀ ATTIVA
    const sessioneSalvata = localStorage.getItem('mdc_utente_loggato');
    if (sessioneSalvata) {
        const agenteTrovato = agentiDatabase.find(a => a.username === sessioneSalvata);
        if (agenteTrovato) {
            utenteCorrente = agenteTrovato;
            caricaDashboard(agenteTrovato);
        }
    }

    // TOGGLE VISIBILITÀ PASSWORD
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // LOGIN
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
                localStorage.setItem('mdc_utente_loggato', agenteTrovato.username);
                caricaDashboard(agenteTrovato);
            } else {
                if (errorBox) errorBox.style.display = 'block';
            }
        });
    }

    // LOGICHE BOTTONI CARTELLINO
    if (btnEntrataServizio) {
        btnEntrataServizio.addEventListener('click', function() {
            if (!utenteCorrente) return;
            const adesso = new Date().getTime();
            localStorage.setItem(`mdc_cartellino_inizio_${utenteCorrente.username}`, adesso);
            aggiornaStatoCartellino();
        });
    }

    if (btnUscitaServizio) {
        btnUscitaServizio.addEventListener('click', function() {
            if (!utenteCorrente) return;
            localStorage.removeItem(`mdc_cartellino_inizio_${utenteCorrente.username}`);
            aggiornaStatoCartellino();
        });
    }

    // MODALE ESCI (LOGOUT CON SCHEDA DI CONFERMA)
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            if (modalLogout) modalLogout.style.display = 'flex';
        });
    }

    if (btnCancelLogout) {
        btnCancelLogout.addEventListener('click', function() {
            if (modalLogout) modalLogout.style.display = 'none';
        });
    }

    if (btnConfirmLogout) {
        btnConfirmLogout.addEventListener('click', function() {
            if (modalLogout) modalLogout.style.display = 'none';
            localStorage.removeItem('mdc_utente_loggato');
            
            if (timerCartellino) clearInterval(timerCartellino);

            document.getElementById('dashboard-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'flex';
            utenteCorrente = null;
            if (loginForm) loginForm.reset();
        });
    }

    // MODIFICA FOTO VIA URL IMAGUR (SALVATAGGIO PERMANENTE)
    const btnEditAvatar = document.getElementById('btnEditAvatar');
    if (btnEditAvatar) {
        btnEditAvatar.addEventListener('click', function() {
            const fotoAttuale = localStorage.getItem(`mdc_foto_${utenteCorrente?.username}`) || '';
            const nuovaUrl = prompt("Inserisci l'URL dell'immagine (es. Imgur):", fotoAttuale);

            if (nuovaUrl !== null && utenteCorrente) {
                const imgUrlPulita = nuovaUrl.trim();
                const fotoEl = document.getElementById('mieiDatiFoto');

                if (imgUrlPulita !== "") {
                    localStorage.setItem(`mdc_foto_${utenteCorrente.username}`, imgUrlPulita);
                    if (fotoEl) fotoEl.src = imgUrlPulita;
                } else {
                    // Se svuotato, ripristina avatar predefinito
                    localStorage.removeItem(`mdc_foto_${utenteCorrente.username}`);
                    if (fotoEl) fotoEl.src = `https://ui-avatars.com/api/?name=${utenteCorrente.nome}+${utenteCorrente.cognome}&background=0284c7&color=fff&size=180`;
                }
            }
        });
    }

    // REGOLAZIONE POSIZIONE FOTO
    const btnPosToggle = document.getElementById('mieiDatiFotoPosToggle');
    if (btnPosToggle) {
        btnPosToggle.addEventListener('click', function() {
            const box = document.getElementById('mieiDatiFotoPosBox');
            if (box) {
                box.style.display = (box.style.display === 'none' || box.style.display === '') ? 'block' : 'none';
            }
        });
    }

    const posXInput = document.getElementById('mieiDatiFotoPosX');
    const posYInput = document.getElementById('mieiDatiFotoPosY');

    if (posXInput) posXInput.addEventListener('input', applicaESalvaPosFoto);
    if (posYInput) posYInput.addEventListener('input', applicaESalvaPosFoto);

    const btnResetPos = document.getElementById('btnResetPosFoto');
    if (btnResetPos) {
        btnResetPos.addEventListener('click', function() {
            if (posXInput) posXInput.value = 50;
            if (posYInput) posYInput.value = 30;
            applicaESalvaPosFoto();
        });
    }

    // BOTTONE AGGIORNA PROFILO / GRADO
    if (btnUpdateProfile) {
        btnUpdateProfile.addEventListener('click', function() {
            const icon = document.getElementById('iconUpdateProfile');
            if (icon) icon.classList.add('fa-spin');

            setTimeout(() => {
                location.reload();
            }, 500);
        });
    }

    // MODALE CAMBIA PASSWORD
    if (btnOpenChangePassword) {
        btnOpenChangePassword.addEventListener('click', function() {
            const err = document.getElementById('pwd-error');
            const succ = document.getElementById('pwd-success');
            if (err) err.style.display = 'none';
            if (succ) succ.style.display = 'none';
            if (formChangePassword) formChangePassword.reset();
            if (modalChangePassword) modalChangePassword.style.display = 'flex';
        });
    }

    if (btnClosePwdModal) {
        btnClosePwdModal.addEventListener('click', function() {
            if (modalChangePassword) modalChangePassword.style.display = 'none';
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

            if (errorBox) errorBox.style.display = 'none';
            if (successBox) successBox.style.display = 'none';

            if (oldPwd !== utenteCorrente.password) {
                if (errorBox) {
                    errorBox.innerText = 'La password attuale inserita non è corretta.';
                    errorBox.style.display = 'block';
                }
                return;
            }

            if (newPwd !== confirmPwd) {
                if (errorBox) {
                    errorBox.innerText = 'Le nuove password non corrispondono.';
                    errorBox.style.display = 'block';
                }
                return;
            }

            utenteCorrente.password = newPwd;
            if (successBox) {
                successBox.innerText = 'Password aggiornata con successo!';
                successBox.style.display = 'block';
            }

            setTimeout(() => {
                if (modalChangePassword) modalChangePassword.style.display = 'none';
            }, 1200);
        });
    }
});
