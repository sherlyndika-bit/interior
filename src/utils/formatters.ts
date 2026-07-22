export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch (e) {
    return dateStr;
  }
};

export const createWhatsAppCatalogLink = (
  phone: string = '6281298765432',
  productName: string,
  productCode: string,
  variantName?: string
): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = `Halo InteriorCraft Studio, saya tertarik untuk bertanya HARGA & estimasi proyek untuk:\n\n📌 *Produk*: ${productName}\n🏷️ *Kode*: ${productCode}${variantName ? `\n🎨 *Varian*: ${variantName}` : ''}\n\nMohon info daftar harga & konsultasi gratisnya. Terima kasih!`;
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
