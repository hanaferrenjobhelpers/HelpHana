const nameInput = document.getElementById('name');
const dukunganHeaderInput = document.getElementById('dukunganHeader');
const dukunganSubInput = document.getElementById('dukunganSub');
const dateInput = document.getElementById('date');
const amountInput = document.getElementById('amount');
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const uploadTemplate = document.getElementById('uploadTemplate');
const templateList = document.getElementById('templateList');

const STORAGE_KEY = 'lai_templates';
let templates = [];
let currentTemplateIndex = 0;
let defaultTemplate = 'assets/BG_1.jpeg';
const templateImg = new Image();

function loadTemplates() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            templates = JSON.parse(saved);
        } catch (e) {
            templates = [];
        }
    }
    if (templates.length === 0) {
        templates.push({ id: 'default', src: defaultTemplate, removable: false });
    }
    
    renderTemplateList();
    selectTemplate(0);
}

function saveTemplates() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    } catch (e) {
        console.error('Storage full, removing oldest user template.');
        alert('Memori penyimpanan penuh. Tidak dapat menyimpan template baru. Coba hapus yang lama.');
    }
}

function renderTemplateList() {
    templateList.innerHTML = '';
    templates.forEach((tpl, index) => {
        const div = document.createElement('div');
        div.className = `relative w-16 h-16 rounded-lg overflow-hidden border-4 cursor-pointer transition-all ${index === currentTemplateIndex ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-slate-200 opacity-70 hover:opacity-100'}`;
        
        const img = document.createElement('img');
        img.src = tpl.src;
        img.className = 'w-full h-full object-cover';
        img.onclick = () => selectTemplate(index);
        div.appendChild(img);
        
        if (tpl.removable) {
            const delBtn = document.createElement('button');
            delBtn.innerHTML = '🗑️';
            delBtn.className = 'absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-lg hover:bg-red-600';
            delBtn.onclick = (e) => {
                e.stopPropagation();
                deleteTemplate(index);
            };
            div.appendChild(delBtn);
        }
        templateList.appendChild(div);
    });
}

function selectTemplate(index) {
    if (index >= 0 && index < templates.length) {
        currentTemplateIndex = index;
        templateImg.src = templates[index].src;
        renderTemplateList();
    }
}

function deleteTemplate(index) {
    if (templates[index].removable) {
        templates.splice(index, 1);
        if (currentTemplateIndex >= templates.length) currentTemplateIndex = 0;
        else if (currentTemplateIndex > index) currentTemplateIndex--;
        saveTemplates();
        renderTemplateList();
        selectTemplate(currentTemplateIndex);
    }
}

uploadTemplate.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (templates.length >= 5) {
        alert('Maksimal 5 template. Hapus salah satu terlebih dahulu.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const tempCanvas = document.createElement('canvas');
            const MAX_WIDTH = 1080;
            const MAX_HEIGHT = 1080;
            let width = img.width;
            let height = img.height;
            
            if (width > height && width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            } else if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
            
            tempCanvas.width = width;
            tempCanvas.height = height;
            const ctxTemp = tempCanvas.getContext('2d');
            ctxTemp.drawImage(img, 0, 0, width, height);
            
            const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.8);
            
            templates.push({ id: Date.now().toString(), src: dataUrl, removable: true });
            saveTemplates();
            selectTemplate(templates.length - 1);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
});

templateImg.onload = () => renderCard();

function formatIDR(amount) {
    if (!amount) return '';
    return 'Rp' + new Intl.NumberFormat('id-ID').format(amount).replace(/,/g, '.');
}

function formatIndonesianDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    }).format(date);
}

function drawOutlinedText(ctx, text, x, y, size) {
    ctx.font = `900 ${size}px "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.lineWidth = size * 0.28;
    ctx.strokeStyle = '#6d28d9';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, x, y);
}

function drawOutlinedTextSmall(ctx, text, x, y, size) {
    ctx.font = `800 ${size}px "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.lineWidth = size * 0.2;
    ctx.strokeStyle = '#ffffff';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = '#6d28d9';
    ctx.fillText(text, x, y);
}

function renderCard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (templateImg.complete && templateImg.naturalWidth !== 0) {
        ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
    }
    const centerX = canvas.width / 2;
    
    // Draw inputs
    const nameStr = (nameInput.value).toUpperCase();
    if (nameStr) {
        const nameLines = nameStr.split('\n');
        let nameY = 410;
        if (nameLines.length > 1) nameY = 380;
        nameLines.forEach((line, i) => {
            if(line.trim()) drawOutlinedText(ctx, line.trim(), centerX, nameY + (i * 75), 65);
        });
    }
    
    const dukHeader = (dukunganHeaderInput.value).toUpperCase();
    if (dukHeader) drawOutlinedText(ctx, dukHeader, centerX, 580, 52);
    
    const dukSub = (dukunganSubInput.value).toUpperCase();
    if (dukSub) drawOutlinedTextSmall(ctx, dukSub, centerX, 640, 26);
    
    const amtStr = formatIDR(amountInput.value);
    if (amountInput.value) drawOutlinedText(ctx, amtStr, centerX, 770, 68); // Increased y from 740 to 770 to lower it
    
    const dateStr = formatIndonesianDate(dateInput.value);
    if (dateStr) {
        ctx.font = `700 24px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#1e293b';
        ctx.fillText(dateStr, centerX + 45, 860); // Added + 20 to move it slightly right
    }
}

[nameInput, dukunganHeaderInput, dukunganSubInput, dateInput, amountInput].forEach(input => {
    input.addEventListener('input', renderCard);
});

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `LAI-ThankYou-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
});

loadTemplates();
