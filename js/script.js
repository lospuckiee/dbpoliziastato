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
    if (ora >= 5 && ora < 12) return "Buongiorno";
    if (ora >= 12 && ora < 17) return "Buon Pomeriggio";
    if (ora >= 17 && ora <= 23) return "Buona Sera";
    return "Buona Nottata";
}

// COMPRESSIONE FOTO LATO CLIENT (RIDUCE IL PESO FINO AL 90%)
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
                resolve(canvas.toDataURL('image/jpeg', qualita));
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

// APPLICA E SALVA LA POSIZIONE DELLA FOTO
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

// POPOLA I DATI DELLA DASHBOARD
function caricaDashboard(agente) {
    document.getElementById('dash-greeting').innerText = ottieniSalutoOrario();
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

    // CARICAMENTO FOTO E POSIZIONE SALVATA
    const fotoEl = document.getElementById('mieiDatiFoto');
    const fotoSalvata = localStorage.getItem(`mdc_foto_${agente.username}`);

    if (fotoEl) {
        fotoEl.src = fotoSalvata ? fotoSalvata : `https://ui-avatars.com/api/?name=${agente.nome}+${agente.cognome}&background=0284c7&color=fff&size=180`;
    }

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

    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
}

// INIZIALIZZAZIONE EVENTI ALLA CARICA DELLA PAGINA
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

    // CONTROLLO SESSIONE SALVATA
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

    // FORM DI LOGIN
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

    // GESTIONE LOGOUT
    if (btnLogout) btnLogout.addEventListener('click', () => modalLogout.style.display = 'flex');
    if (btnCancelLogout) btnCancelLogout.addEventListener('click', () => modalLogout.style.display = 'none');
    if (btnConfirmLogout) {
        btnConfirmLogout.addEventListener('click', function() {
            modalLogout.style.display = 'none';
            localStorage.removeItem('mdc_utente_loggato');
            document.getElementById('dashboard-section').style.display = 'none';
            document.getElementById('login-section').style.display = 'flex';
            utenteCorrente = null;
            if (loginForm) loginForm.reset();
        });
    }

    // CARICAMENTO E COMPRESSIONE FOTO PROFILO
    const btnEditAvatar = document.getElementById('btnEditAvatar');
    if (btnEditAvatar) {
        btnEditAvatar.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';

            fileInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file || !utenteCorrente) return;

                try {
                    const base64Compresso = await comprimiImmagine(file, 400, 400, 0.7);
                    document.getElementById('mieiDatiFoto').src = base64Compresso;
                    
                    // Salva la foto compressa in localStorage senza superare la quota
                    localStorage.setItem(`mdc_foto_${utenteCorrente.username}`, base64Compresso);
                } catch (err) {
                    alert("Errore durante il caricamento dell'immagine. Riprova con un altro file.");
                }
            };

            fileInput.click();
        });
    }

    // REGOLAZIONE POSIZIONE FOTO
    const btnPosToggle = document.getElementById('mieiDatiFotoPosToggle');
    if (btnPosToggle) {
        btnPosToggle.addEventListener('click', function() {
            const box = document.getElementById('mieiDatiFotoPosBox');
            if (box) box.style.display = (box.style.display === 'none' || box.style.display === '') ? 'block' : 'none';
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

    // CAMBIO PASSWORD
    if (btnOpenChangePassword) {
        btnOpenChangePassword.addEventListener('click', function() {
            document.getElementById('pwd-error').style.display = 'none';
            document.getElementById('pwd-success').style.display = 'none';
            if (formChangePassword) formChangePassword.reset();
            modalChangePassword.style.display = 'flex';
        });
    }

    if (btnClosePwdModal) btnClosePwdModal.addEventListener('click', () => modalChangePassword.style.display = 'none');

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

            utenteCorrente.password = newPwd;
            successBox.innerText = 'Password aggiornata con successo!';
            successBox.style.display = 'block';

            setTimeout(() => {
                modalChangePassword.style.display = 'none';
            }, 1200);
        });
    }

    // AGGIORNA PROFILO
    if (btnUpdateProfile) {
        btnUpdateProfile.addEventListener('click', function() {
            const icon = document.getElementById('iconUpdateProfile');
            if (icon) icon.classList.add('fa-spin');

            setTimeout(() => {
                if (icon) icon.classList.remove('fa-spin');
                if (utenteCorrente) caricaDashboard(utenteCorrente);
            }, 600);
        });
    }
});
