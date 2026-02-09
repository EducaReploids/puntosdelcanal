const API = "https://script.google.com/macros/s/AKfycbzkN6gTmMisOFOZxL64vrYThvo9CFkq0hN-3Du_X6XcdSny7XjeGvFZ2MDEz5xdHN0Mcw/exec";

const CATALOGO = [
    {id:"x_aah", name:"X Grito", rank:"COMUN", img:"img/X_aah.png", precio:500},
    {id:"x_feli", name:"X Feli", rank:"COMUN", img:"img/X_feli.png", precio:500},
    {id:"x_pensando", name:"Pensando", rank:"COMUN", img:"img/X_pensando.png", precio:500},
    {id:"jeje", name:"Jeje", rank:"COMUN", img:"img/jeje.png", precio:500},
    {id:"uwu", name:"UwU", rank:"COMUN", img:"img/uwu.png", precio:500},
    {id:"yei", name:"Yei", rank:"COMUN", img:"img/yei.png", precio:500},
    {id:"xdddd", name:"XD", rank:"COMUN", img:"img/xdddd.png", precio:500},
    {id:"baile2", name:"Dance", rank:"RARO", img:"img/dance.gif", precio:1500},
    {id:"ez", name:"EZ", rank:"RARO", img:"img/ez.png", precio:1000},
    {id:"bruh", name:"Bruh", rank:"RARO", img:"img/bruh.png", precio:1000},
    {id:"noputa", name:"No Puta", rank:"RARO", img:"img/noputa.png", precio:1000},
    {id:"noway", name:"No Way", rank:"RARO", img:"img/noway.png", precio:1000},
    {id:"quejeso", name:"Que es eso", rank:"RARO", img:"img/quejeso.png", precio:1000},
    {id:"risa", name:"Risa", rank:"RARO", img:"img/risa.png", precio:1000},
    {id:"geix", name:"Gei X", rank:"RARO", img:"img/gei.png", precio:1200},
    {id:"sigma", name:"Sigma", rank:"ESPECIAL", img:"img/sigma.jpg", precio:2000},
    {id:"tite", name:"Tite", rank:"ESPECIAL", img:"img/tite.png", precio:2000},
    {id:"uhmmm", name:"Uhmmm", rank:"ESPECIAL", img:"img/uhmmm.png", precio:2000},
    {id:"derechos", name:"Derechos", rank:"ESPECIAL", img:"img/tus_derechos.png", precio:2500},
    {id:"sadxdd", name:"Sad XD", rank:"ESPECIAL", img:"img/sadxdd.png", precio:2000},
    {id:"puufff", name:"Pufff", rank:"ESPECIAL", img:"img/puufff.png", precio:2000},
    {id:"baile", name:"Victory Dance", rank:"LEGENDARIO", img:"img/baile.gif", precio:4000},
    {id:"heart", name:"Heart Tank", rank:"LEGENDARIO", img:"img/heart.gif", precio:4000},
    {id:"xcum", name:"Dari cumsito", rank:"LEGENDARIO", img:"img/xcum.png", precio:5000}
];

let USER_EMAIL = null; let USER_NAME = null; let USER_POINTS = 0; let segundos = 0; const TIEMPO_FARMEO = 300; let yaCelebre = false;

window.onload = function() {
    const savedEmail = localStorage.getItem('x_hunter_email');
    const savedName = localStorage.getItem('x_hunter_name');
    const savedPic = localStorage.getItem('x_hunter_pic');
    if(savedEmail && savedName) configurarSesion(savedEmail, savedName, savedPic);
};

function configurarSesion(email, name, pic) {
    USER_EMAIL = email; USER_NAME = name;
    document.getElementById('login-screen').style.display = "none";
    document.getElementById('main-ui').style.display = "grid";
    document.getElementById('user-pfp').src = pic || "img/ecrystal.gif";
    document.getElementById('display-name').innerText = USER_NAME;
    iniciarJuego();
}

function handleCredentialResponse(response) {
    const ytName = document.getElementById('yt-name-input').value.trim();
    if(!ytName) return alert("Escribe tu nombre de YouTube primero.");
    const data = JSON.parse(atob(response.credential.split('.')[1]));
    document.getElementById('login-status').innerText = "ACCEDIENDO...";
    fetch(API, {method:"POST", mode:"no-cors", body:JSON.stringify({accion:"login_google", email:data.email, nombre:ytName, foto:data.picture})}).then(() => {
        localStorage.setItem('x_hunter_email', data.email);
        localStorage.setItem('x_hunter_name', ytName);
        localStorage.setItem('x_hunter_pic', data.picture);
        configurarSesion(data.email, ytName, data.picture);
    });
}

function cerrarSesion() { showConfirm("¿Cerrar sesión?", () => { localStorage.clear(); location.reload(); }); }

// MODALES
function showConfirm(text, onYes) {
    const m = document.getElementById('custom-modal');
    document.getElementById('modal-msg').innerText = text;
    m.style.display = 'flex';
    document.getElementById('btn-modal-yes').style.display = 'inline-block';
    document.getElementById('btn-modal-no').style.display = 'inline-block';
    document.getElementById('btn-modal-yes').onclick = function() { m.style.display = 'none'; onYes(); };
}
function showAlert(text) {
    const m = document.getElementById('custom-modal');
    document.getElementById('modal-msg').innerText = text;
    m.style.display = 'flex';
    document.getElementById('btn-modal-yes').innerText = "OK";
    document.getElementById('btn-modal-yes').onclick = () => { m.style.display = 'none'; document.getElementById('btn-modal-yes').innerText = "CONFIRMAR"; };
    document.getElementById('btn-modal-no').style.display = 'none';
}
function closeModal() { document.getElementById('custom-modal').style.display = 'none'; }

// JUEGO
function iniciarJuego() {
    setInterval(() => { segundos++; document.getElementById('energy-bar').style.width=(segundos/TIEMPO_FARMEO)*100+"%"; if(segundos>=TIEMPO_FARMEO){ fetch(API, {method:"POST", mode:"no-cors", body:JSON.stringify({accion:"farmear", userId:USER_EMAIL, userName:USER_NAME, esMiembro:false})}); segundos=0; } }, 1000);
    setInterval(sincronizar, 3000); sincronizar(); renderShop();
}

function switchTab(t) {
    document.querySelectorAll('.cyber-box[id^="tab-"]').forEach(d=>d.style.display='none');
    document.getElementById('tab-'+t).style.display='block';
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById('btn-'+t).classList.add('active');
}

// TIENDA
function renderShop() {
    const c = document.getElementById('shop-container'); c.innerHTML = "";
    CATALOGO.forEach(item => {
        const div = document.createElement('div'); div.className = `shop-item r-${item.rank}`;
        div.innerHTML = `<img src="${item.img}"><div style="font-size:8px; margin-top:5px; font-weight:bold;">${item.name}</div><div class="shop-price">${item.precio} PTS</div>`;
        div.onclick = () => comprarItem(item); c.appendChild(div);
    });
}
function comprarItem(item) {
    if(USER_POINTS < item.precio) return showAlert("¡No tienes suficientes puntos!");
    showConfirm(`¿Comprar ${item.name} por ${item.precio} pts?`, () => {
        log(`Comprando ${item.name}...`);
        fetch(API, {method:"POST", mode:"no-cors", body:JSON.stringify({accion:"comprar_directo", userId:USER_EMAIL, userName:USER_NAME, itemId:item.id})}).then(() => { showAlert("¡Compra realizada! Revisa tu mochila."); setTimeout(sincronizar, 1000); });
    });
}

// GACHA
function startGacha() {
    if(USER_POINTS < 800) return showAlert("Necesitas 800 puntos.");
    showConfirm("¿Gastar 800 pts en Decodificación?", () => {
        document.getElementById('gacha-controls').style.display = 'none';
        document.getElementById('roulette-box').style.display = 'block';
        
        // 1. Elegir ganador (Simulado por CORS)
        const rand = Math.random() * 100; let rank = "COMUN";
        if(rand > 95) rank="LEGENDARIO"; else if(rand > 80) rank="ESPECIAL"; else if(rand > 50) rank="RARO";
        const pool = CATALOGO.filter(i => i.rank === rank);
        const winItem = pool[Math.floor(Math.random() * pool.length)];
        
        // 2. Tira Visual
        const strip = document.getElementById('roulette-strip'); strip.innerHTML = "";
        strip.style.transition = "none"; strip.style.transform = "translateX(0px)";
        const cardWidth = 100; const targetIndex = 40;
        
        for(let i=0; i<50; i++) {
            let item = (i === targetIndex) ? winItem : CATALOGO[Math.floor(Math.random() * CATALOGO.length)];
            const div = document.createElement('div'); div.className = `roulette-item r-${item.rank}`;
            div.innerHTML = `<img src="${item.img}">`; strip.appendChild(div);
        }

        // 3. Animar
        const containerWidth = document.getElementById('roulette-box').offsetWidth;
        const targetPos = (targetIndex * cardWidth) - (containerWidth / 2) + (cardWidth / 2);
        
        setTimeout(() => {
            strip.style.transition = "transform 5s cubic-bezier(0.1, 0.9, 0.2, 1)";
            strip.style.transform = `translateX(-${targetPos}px)`;
        }, 50);

        // 4. Guardar y Mostrar
        setTimeout(() => {
            // AQUÍ USAMOS registrar_gacha QUE AHORA EXISTE EN EL BACKEND
            fetch(API, {method:"POST", mode:"no-cors", body:JSON.stringify({accion:"registrar_gacha", userId:USER_EMAIL, userName:USER_NAME, itemId:winItem.id})});
            
            document.getElementById('roulette-box').style.display = 'none';
            document.getElementById('gacha-claim').style.display = 'block';
            document.getElementById('won-item-img').src = winItem.img;
            document.getElementById('won-item-name').innerText = winItem.name;
            confetti({particleCount: 150, spread: 80, origin: { y: 0.6 }});
        }, 5500);
    });
}

function claimGacha() {
    document.getElementById('gacha-claim').style.display = 'none';
    document.getElementById('gacha-controls').style.display = 'block';
    setTimeout(sincronizar, 1000);
}

// SYNC
function sincronizar() {
    if(!USER_EMAIL) return;
    fetch(`${API}?accion=inventario&userId=${USER_EMAIL}`).then(r=>r.json()).then(d=>{
        if(d.status==="success") {
            USER_POINTS = d.puntos;
            document.getElementById('display-puntos').innerText = d.puntos;
            const p = document.getElementById('inv-pending'); p.innerHTML="";
            for(const [k,v] of Object.entries(d.pendientes)){
                const i=CATALOGO.find(x=>x.id===k)||{name:k,img:"img/image.png",rank:"COMUN"};
                p.innerHTML+=`<div class="shop-item r-${i.rank}"><img src="${i.img}"><div style="font-size:8px;">${i.name} (x${v})</div><button class="btn-activate" onclick="activar('${k}')">EQUIPAR</button></div>`;
            }
            const a = document.getElementById('inv-active'); a.innerHTML="";
            d.activos.forEach(k=>{
                const i=CATALOGO.find(x=>x.id===k.id)||{name:k.id,img:"img/image.png"};
                a.innerHTML+=`<div class="shop-item" style="border-color:#0f0;"><img src="${i.img}" style="filter:drop-shadow(0 0 5px #0f0);"><div style="font-size:8px;">${i.name}</div><span class="active-badge">ACTIVO</span></div>`;
            });
        }
    });
    fetch(`${API}?accion=estado_apuesta&userId=${USER_EMAIL}`).then(r=>r.json()).then(d=>{
        const wait = document.getElementById('waiting-view'); const bet = document.getElementById('betting-view'); const res = document.getElementById('result-view');
        if(d.opA) document.getElementById('label-a').innerText = d.opA; if(d.opB) document.getElementById('label-b').innerText = d.opB;
        if(d.estado === "ABIERTA") {
            wait.style.display="none"; bet.style.display="block"; res.style.display="none";
            document.getElementById('bet-title').innerText = d.titulo; yaCelebre = false;
            let tot = d.totalA+d.totalB; let pctA = tot ? (d.totalA/tot)*100 : 50; let pctB = tot ? (d.totalB/tot)*100 : 50;
            document.getElementById('bar-a').style.width = pctA+"%"; document.getElementById('bar-b').style.width = pctB+"%";
            if(d.miApuesta && d.miApuesta.estado === "PENDIENTE") { document.getElementById('controls-vote').style.display="none"; document.getElementById('controls-cancel').style.display="block"; } 
            else { document.getElementById('controls-vote').style.display="block"; document.getElementById('controls-cancel').style.display="none"; }
        } else if(d.estado === "CERRADA") {
            bet.style.display="none";
            if(d.ultimoResultado) {
                wait.style.display="none"; res.style.display="block";
                let w = (d.ultimoResultado==="A") ? d.opA : d.opB;
                document.getElementById('res-title').innerText = "GANADOR: " + w.toUpperCase();
                if(!yaCelebre) { confetti({particleCount: 100, spread: 70}); yaCelebre=true; }
            } else { wait.style.display="block"; res.style.display="none"; }
        }
    });
}

function apostar(op) { const m = document.getElementById('monto').value; showConfirm(`¿Apostar ${m} a ${op}?`, () => { fetch(API,{method:"POST",mode:"no-cors",body:JSON.stringify({accion:"apostar",userId:USER_EMAIL,userName:USER_NAME,opcion:op,monto:m})}).then(()=>{ log("Voto enviado."); setTimeout(sincronizar,1000);}); }); }
function cancelar() { showConfirm("¿Cancelar tu apuesta?", () => { fetch(API,{method:"POST",mode:"no-cors",body:JSON.stringify({accion:"cancelar_apuesta",userId:USER_EMAIL,userName:USER_NAME})}).then(()=>{ log("Cancelado."); setTimeout(sincronizar,1000);}); }); }
function activar(id) { showConfirm("¿Activar skin por 24h?", () => { fetch(API,{method:"POST",mode:"no-cors",body:JSON.stringify({accion:"activar_item",userId:USER_EMAIL,itemId:id})}).then(()=>{setTimeout(sincronizar,1000);}); }); }
function log(m) { const d = document.createElement('div'); d.innerText = "> " + m; const c = document.getElementById('console'); c.insertBefore(d, c.firstChild); }
