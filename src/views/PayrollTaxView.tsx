import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { DollarSign, Plus, CheckCircle2, XCircle, Clock, CalendarDays } from 'lucide-react';
import { EmployeeAttendance, WorkSchedule } from '../types';

export const PayrollTaxView: React.FC = () => {
  const {
    employees,
    payrolls,
    taxSetting,
    promos,
    attendances,
    workSchedules,
    generatePayroll,
    markPayrollPaid,
    updateTaxSetting,
    addPromo,
    togglePromo,
    addAttendance,
    addWorkSchedule
  } = useApp();

  const [activeTab, setActiveTab] = useState<'payroll' | 'attendance' | 'schedule' | 'tax' | 'promos'>('payroll');

  // New Payroll Modal
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [period] = useState('2026-07');
  const [bonus, setBonus] = useState<number>(500000);
  const [manualDeductions, setManualDeductions] = useState<number>(0);

  // Tax & HR Policy form state
  const [enablePPN, setEnablePPN] = useState(taxSetting.enablePPN);
  const [ppnRate, setPpnRate] = useState(taxSetting.ppnRate);
  const [enablePPh21, setEnablePPh21] = useState(taxSetting.enablePPh21);
  const [npwp, setNpwp] = useState(taxSetting.companyNPWP);
  const [compName, setCompName] = useState(taxSetting.companyName);
  const [latePenaltyFee, setLatePenaltyFee] = useState(taxSetting.latePenaltyFee || 50000);
  const [absencePenaltyFee, setAbsencePenaltyFee] = useState(taxSetting.absencePenaltyFee || 150000);

  // New Promo form state
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoType, setPromoType] = useState<'fixed' | 'percentage'>('fixed');
  const [promoVal, setPromoVal] = useState<number>(500000);
  const [promoMinSpend, setPromoMinSpend] = useState<number>(10000000);

  // Attendance Form state
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attEmpId, setAttEmpId] = useState(employees[0]?.id || '');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attCheckIn, setAttCheckIn] = useState('08:00');
  const [attCheckOut, setAttCheckOut] = useState('17:00');
  const [attStatus, setAttStatus] = useState<EmployeeAttendance['status']>('Hadir');
  const [attIsLate, setAttIsLate] = useState(false);
  const [attNotes, setAttNotes] = useState('');

  // Schedule Form state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schEmpId, setSchEmpId] = useState(employees[0]?.id || '');
  const [schShiftName, setSchShiftName] = useState<WorkSchedule['shiftName']>('Pagi');
  const [schStartTime, setSchStartTime] = useState('08:00');
  const [schEndTime, setSchEndTime] = useState('17:00');

  const handleGeneratePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    generatePayroll(selectedEmpId, period, bonus, manualDeductions);
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
      companyName: compName,
      latePenaltyFee,
      absencePenaltyFee
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

  const handleAddAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(emp => emp.id === attEmpId);
    if (!emp) return;
    
    addAttendance({
      id: `att-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      date: attDate,
      checkIn: attStatus === 'Hadir' ? attCheckIn : undefined,
      checkOut: attStatus === 'Hadir' ? attCheckOut : undefined,
      status: attStatus,
      isLate: attIsLate,
      notes: attNotes
    });
    setIsAttendanceModalOpen(false);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(emp => emp.id === schEmpId);
    if (!emp) return;

    addWorkSchedule({
      id: `ws-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      shiftName: schShiftName,
      startTime: schStartTime,
      endTime: schEndTime,
      workDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] // Defaulting for now
    });
    setIsScheduleModalOpen(false);
  };

  const tabClass = (tab: string) => `px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
    activeTab === tab
      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm'
      : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
  }`;

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            Manajemen HR, Gaji & Pajak
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manajemen jadwal shift, absensi, slip gaji, pajak perusahaan, dan kode voucher promo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setActiveTab('attendance')} className={tabClass('attendance')}>Absensi</button>
          <button onClick={() => setActiveTab('schedule')} className={tabClass('schedule')}>Jadwal Shift</button>
          <button onClick={() => setActiveTab('payroll')} className={tabClass('payroll')}>Penggajian</button>
          <button onClick={() => setActiveTab('tax')} className={tabClass('tax')}>Pajak & Kebijakan</button>
          <button onClick={() => setActiveTab('promos')} className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'promos'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}>Voucher Diskon</button>
        </div>
      </div>

      {/* TAB 1: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Rekapitulasi Absensi Karyawan</h2>
            <button
              onClick={() => setIsAttendanceModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Clock className="w-4 h-4" /> Catat Manual
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
              <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium uppercase text-[10px]">
                <tr>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Karyawan</th>
                  <th className="p-4">Jam Masuk</th>
                  <th className="p-4">Jam Keluar</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {attendances.map((a) => (
                  <tr key={a.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/60 transition-colors">
                    <td className="p-4 font-mono">{a.date}</td>
                    <td className="p-4 font-bold text-zinc-900 dark:text-white">{a.employeeName}</td>
                    <td className="p-4 font-mono">{a.checkIn || '-'}</td>
                    <td className="p-4 font-mono">{a.checkOut || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.status === 'Hadir' && !a.isLate ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' :
                        a.isLate ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' :
                        'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                      }`}>
                        {a.status === 'Hadir' && a.isLate ? 'Hadir (Telat)' : a.status}
                      </span>
                    </td>
                    <td className="p-4">{a.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Jadwal Shift Kerja Karyawan</h2>
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <CalendarDays className="w-4 h-4" /> Atur Shift Baru
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
              <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium uppercase text-[10px]">
                <tr>
                  <th className="p-4">Karyawan</th>
                  <th className="p-4">Nama Shift</th>
                  <th className="p-4">Jam Kerja</th>
                  <th className="p-4">Hari Kerja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {workSchedules.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/60 transition-colors">
                    <td className="p-4 font-bold text-zinc-900 dark:text-white">{s.employeeName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {s.shiftName}
                      </span>
                    </td>
                    <td className="p-4 font-mono">{s.startTime} - {s.endTime}</td>
                    <td className="p-4 text-[11px] text-zinc-500 dark:text-zinc-400">{s.workDays.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYROLL */}
      {activeTab === 'payroll' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Catatan Gaji & Komisi Staff</h2>
            <button
              onClick={() => setIsPayrollModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" /> Generate Gaji Bulan Ini
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
              <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium uppercase text-[10px]">
                <tr>
                  <th className="p-4">Karyawan</th>
                  <th className="p-4">Periode</th>
                  <th className="p-4">Gaji Pokok</th>
                  <th className="p-4">Komisi+Bonus</th>
                  <th className="p-4">Potongan Total</th>
                  <th className="p-4">Gaji Bersih</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {payrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/60 transition-colors">
                    <td className="p-4 font-bold text-zinc-900 dark:text-white">{p.employeeName}</td>
                    <td className="p-4 font-mono text-zinc-500 dark:text-zinc-400">{p.period}</td>
                    <td className="p-4 font-mono">{formatRupiah(p.baseSalary)}</td>
                    <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400">+{formatRupiah(p.commissionAmount + p.bonus)}</td>
                    <td className="p-4 font-mono text-rose-600 dark:text-rose-400">-{formatRupiah(p.deductions)}</td>
                    <td className="p-4 font-mono font-bold text-zinc-900 dark:text-white">{formatRupiah(p.netSalary)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase ${
                        p.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30' : 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                      }`}>
                        {p.status === 'Paid' ? 'Lunas' : p.status === 'Approved' ? 'Disetujui' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {p.status !== 'Paid' && (
                        <button onClick={() => markPayrollPaid(p.id)} className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500">Tandai Cair ✓</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TAX & HR POLICY */}
      {activeTab === 'tax' && (
        <form onSubmit={handleSaveTax} className="max-w-xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">Pengaturan Pajak & Kebijakan HR</h2>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Nama Perusahaan / PT</label>
              <input type="text" value={compName} onChange={e => setCompName(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Nomor NPWP Perusahaan</label>
              <input type="text" value={npwp} onChange={e => setNpwp(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white font-mono" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="font-bold text-zinc-900 dark:text-white block">Aktifkan PPN 11% Otomatis</span>
                <span className="text-zinc-400 text-[11px]">PPN akan otomatis dihitung pada setiap Invoice & POS checkout</span>
              </div>
              <input type="checkbox" checked={enablePPN} onChange={e => setEnablePPN(e.target.checked)} className="w-4 h-4 accent-zinc-900 dark:accent-white" />
            </div>
            
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
              <h3 className="font-bold text-zinc-900 dark:text-white">Kebijakan Pemotongan Kehadiran (HR)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Denda Terlambat (Rp / Hari)</label>
                  <input type="number" value={latePenaltyFee} onChange={e => setLatePenaltyFee(Number(e.target.value))} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white font-mono" />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Denda Alpa (Rp / Hari)</label>
                  <input type="number" value={absencePenaltyFee} onChange={e => setAbsencePenaltyFee(Number(e.target.value))} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white font-mono" />
                </div>
              </div>
              <p className="text-[10px] text-zinc-500">Pemotongan akan dihitung otomatis saat pembuatan slip gaji berdasarkan rekapan absensi bulan terkait.</p>
            </div>

            <button type="submit" className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl">Simpan Pengaturan</button>
          </div>
        </form>
      )}

      {/* TAB 5: PROMO VOUCHERS */}
      {activeTab === 'promos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Daftar Kode Voucher Diskon</h2>
            <button onClick={() => setIsPromoModalOpen(true)} className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs">+ Buat Kode Promo</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {promos.map(p => (
              <div key={p.id} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-zinc-900 dark:text-white text-base">{p.code}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                      {p.isActive ? 'AKTIF' : 'NON-AKTIF'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">{p.description}</p>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Potongan: {p.type === 'fixed' ? formatRupiah(p.value) : `${p.value}%`}</p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <button
                    onClick={() => togglePromo(p.id)}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  >
                    {p.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAYROLL GENERATE MODAL */}
      {isPayrollModalOpen && (
        <Modal isOpen={isPayrollModalOpen} onClose={() => setIsPayrollModalOpen(false)} title="Generate Slip Gaji Staff">
          <form onSubmit={handleGeneratePayroll} className="space-y-4 text-xs text-zinc-900 dark:text-zinc-100">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Pilih Karyawan</label>
              <select value={selectedEmpId} onChange={e => setSelectedEmpId(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white">
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Bonus / Komisi Tambahan (Rp)</label>
              <input type="number" value={bonus} onChange={e => setBonus(Number(e.target.value))} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Potongan Tambahan / Kasbon (Rp)</label>
              <input type="number" value={manualDeductions} onChange={e => setManualDeductions(Number(e.target.value))} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" />
            </div>
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px]">
              *Denda telat & absen akan otomatis dihitung dan ditambahkan ke Potongan Total.
            </div>
            <button type="submit" className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl">Proses Slip Gaji</button>
          </form>
        </Modal>
      )}

      {/* ATTENDANCE MODAL */}
      {isAttendanceModalOpen && (
        <Modal isOpen={isAttendanceModalOpen} onClose={() => setIsAttendanceModalOpen(false)} title="Catat Kehadiran Karyawan">
          <form onSubmit={handleAddAttendance} className="space-y-4 text-xs text-zinc-900 dark:text-zinc-100">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Karyawan</label>
              <select value={attEmpId} onChange={e => setAttEmpId(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white">
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Tanggal</label>
              <input type="date" value={attDate} onChange={e => setAttDate(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Status Kehadiran</label>
              <select value={attStatus} onChange={e => setAttStatus(e.target.value as any)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white">
                <option value="Hadir">Hadir</option>
                <option value="Sakit">Sakit</option>
                <option value="Izin">Izin</option>
                <option value="Alpa">Alpa (Tanpa Keterangan)</option>
                <option value="Cuti">Cuti</option>
              </select>
            </div>
            
            {attStatus === 'Hadir' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Jam Masuk</label>
                    <input type="time" value={attCheckIn} onChange={e => setAttCheckIn(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Jam Keluar</label>
                    <input type="time" value={attCheckOut} onChange={e => setAttCheckOut(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white font-mono" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={attIsLate} onChange={e => setAttIsLate(e.target.checked)} className="w-4 h-4 accent-zinc-900 dark:accent-white" id="isLate" />
                  <label htmlFor="isLate" className="font-bold text-amber-600 dark:text-amber-500 cursor-pointer">Tandai Terlambat (Dikenakan Denda)</label>
                </div>
              </>
            )}

            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Catatan</label>
              <input type="text" value={attNotes} onChange={e => setAttNotes(e.target.value)} placeholder="Opsional" className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" />
            </div>

            <button type="submit" className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl">Simpan Kehadiran</button>
          </form>
        </Modal>
      )}

      {/* SCHEDULE MODAL */}
      {isScheduleModalOpen && (
        <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title="Atur Jadwal Shift Karyawan">
          <form onSubmit={handleAddSchedule} className="space-y-4 text-xs text-zinc-900 dark:text-zinc-100">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Karyawan</label>
              <select value={schEmpId} onChange={e => setSchEmpId(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white">
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Nama Shift</label>
              <select value={schShiftName} onChange={e => setSchShiftName(e.target.value as any)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white">
                <option value="Pagi">Pagi</option>
                <option value="Siang">Siang</option>
                <option value="Malam">Malam</option>
                <option value="Fleksibel">Fleksibel</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Jam Mulai</label>
                <input type="time" value={schStartTime} onChange={e => setSchStartTime(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white font-mono" />
              </div>
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Jam Selesai</label>
                <input type="time" value={schEndTime} onChange={e => setSchEndTime(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white font-mono" />
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl">Simpan Jadwal</button>
          </form>
        </Modal>
      )}

      {/* PROMO MODAL */}
      {isPromoModalOpen && (
        <Modal isOpen={isPromoModalOpen} onClose={() => setIsPromoModalOpen(false)} title="Tambah Kode Promo Baru">
          <form onSubmit={handleAddPromo} className="space-y-4 text-xs text-zinc-900 dark:text-zinc-100">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Kode Promo (Kupon)</label>
              <input type="text" required value={promoCode} onChange={e => setPromoCode(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white uppercase font-mono" placeholder="CONTOH: FITOUT500" />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Deskripsi</label>
              <input type="text" required value={promoDesc} onChange={e => setPromoDesc(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" placeholder="Diskon Potongan Langsung" />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1">Nilai Potongan (Rp)</label>
              <input type="number" required value={promoVal} onChange={e => setPromoVal(Number(e.target.value))} className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white" />
            </div>
            <button type="submit" className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl">Simpan Promo</button>
          </form>
        </Modal>
      )}
    </div>
  );
};
