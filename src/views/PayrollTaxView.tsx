import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDate } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { DollarSign, Percent, Tag, ShieldCheck, Users, Plus, CheckCircle2, FileText, Settings, Award } from 'lucide-react';

export const PayrollTaxView: React.FC = () => {
  const {
    employees,
    payrolls,
    taxSetting,
    promos,
    generatePayroll,
    markPayrollPaid,
    updateTaxSetting,
    addPromo,
    togglePromo,
    addEmployee
  } = useApp();

  const [activeTab, setActiveTab] = useState<'payroll' | 'tax' | 'promos'>('payroll');

  // New Payroll Modal
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [period, setPeriod] = useState('2026-07');
  const [bonus, setBonus] = useState<number>(500000);
  const [deductions, setDeductions] = useState<number>(150000);

  // Tax form state
  const [enablePPN, setEnablePPN] = useState(taxSetting.enablePPN);
  const [ppnRate, setPpnRate] = useState(taxSetting.ppnRate);
  const [enablePPh21, setEnablePPh21] = useState(taxSetting.enablePPh21);
  const [npwp, setNpwp] = useState(taxSetting.companyNPWP);
  const [compName, setCompName] = useState(taxSetting.companyName);

  // New Promo form state
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoType, setPromoType] = useState<'fixed' | 'percentage'>('fixed');
  const [promoVal, setPromoVal] = useState<number>(500000);
  const [promoMinSpend, setPromoMinSpend] = useState<number>(10000000);

  const handleGeneratePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    generatePayroll(selectedEmpId, period, bonus, deductions);
    setIsPayrollModalOpen(false);
  };

  const handleSaveTax = (e: React.FormEvent) => {
    e.preventDefault();
    updateTaxSetting({
      ...taxSetting,
      enablePPN,
      ppnRate,
      enablePPh21,
      companyNPWP: npwp,
      companyName: compName
    });
  };

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode) return;
    addPromo({
      id: `prm-${Date.now()}`,
      code: promoCode.toUpperCase(),
      description: promoDesc,
      type: promoType,
      value: promoVal,
      minSpend: promoMinSpend,
      validUntil: '2026-12-31',
      isActive: true
    });
    setIsPromoModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-amber-400" />
            Penggajian Karyawan, Pajak & Kode Promo
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola gaji staff + komisi proyek, konfigurasi PPN 11% & voucher diskon pelanggan.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'payroll' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Penggajian Staff
          </button>
          <button
            onClick={() => setActiveTab('tax')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'tax' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pengaturan Pajak
          </button>
          <button
            onClick={() => setActiveTab('promos')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'promos' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Voucher Promo
          </button>
        </div>
      </div>

      {/* Tab 1: Payroll Section */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Daftar Slip Penggajian Periode Berjalan
            </h2>
            <button
              onClick={() => setIsPayrollModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Hitung Gaji Periode Baru</span>
            </button>
          </div>

          <div className="glass-panel border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Periode</th>
                  <th className="px-4 py-3">Karyawan & Jabatan</th>
                  <th className="px-4 py-3">Gaji Pokok</th>
                  <th className="px-4 py-3">Komisi Proyek</th>
                  <th className="px-4 py-3">Bonus & Tunjangan</th>
                  <th className="px-4 py-3">Gaji Bersih (THP)</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-amber-400">{p.period}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{p.employeeName}</div>
                      <div className="text-[10px] text-slate-400">{p.employeeRole}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">{formatRupiah(p.baseSalary)}</td>
                    <td className="px-4 py-3 font-mono text-emerald-400">+{formatRupiah(p.commissionAmount)}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">+{formatRupiah(p.allowance + p.bonus)}</td>
                    <td className="px-4 py-3 font-mono font-extrabold text-white text-sm">{formatRupiah(p.netSalary)}</td>
                    <td className="px-4 py-3 text-right">
                      {p.status === 'Paid' ? (
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                          LUNAS ({formatDate(p.paymentDate || '')})
                        </span>
                      ) : (
                        <button
                          onClick={() => markPayrollPaid(p.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg"
                        >
                          Bayar Gaji
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Tax Settings */}
      {activeTab === 'tax' && (
        <div className="max-w-2xl mx-auto glass-panel bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-4 text-xs">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            Konfigurasi Pajak PPN & PPh 21 Perusahaan
          </h2>

          <form onSubmit={handleSaveTax} className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Aktifkan PPN 11% pada Faktur/Invoice</span>
                  <span className="text-[10px] text-slate-400">Pajak Pertambahan Nilai ditambahkan otomatis saat transaksi.</span>
                </div>
                <input
                  type="checkbox"
                  checked={enablePPN}
                  onChange={(e) => setEnablePPN(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {enablePPN && (
                <div className="pt-2">
                  <label className="block text-slate-400 font-semibold mb-1">Tarif PPN (%)</label>
                  <input
                    type="number"
                    value={ppnRate}
                    onChange={(e) => setPpnRate(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Hitung Potongan PPh 21 Gaji Karyawan</span>
                  <span className="text-[10px] text-slate-400">Potong PPh 21 sebesar 5% pada simulasi slip penggajian.</span>
                </div>
                <input
                  type="checkbox"
                  checked={enablePPh21}
                  onChange={(e) => setEnablePPh21(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nomor NPWP Perusahaan</label>
                <input
                  type="text"
                  value={npwp}
                  onChange={(e) => setNpwp(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nama Resmi Badan Usaha</label>
                <input
                  type="text"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
            >
              Simpan Pengaturan Pajak
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Promos Manager */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Voucher & Kode Promo Pelanggan
            </h2>
            <button
              onClick={() => setIsPromoModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kode Promo Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promos.map((p) => (
              <div key={p.id} className="glass-card p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-mono font-extrabold text-amber-400 text-sm bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                    {p.code}
                  </span>
                  <h3 className="font-bold text-white text-xs mt-2">{p.description}</h3>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Nilai Diskon: {p.type === 'fixed' ? formatRupiah(p.value) : `${p.value}%`} • Min. Belanja: {formatRupiah(p.minSpend)}
                  </div>
                </div>

                <button
                  onClick={() => togglePromo(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    p.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {p.isActive ? 'AKTIF' : 'NONAKTIF'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Payroll Modal */}
      {isPayrollModalOpen && (
        <Modal
          isOpen={isPayrollModalOpen}
          onClose={() => setIsPayrollModalOpen(false)}
          title="Hitung Slip Penggajian Staff"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleGeneratePayroll} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Pilih Karyawan</label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} - {e.role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Periode Bulan (YYYY-MM)</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Bonus Tambahan (IDR)</label>
              <input
                type="number"
                value={bonus}
                onChange={(e) => setBonus(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Potongan BPJS / Kasbon (IDR)</label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsPayrollModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
              >
                Generate Slip Gaji
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Promo Modal */}
      {isPromoModalOpen && (
        <Modal
          isOpen={isPromoModalOpen}
          onClose={() => setIsPromoModalOpen(false)}
          title="Tambah Voucher Promo Baru"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAddPromo} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Kode Voucher Promo</label>
              <input
                type="text"
                required
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="PROMOJULI"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Keterangan Promo</label>
              <input
                type="text"
                required
                value={promoDesc}
                onChange={(e) => setPromoDesc(e.target.value)}
                placeholder="Diskon Kitchen Set Rp 500rb"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Jenis Potongan</label>
              <select
                value={promoType}
                onChange={(e) => setPromoType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="fixed">Nominal Tetap (Rp)</option>
                <option value="percentage">Persentase (%)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Nilai Diskon</label>
              <input
                type="number"
                required
                value={promoVal}
                onChange={(e) => setPromoVal(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Minimal Pembelian (IDR)</label>
              <input
                type="number"
                required
                value={promoMinSpend}
                onChange={(e) => setPromoMinSpend(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsPromoModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
              >
                Simpan Promo
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
