const form = document.getElementById('cardForm');
const nameInput = document.getElementById('name');
const dateInput = document.getElementById('date');
const amountInput = document.getElementById('amount');
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

// Load the template image
const templateImg = new Image();
templateImg.src = 'assets/BG_1.png';
templateImg.onload = () => {
    renderCard();
};

// Function to format amount as IDR
function formatIDR(amount) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

// Function to render the card
function renderCard() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw template
    ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
    
    // Set font and color
    ctx.font = 'bold 48px Arial'; // adjust as needed
    ctx.fillStyle = '#000000'; // black
    ctx.textAlign = 'center';
    
    // Static text
    const staticText = 'LAI mengucapkan terimakasih kepada...';
    ctx.fillText(staticText, canvas.width / 2, 200); // position
    
    // Name
    const name = nameInput.value || 'Nama Donor';
    ctx.font = 'bold 60px Arial';
    ctx.fillText(name, canvas.width / 2, 300);
    
    // Date
    const date = dateInput.value ? new Date(dateInput.value).toLocaleDateString('id-ID') : 'Tanggal';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(date, canvas.width / 2, 400);
    
    // Amount
    const amount = amountInput.value ? formatIDR(amountInput.value) : 'Rp 0';
    ctx.fillText(amount, canvas.width / 2, 500);
}

// Event listeners
[nameInput, dateInput, amountInput].forEach(input => {
    input.addEventListener('input', renderCard);
});

// Download
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'thank-you-card.png';
    link.href = canvas.toDataURL();
    link.click();
});