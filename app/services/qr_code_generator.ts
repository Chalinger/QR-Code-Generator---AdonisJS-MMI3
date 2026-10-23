import type QrCode from '#models/qr_code'
import QRCode, { type QRCodeErrorCorrectionLevel } from 'qrcode'

/**
 * Génère l'image PNG d'un QR code sous forme de data URL
 * ("data:image/png;base64,…"), utilisable directement dans <img src>
 * pour l'afficher et dans <a href download> pour la télécharger.
 *
 * L'image n'est jamais stockée : elle se recalcule à partir des colonnes
 * du QR code. Le paramètre width permet de demander un petit aperçu
 * (historique) au lieu de l'image en taille réelle.
 */
export async function generateQrCodeDataUrl(qrCode: QrCode, width: number = qrCode.size) {
  return QRCode.toDataURL(qrCode.content, {
    width,
    margin: 2,
    // La colonne est un simple string pour TypeScript ; le validateur
    // garantit qu'elle vaut L, M, Q ou H.
    errorCorrectionLevel: qrCode.errorCorrection as QRCodeErrorCorrectionLevel,
    color: { dark: qrCode.foregroundColor, light: qrCode.backgroundColor },
  })
}
