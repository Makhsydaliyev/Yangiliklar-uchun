// 1. Ma'lumotlar bazasi (Dastlabki 30 ta yangilik)
let barchaYangiliklar = [];
const toifalar = ['jahon', 'sport', 'texno', 'ozbek'];

function boshlangichMalumotlarniYaratish() {
    let idSanoq = 1;
    toifalar.forEach(toifa => {
        for (let i = 1; i <= 10; i++) {
            barchaYangiliklar.push({
                id: idSanoq++,
                kategoriya: toifa,
                sarlavha: `${toifa.toUpperCase()} bo'yicha muhim xabar #${i}`,
                qisqaMatn: `${toifa} sohasidagi so'nggi o'zgarishlar va qisqacha ma'lumotlar...`,
                toliqMatn: `${toifa} bo'yicha juda uzun va batafsil maqola matni shu yerda bo'ladi. Bu yangilik dunyo miqyosida katta ahamiyatga ega.`,
                sana: "2026-04-25",
                korishlar: Math.floor(Math.random() * 5000),
                likelar: Math.floor(Math.random() * 500),
                rasm: `https://picsum.photos/seed/${idSanoq}/800/500`,
                turi: (idSanoq === 2) ? 'asosiy' : 'oddiy'
            });
        }
    });
}

// 2. Saytni render qilish (Yuklash)
function saytniIshgaTushirish() {
    const asosiy = barchaYangiliklar.find(n => n.turi === 'asosiy') || barchaYangiliklar[0];
    
    document.getElementById('asosiy-yangilik-maydoni').innerHTML = `
        <div class="asosiy-karta shadow" style="background-image: url('${asosiy.rasm}'); background-size: cover; background-position: center;" onclick="yangilikniOchish(${asosiy.id})">
            <div class="karta-ustqatlami d-flex flex-column justify-content-end h-100">
                <span class="badge bg-danger mb-2" style="width: fit-content;">ASOSIY YANGILIK</span>
                <h1 class="display-5 fw-bold">${asosiy.sarlavha}</h1>
                <p class="lead">${asosiy.qisqaMatn}</p>
            </div>
        </div>
    `;

    kategoriyaniChiqarish('jahon', 'jahon-qutisi');
    kategoriyaniChiqarish('sport', 'sport-qutisi');
    kategoriyaniChiqarish('texno', 'texno-qutisi');
    kategoriyaniChiqarish('ozbek', 'ozbek-qutisi');
    adminJadvaliniYangilash();
}

function kategoriyaniChiqarish(toifa, qutiId) {
    const quti = document.getElementById(qutiId);
    if (!quti) return;

    const saralangan = barchaYangiliklar.filter(n => n.kategoriya === toifa && n.turi !== 'asosiy');
    
    quti.innerHTML = saralangan.map(y => `
        <div class="col-md-4 mb-4">
            <div class="kichik-karta h-100" onclick="yangilikniOchish(${y.id})">
                <img src="${y.rasm}" class="karta-rasmi">
                <div class="p-3">
                    <h6 class="fw-bold text-dark">${y.sarlavha}</h6>
                    <p class="small text-muted">${y.qisqaMatn}</p>
                </div>
                <div class="px-3 pb-3 d-flex justify-content-between mt-auto">
                    <small><i class="far fa-eye"></i> ${y.korishlar}</small>
                    <small class="text-muted">${y.sana}</small>
                </div>
            </div>
        </div>
    `).join('');
}

// 3. Admin Panel Funksiyalari
function adminPanelniOchish() {
    const parol = prompt("Admin parolini kiriting:");
    if (parol === "1234") {
        document.getElementById('admin-boshqaruvi').classList.toggle('d-none');
        window.location.href = "#admin-boshqaruvi";
    } else {
        alert("Parol noto'g'ri!");
    }
}

function adminJadvaliniYangilash() {
    const jadvalTanasi = document.getElementById('admin-jadval-tanasi');
    jadvalTanasi.innerHTML = barchaYangiliklar.map(n => `
        <tr>
            <td class="small">${n.sarlavha.substring(0, 30)}...</td>
            <td><span class="badge bg-info text-dark">${n.kategoriya}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="tahrirlash(${n.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="yangilikniOchirish(${n.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function yangilikniSaqlash() {
    const id = document.getElementById('tahrir-id').value;
    const sarlavha = document.getElementById('y-sarlavha').value;
    const toifa = document.getElementById('y-toifa').value;
    const rasm = document.getElementById('y-rasm').value;
    const matn = document.getElementById('y-matn').value;

    if (id) {
        // Tahrirlash
        const index = barchaYangiliklar.findIndex(n => n.id == id);
        barchaYangiliklar[index] = { 
            ...barchaYangiliklar[index], 
            sarlavha, 
            kategoriya: toifa, 
            rasm, 
            toliqMatn: matn 
        };
    } else {
        // Yangi qo'shish
        barchaYangiliklar.unshift({
            id: Date.now(),
            sarlavha, 
            kategoriya: toifa, 
            rasm, 
            toliqMatn: matn,
            qisqaMatn: matn.substring(0, 50) + "...",
            sana: new Date().toLocaleDateString(),
            korishlar: 0, 
            likelar: 0, 
            turi: 'oddiy'
        });
    }
    
    formaniTozalash();
    saytniIshgaTushirish();
}

function yangilikniOchirish(id) {
    if(confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
        barchaYangiliklar = barchaYangiliklar.filter(n => n.id !== id);
        saytniIshgaTushirish();
    }
}

function tahrirlash(id) {
    const n = barchaYangiliklar.find(item => item.id === id);
    document.getElementById('tahrir-id').value = n.id;
    document.getElementById('y-sarlavha').value = n.sarlavha;
    document.getElementById('y-toifa').value = n.kategoriya;
    document.getElementById('y-rasm').value = n.rasm;
    document.getElementById('y-matn').value = n.toliqMatn;
    window.location.href = "#admin-boshqaruvi";
}

function formaniTozalash() {
    document.getElementById('tahrir-id').value = '';
    document.getElementById('y-sarlavha').value = '';
    document.getElementById('y-rasm').value = '';
    document.getElementById('y-matn').value = '';
}

// 4. Like va Modal Funksiyalari
function likeBosish(id) {
    const yangilik = barchaYangiliklar.find(n => n.id === id);
    if (yangilik) {
        yangilik.likelar++;
        const likeJoyi = document.getElementById(`modal-like-${id}`);
        if (likeJoyi) likeJoyi.innerText = yangilik.likelar;
        
        // Sahifani ham yangilash
        kategoriyaniChiqarish(yangilik.kategoriya, `${yangilik.kategoriya}-qutisi`);
    }
}

function yangilikniOchish(id) {
    const yangilik = barchaYangiliklar.find(n => n.id === id);
    const oynaTanasi = document.getElementById('oyna-ichki-qismi');
    
    oynaTanasi.innerHTML = `
        <div class="modal-header-img shadow-lg" style="background-image: url('${yangilik.rasm}'); background-size: cover; background-position: center; min-height: 400px; width: 100%; position: relative;">
            <div class="d-flex flex-column justify-content-end p-5 h-100" style="background: linear-gradient(to top, white, transparent); min-height: 400px;">
                <button type="button" class="btn-close position-absolute top-0 end-0 m-4 shadow" data-bs-dismiss="modal"></button>
                <span class="badge rounded-pill px-3 py-2 mb-3 shadow-sm" style="background-color: var(--zumrad-rang); width: fit-content; color: white;">
                    ${yangilik.kategoriya.toUpperCase()}
                </span>
                <h1 class="display-5 fw-bold mb-0" style="color: var(--matn-toq);">${yangilik.sarlavha}</h1>
            </div>
        </div>
        <div class="oyna-matni p-5">
            <div class="row">
                <div class="col-md-8">
                    <p class="small text-muted mb-4"><i class="far fa-calendar-alt me-2"></i> ${yangilik.sana}</p>
                    <div class="fs-5 lh-lg text-secondary">
                        ${yangilik.toliqMatn}
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-4 rounded-4 sticky-top shadow-sm" style="background: #fff; border: 1px solid rgba(212,163,115,0.2); top: 20px;">
                        <h6 class="text-uppercase fw-bold mb-3 small">Statistika</h6>
                        <div class="d-flex justify-content-between mb-2">
                            <span><i class="far fa-eye me-2"></i> Ko'rishlar:</span>
                            <strong>${yangilik.korishlar + 1}</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-4">
                            <span><i class="far fa-heart me-2 text-danger"></i> Yoqtirishlar:</span>
                            <strong id="modal-like-${yangilik.id}">${yangilik.likelar}</strong>
                        </div>
                        <button class="btn btn-yashil w-100 py-2 fw-bold shadow-sm" onclick="likeBosish(${yangilik.id})">
                            <i class="fas fa-heart me-2"></i> Menga yoqdi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const oyna = new bootstrap.Modal(document.getElementById('yangilikOynasi'));
    oyna.show();
    yangilik.korishlar++;
}

// Sahifani yuklash
boshlangichMalumotlarniYaratish();
saytniIshgaTushirish();