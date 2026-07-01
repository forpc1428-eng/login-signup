import QRCode from 'qrcode';

/**
 * Generate a card image with user info and QR code
 * @param {Object} user - User object with fullName, email, id
 * @param {string} side - 'front' or 'back'
 * @returns {Promise<string>} - Data URL of the generated image
 */
export async function generateCardImage(user, side = 'front') {
  const canvas = document.createElement('canvas');
  const width = 800;
  const height = 1200;
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Dark background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0A0A0F');
  gradient.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Accent gradient overlay
  const accentGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
  accentGradient.addColorStop(0, 'rgba(124, 92, 255, 0.15)');
  accentGradient.addColorStop(1, 'rgba(124, 92, 255, 0)');
  ctx.fillStyle = accentGradient;
  ctx.fillRect(0, 0, width, height);

  if (side === 'front') {
    // Minimal member card branding
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MEMBER CARD', width / 2, 120);

    // Subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '24px sans-serif';
    ctx.fillText('VERIFIED', width / 2, 170);

    // User name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px sans-serif';
    const nameY = height / 2 - 80;
    ctx.fillText(user.fullName.toUpperCase(), width / 2, nameY);

    // Email
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '32px sans-serif';
    ctx.fillText(user.email, width / 2, nameY + 60);

    // UUID
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '20px monospace';
    ctx.fillText(`ID: ${user.id}`, width / 2, nameY + 120);

    // Generate QR code
    try {
      const qrSize = 280;
      const qrCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrCanvas, user.email, {
        width: qrSize,
        margin: 2,
        color: {
          dark: '#ffffff',
          light: '#0A0A0F'
        }
      });
      
      const qrX = (width - qrSize) / 2;
      const qrY = height - qrSize - 80;
      
      // QR background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);
      
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
      
      // QR label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '18px sans-serif';
      ctx.fillText('SCAN FOR CONTACT', width / 2, qrY - 35);
    } catch (error) {
      console.error('QR generation failed:', error);
    }

    // Decorative line
    ctx.strokeStyle = 'rgba(124, 92, 255, 0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 220);
    ctx.lineTo(width - 100, 220);
    ctx.stroke();

  } else {
    // Back side
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MEMBER CARD', width / 2, 200);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '24px sans-serif';
    ctx.fillText('Secure sign in', width / 2, 260);

    // Features list
    const features = [
      '✓ Google Sheets Database',
      '✓ SHA-256 Encryption',
      '✓ Real-time Validation',
      '✓ Session Persistence'
    ];

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'left';
    
    const startY = 450;
    features.forEach((feature, index) => {
      ctx.fillText(feature, 120, startY + (index * 70));
    });

    // Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    const issueDate = new Date(user.createdAt).toLocaleDateString();
    ctx.fillText(`Issued: ${issueDate}`, width / 2, height - 100);

    // Decorative elements
    ctx.strokeStyle = 'rgba(124, 92, 255, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.strokeRect(50 + i * 2, 300 + i * 2, width - 100 - i * 4, 450 - i * 4);
    }
  }

  return canvas.toDataURL('image/png');
}
