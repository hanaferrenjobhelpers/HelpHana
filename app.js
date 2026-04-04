const nameInput = document.getElementById('name');
const dateInput = document.getElementById('date');
const amountInput = document.getElementById('amount');
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

const templateImg = new Image();
// Only set anonymous if not loading from local file system to avoid tainting
// If you are using GitHub Pages, this is fine.
templateImg.src = 'assets/BG_1.png';

templateImg.onload = () => {
    console.log("Template loaded successfully");
    renderCard();
};

templateImg.onerror = (e) => {
    console.error("Failed to load template image. Error:", e);
};

function formatIDR(amount) {
    if (!amount) return 'Rp 0';
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

function formatIndonesianDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
}

function renderCard() {
    // 1. Clear everything first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. Draw template background (MUST be first)
    // Check if image is actually loaded before drawing
    if (templateImg.complete && templateImg.naturalWidth !== 0) {
        ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
    } else {
        // Fallback color if image is missing so user sees SOMETHING
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    const centerX = canvas.width / 2;
    
    // 3. Define the overlay area
    const overlayWidth = 700;
    const overlayHeight = 400;
    const overlayX = centerX - (overlayWidth / 2);
    const overlayY = 180; 
    
    // 4. Draw semi-transparent white box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    if (ctx.roundRect) {
        ctx.roundRect(overlayX, overlayY, overlayWidth, overlayHeight, 20);
    } else {
        ctx.rect(overlayX, overlayY, overlayWidth, overlayHeight);
    }
    ctx.fill();
    
    // Subtle border for the box
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    const textColor = '#1e293b';     
    const secondaryColor = '#64748b'; 
    const accentColor = '#4f46e5';    
    const fontPrimary = 'Inter, -apple-system, sans-serif';
    
    ctx.textAlign = 'center';
    
    // 5. Draw Text on top
    ctx.fillStyle = secondaryColor;
    ctx.font = `600 24px ${fontPrimary}`;
    ctx.fillText('LAI MENGUCAPKAN TERIMAKASIH KEPADA', centerX, 250);
    
    const name = (nameInput.value || 'Nama Pendana').toUpperCase();
    ctx.fillStyle = textColor;
    ctx.font = `bold 64px ${fontPrimary}`;
    ctx.fillText(name, centerX, 330);
    
    // Separator
    ctx.beginPath();
    ctx.strokeStyle = '#cbd5e1'; 
    ctx.lineWidth = 2;
    ctx.moveTo(centerX - 100, 370);
    ctx.lineTo(centerX + 100, 370);
    ctx.stroke();
    
    ctx.fillStyle = accentColor;
    ctx.font = `800 72px ${fontPrimary}`;
    ctx.fillText(formatIDR(amountInput.value), centerX, 450);
    
    const dateStr = formatIndonesianDate(dateInput.value) || formatIndonesianDate(new Date());
    ctx.fillStyle = secondaryColor;
    ctx.font = `500 28px ${fontPrimary}`;
    ctx.fillText(dateStr, centerX, 520);
}

// Live update
[nameInput, dateInput, amountInput].forEach(input => {
    input.addEventListener('input', renderCard);
});

// Download
downloadBtn.addEventListener('click', () => {
    try {
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `LAI-ThankYou-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error("Download failed:", e);
        alert("Download failed. Browsers block downloads from file:// for security. Please use a local server or GitHub Pages.");
    }
});
