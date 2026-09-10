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

// CALCOLA IL SALUTO IN BASE ALL'ORARIO
function ottieniSalutoOrario() {
    const ora = new Date().getHours();
    if (ora >= 5 && ora < 12) {
        return "Buongiorno";
    } else if (ora >= 12 && ora < 17) {
        return "Buon Pomeriggio";
    } else if (ora >= 17 && ora <= 23) {
        return "Buona Sera";
    } else {
        return "Buona Nottata";
    }
}

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

    // --- CONTROLLO SESSIONE GIÀ ATTIVA (AUTO-LOGIN ALL'AGGIORNAMENTO PAGINA) ---
    const sessioneSalvata = localStorage.getItem('mdc_utente_loggato');
    if (sessioneSalvata) {
        const agenteTrovato = agentiDatabase.find(a => a.username === sessioneSalvata);
        if (agenteTrovato) {
            utenteCorrente = agenteTrovato;
            caricaDashboard(agenteTrovato);
        }
    }

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
                
                // SALVA SESSIONE NEL BROWSER
                localStorage.setItem('mdc_utente_loggato', agenteTrovato.username);
                
                caricaDashboard(agenteTrovato);
            } else {
                if (errorBox) errorBox.style.display = 'block';
            }
        });
    }

    // MODALE ESCI (LOGOUT)
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
            
            // CANCELLA SESSIONE SALVATA
            localStorage.removeItem('mdc_utente_loggato');
            
            const dash = document.getElementById('dashboard-section');
            const login = document.getElementById('login-section');
            if (dash) dash.style.display = 'none';
            if (login) login.style.display = 'flex';
            utenteCorrente = null;
            if (loginForm) loginForm.reset();
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

    // BOTTONE AGGIORNA PROFILO
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

    // GESTIONE AVATAR E POSIZIONAMENTO CON SALVATAGGIO PERMANENTE
    const btnEditAvatar = document.getElementById('btnEditAvatar');
    if (btnEditAvatar) {
        btnEditAvatar.addEventListener('click', function() {
            const nuovaUrl = prompt("Inserisci l'URL dell'immagine del tuo profilo:");
            if (nuovaUrl && nuovaUrl.trim() !== "" && utenteCorrente) {
                const imgUrl = nuovaUrl.trim();
                const img = document.getElementById('mieiDatiFoto');
                if (img) img.src = imgUrl;

                // Salva URL in localStorage per questo utente specifico
                localStorage.setItem(`mdc_foto_${utenteCorrente.username}`, imgUrl);
            }
        });
    }

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
});
// Funzione per ridimensionare e comprimere le immagini lato client prima dell'upload
function comprimiImmagine(file, maxWidth = 400, maxHeight = 400, qualita = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calcolo delle nuove dimensioni mantenendo le proporzioni
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Restituisce l'immagine compressa in formato DataURL JPEG leggero
                resolve(canvas.toDataURL('image/jpeg', qualita));
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

// Esempio di gestione dell'evento di modifica foto ottimizzato
const btnEditAvatar = document.getElementById('btnEditAvatar');
if (btnEditAvatar) {
    btnEditAvatar.addEventListener('click', async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Mostra loader
            const loader = document.getElementById('loading-overlay');
            if (loader) loader.style.display = 'flex';

            try {
                // Comprime l'immagine prima di elaborarla
                const base64Ottimizzato = await comprimiImmagine(file);
                
                // Aggiorna l'anteprima avatar immediatamente
                document.getElementById('mieiDatiFoto').src = base64Ottimizzato;

                // QUI: inserisci la tua chiamata API o fetch() per salvare i dati
                /*
                await fetch('/api/salva-foto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ foto: base64Ottimizzato })
                });
                */

            } catch (error) {
                console.error("Errore durante la compressione:", error);
                alert("Si è verificato un errore durante l'elaborazione dell'immagine.");
            } finally {
                // Nasconde loader
                if (loader) loader.style.display = 'none';
            }
        };

        input.click();
    });
}
// FUNZIONE PER APPLICARE E SALVARE LA POSIZIONE DELLA FOTO
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

// POPOLA I DATI DELLA DASHBOARD CON L'UTENTE AUTENTICATO
function caricaDashboard(agente) {
    const dashGreeting = document.getElementById('dash-greeting');
    if (dashGreeting) dashGreeting.innerText = ottieniSalutoOrario();

    const dashFullname = document.getElementById('dash-fullname');
    if (dashFullname) dashFullname.innerText = `${agente.nome} ${agente.cognome}`;

    const dashCardName = document.getElementById('dash-card-name');
    if (dashCardName) dashCardName.innerText = `${agente.nome} ${agente.cognome}`;

    const dashCardGrado = document.getElementById('dash-card-grado-sub');
    if (dashCardGrado) dashCardGrado.innerText = agente.grado;

    const dashMatricola = document.getElementById('dash-matricola');
    if (dashMatricola) dashMatricola.innerText = agente.matricola;

    const dashUsername = document.getElementById('dash-username');
    if (dashUsername) dashUsername.value = agente.username;

    const dashNome = document.getElementById('dash-nome');
    if (dashNome) dashNome.value = agente.nome;

    const dashCognome = document.getElementById('dash-cognome');
    if (dashCognome) dashCognome.value = agente.cognome;

    const dashDiscord = document.getElementById('dash-discord');
    if (dashDiscord) dashDiscord.value = agente.discordId;

    const dashGrado = document.getElementById('dash-grado');
    if (dashGrado) dashGrado.value = agente.grado;

    const dashMansione = document.getElementById('dash-mansione');
    if (dashMansione) dashMansione.value = agente.mansione;

    const dashSpec = document.getElementById('dash-spec');
    if (dashSpec) dashSpec.innerHTML = `<i class="fa-solid fa-shield"></i> ${agente.specializzazione}`;

    const dashStatusGrado = document.getElementById('dash-status-grado');
    if (dashStatusGrado) dashStatusGrado.innerText = agente.grado;

    const dashStatusUser = document.getElementById('dash-status-user');
    if (dashStatusUser) dashStatusUser.innerText = `${agente.nome} ${agente.cognome} - @${agente.username}`;
    
    // RESTIPULAZIONE FOTO E POSIZIONE SALVATE PER QUESTO UTENTE
    const fotoEl = document.getElementById('mieiDatiFoto');
    const fotoSalvata = localStorage.getItem(`mdc_foto_${agente.username}`);

    if (fotoEl) {
        if (fotoSalvata) {
            fotoEl.src = fotoSalvata;
        } else {
            fotoEl.src = `https://ui-avatars.com/api/?name=${agente.nome}+${agente.cognome}&background=0284c7&color=fff&size=180`;
        }
    }

    // Ripristino Cursori Posizione Foto
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

    // Cambio schermata
    const loginSec = document.getElementById('login-section');
    const dashSec = document.getElementById('dashboard-section');
    if (loginSec) loginSec.style.display = 'none';
    if (dashSec) dashSec.style.display = 'block';
}
