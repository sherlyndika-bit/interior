import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InstallationSchedule } from '../types';
import { formatDate } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { Calendar, Truck, Wrench, CheckCircle2, Plus } from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { schedules, addSchedule, updateScheduleStatus, orders } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Schedule State
  const [orderId, setOrderId] = useState(orders[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState('2026-07-28');
  const [timeSlot, setTimeSlot] = useState('09:00 - 15:00 WIB');
  const [team, setTeam] = useState('Rudi Hartono (Lead) + Sujatno (Fitting)');
  const [notes, setNotes] = useState('Bawa bor beton & silicone sealant transparan.');

  const columns: { status: InstallationSchedule['status']; title: string; color: string; icon: any }[] = [
    { status: 'Scheduled', title: 'Terjadwal Pengiriman', color: 'border-blue-500/30 bg-blue-500/10 text-blue-300', icon: Calendar },
    { status: 'In Transit', title: 'Dalam Perjalanan Driver', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300', icon: Truck },
    { status: 'In Progress', title: 'Proses Fitting di Site', color: 'border-purple-500/30 bg-purple-500/10 text-purple-300', icon: Wrench },
    { status: 'Installed', title: 'Selesai & BAST Terbit', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300', icon: CheckCircle2 }
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const ord = orders.find(o => o.id === orderId);
    if (!ord) return;

    const newSch: InstallationSchedule = {
      id: `sch-${Date.now()}`,
      orderId: ord.id,
      orderNumber: ord.orderNumber,
      customerName: ord.customerName,
      phone: ord.customerPhone,
      address: ord.installationAddress || ord.customerAddress,
      scheduledDate,
      timeSlot,
      assignedTeam: team.split('+').map(t => t.trim()),
      status: 'Scheduled',
      notes
    };

    addSchedule(newSch);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16 text-stone-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-amber-300" />
            Jadwal Pengiriman & Instalasi Lapangan
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-light">
            Kanban pemantauan armada logistik & tim pertukangan di lokasi proyek klien.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Jadwalkan Instalasi Baru</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const items = schedules.filter(s => s.status === col.status);
          const ColIcon = col.icon;

          return (
            <div key={col.status} className="space-y-4">
              {/* Column Header */}
              <div className={`p-4 rounded-3xl border ${col.color} flex items-center justify-between`}>
                <div className="flex items-center gap-2 font-bold text-xs">
                  <ColIcon className="w-4 h-4" />
                  <span>{col.title}</span>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-stone-950 border border-stone-800">
                  {items.length}
                </span>
              </div>

              {/* Column Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-[#0A0908] border border-stone-900 space-y-3 hover:border-stone-700 transition-all shadow-xl"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono font-bold text-amber-300 text-xs">{item.orderNumber}</span>
                      <span className="text-[10px] font-mono text-stone-400 bg-[#050505] px-2.5 py-1 rounded-full border border-stone-800">
                        {formatDate(item.scheduledDate)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-white text-sm">{item.customerName}</h4>
                      <p className="text-xs text-stone-400 font-light line-clamp-2">{item.address}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#050505] border border-stone-900 text-[11px] text-stone-400 space-y-1">
                      <p><strong className="text-white">Tim:</strong> {item.assignedTeam.join(', ')}</p>
                      <p><strong className="text-white">Slot:</strong> {item.timeSlot}</p>
                    </div>

                    {/* Stage Transition Selector */}
                    <div className="pt-2 border-t border-stone-900 flex justify-end gap-1 text-[11px]">
                      {col.status === 'Scheduled' && (
                        <button onClick={() => updateScheduleStatus(item.id, 'In Transit')} className="px-3 py-1 rounded-full bg-stone-900 text-amber-300 hover:bg-stone-800">Mulai Transit ➔</button>
                      )}
                      {col.status === 'In Transit' && (
                        <button onClick={() => updateScheduleStatus(item.id, 'In Progress')} className="px-3 py-1 rounded-full bg-stone-900 text-purple-300 hover:bg-stone-800">Fitting Site ➔</button>
                      )}
                      {col.status === 'In Progress' && (
                        <button onClick={() => updateScheduleStatus(item.id, 'Installed')} className="px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 font-bold">Terbitkan BAST ✓</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW SCHEDULE MODAL */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Jadwalkan Pemasangan Baru">
          <form onSubmit={handleCreate} className="space-y-4 text-xs text-stone-100">
            <div>
              <label className="block text-stone-400 mb-1">Pilih Nomor Pesanan / Klien</label>
              <select value={orderId} onChange={e => setOrderId(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white">
                {orders.map(o => (
                  <option key={o.id} value={o.id}>{o.orderNumber} — {o.customerName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-stone-400 mb-1">Tanggal Rencana Pemasangan</label>
              <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="w-full p-3 bg-[#050505] border border-stone-800 rounded-2xl text-white" />
            </div>
            <button type="submit" className="w-full py-3 bg-white text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full">Simpan Jadwal</button>
          </form>
        </Modal>
      )}
    </div>
  );
};
