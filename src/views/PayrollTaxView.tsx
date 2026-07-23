import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { DollarSign, Plus } from 'lucide-react';

export const PayrollTaxView: React.FC = () => {
  const {
    employees,
    payrolls,
    taxSetting,
    promos,
    generatePayroll,
    markPayrollPaid,
    updateTaxSetting,
    addPromo
  } = useApp();

  const [activeTab, setActiveTab] = useState<'payroll' | 'tax' | 'promos'>('payroll');

  // New Payroll Modal
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [period] = useState('2026-07');
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
    <div className="space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-amber-300" />
            Penggajian Staff, Pajak & Promo
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-light">
            Manajemen gaji karyawan, komisi proyek fitout, tarif PPN 11%, dan kode voucher diskon.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
              activeTab === 'payroll'
                ? 'bg-white text-stone-950 font-bold shadow-md'
                : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            Penggajian Staff
          </button>

          <button
            onClick={() => setActiveTab('tax')}
            className={`px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
              activeTab === 'tax'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold shadow-md'
                : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            Pajak & NPWP
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
              activeTab === 'promos'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-md'
                : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            Voucher Diskon
          </button>
        </div>
      </div>

      {/* TAB 1: PAYROLL */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-mono uppercase tracking-widest text-amber-300">Catatan Gaji & Komisi Staff</h2>
            <button
              onClick={() => setIsPayrollModalOpen(true)}
              className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xl"
            >
              <Plus className="w-4 h-4" /> Generate Gaji Bulan Ini
            </button>
          </div>

          <div className="bg-[#0A0908] rounded-3xl border border-stone-900 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-[#050505] border-b border-stone-900 text-stone-400 font-mono text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="p-4">Karyawan</th>
                  <th className="p-4">Periode</th>
                  <th className="p-4">Gaji Pokok</th>
                  <th className="p-4">Bonus / Komisi</th>
                  <th className="p-4">Gaji Bersih</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-900">
                {payrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-950/60 transition-colors">
                    <td className="p-4 font-bold text-white">{p.employeeName}</td>
                    <td className="p-4 font-mono text-stone-400">{p.period}</td>
                    <td className="p-4 font-mono">{formatRupiah(p.baseSalary)}</td>
                    <td className="p-4 font-mono text-emerald-400">+{formatRupiah(p.commissionAmount + p.bonus)}</td>
                    <td className="p-4 font-mono font-bold text-white">{formatRupiah(p.netSalary)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase ${
                        p.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}>
                        {p.status === 'Paid' ? 'Lunas' : p.status === 'Approved' ? 'Disetujui' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {p.status !== 'Paid' && (
                        <button onClick={() => markPayrollPaid(p.id)} className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-500">Tandai Cair ✓</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TAX SETTINGS */}
      {activeTab === 'tax' && (
        <form onSubmit={handleSaveTax} className="max-w-xl mx-auto bg-[#0A0908] p-8 rounded-3xl border border-stone-900 space-y-6">
          <h2 className="text-lg font-bold text-white tracking-tight">Pengaturan Pajak & Legalitas PT</h2>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-400 mb-1">Nama Perusahaan / PT</label>
              <input type="text" value={compName} onChange={e => setCompName(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
            </div>
            <div>
              <label className="block text-stone-400 mb-1">Nomor NPWP Perusahaan</label>
              <input type="text" value={npwp} onChange={e => setNpwp(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white font-mono" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#050505] border border-stone-800">
              <span>Aktifkan PPN 11% Otomatis</span>
              <input type="checkbox" checked={enablePPN} onChange={e => setEnablePPN(e.target.checked)} className="w-4 h-4 accent-amber-400" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-white text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full">Simpan Pengaturan Pajak</button>
          </div>
        </form>
      )}

      {/* TAB 3: PROMO VOUCHERS */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-mono uppercase tracking-widest text-amber-300">Daftar Kode Voucher Diskon</h2>
            <button onClick={() => setIsPromoModalOpen(true)} className="px-4 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs">+ Buat Kode Promo</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promos.map(p => (
              <div key={p.id} className="p-6 rounded-3xl bg-[#0A0908] border border-stone-900 space-y-3">
                <span className="font-mono font-bold text-amber-300 text-base">{p.code}</span>
                <p className="text-xs text-stone-400 font-light">{p.description}</p>
                <p className="text-xs font-bold text-emerald-400">Potongan: {p.type === 'fixed' ? formatRupiah(p.value) : `${p.value}%`}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAYROLL GENERATE MODAL */}
      {isPayrollModalOpen && (
        <Modal isOpen={isPayrollModalOpen} onClose={() => setIsPayrollModalOpen(false)} title="Generate Slip Gaji Staff">
          <form onSubmit={handleGeneratePayroll} className="space-y-4 text-xs text-stone-100">
            <div>
              <label className="block text-stone-400 mb-1">Pilih Karyawan</label>
              <select value={selectedEmpId} onChange={e => setSelectedEmpId(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white">
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-stone-400 mb-1">Bonus / Komisi (Rp)</label>
              <input type="number" value={bonus} onChange={e => setBonus(Number(e.target.value))} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
            </div>
            <div>
              <label className="block text-stone-400 mb-1">Potongan / Kasbon (Rp)</label>
              <input type="number" value={deductions} onChange={e => setDeductions(Number(e.target.value))} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
            </div>
            <button type="submit" className="w-full py-3 bg-white text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full">Proses Slip Gaji</button>
          </form>
        </Modal>
      )}

      {/* PROMO MODAL */}
      {isPromoModalOpen && (
        <Modal isOpen={isPromoModalOpen} onClose={() => setIsPromoModalOpen(false)} title="Tambah Kode Promo Baru">
          <form onSubmit={handleAddPromo} className="space-y-4 text-xs text-stone-100">
            <div>
              <label className="block text-stone-400 mb-1">Kode Promo (Kupon)</label>
              <input type="text" required value={promoCode} onChange={e => setPromoCode(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white uppercase font-mono" placeholder="CONTOH: FITOUT500" />
            </div>
            <div>
              <label className="block text-stone-400 mb-1">Deskripsi</label>
              <input type="text" required value={promoDesc} onChange={e => setPromoDesc(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" placeholder="Diskon Potongan Langsung" />
            </div>
            <div>
              <label className="block text-stone-400 mb-1">Nilai Potongan (Rp)</label>
              <input type="number" required value={promoVal} onChange={e => setPromoVal(Number(e.target.value))} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
            </div>
            <button type="submit" className="w-full py-3 bg-white text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full">Simpan Promo</button>
          </form>
        </Modal>
      )}
    </div>
  );
};
