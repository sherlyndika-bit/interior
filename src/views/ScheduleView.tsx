import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InstallationSchedule } from '../types';
import { formatDate } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { Calendar, Truck, Wrench, CheckCircle2, Plus, MapPin, Phone, User, Clock, Image, ArrowRight } from 'lucide-react';

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
    { status: 'Scheduled', title: 'Terjadwal Pengiriman', color: 'border-blue-500/40 bg-blue-950/20 text-blue-300', icon: Calendar },
    { status: 'In Transit', title: 'Dalam Perjalanan Driver', color: 'border-amber-500/40 bg-amber-950/20 text-amber-300', icon: Truck },
    { status: 'In Progress', title: 'Proses Fitting di Site', color: 'border-purple-500/40 bg-purple-950/20 text-purple-300', icon: Wrench },
    { status: 'Installed', title: 'Selesai & BAST Terbit', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300', icon: CheckCircle2 }
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-amber-400" />
            Jadwal Pengiriman & Instalasi Site
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Papan Kanban tugas armada logistik & tim teknisi instalasi di lokasi klien.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
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
              <div className={`p-3 rounded-xl border ${col.color} flex items-center justify-between`}>
                <div className="flex items-center gap-2 font-bold text-xs">
                  <ColIcon className="w-4 h-4" />
                  <span>{col.title}</span>
                </div>
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800">
                  {items.length}
                </span>
              </div>

              {/* Column Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="glass-card p-4 rounded-xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono font-bold text-amber-400 text-xs">{item.orderNumber}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {formatDate(item.scheduledDate)}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-xs">{item.customerName}</h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-amber-400" />
                        <span>{item.phone}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-start gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item.address}</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                      <strong className="text-amber-400 block">Tim Teknisi:</strong>
                      {item.assignedTeam.join(', ')}
                    </div>

                    {item.notes && (
                      <p className="text-[10px] text-slate-400 italic">
                        Catatan: "{item.notes}"
                      </p>
                    )}

                    {item.completionPhoto && (
                      <img src={item.completionPhoto} alt="Foto Hasil Fitting" className="w-full h-24 object-cover rounded-lg border border-slate-800" />
                    )}

                    {/* Stage Transition Selector */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Ubah Status:</span>
                      <select
                        value={item.status}
                        onChange={(e) => updateScheduleStatus(item.id, e.target.value as any)}
                        className="p-1 rounded bg-slate-950 border border-slate-800 text-[10px] text-amber-300 font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Transit">In Transit</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Installed">Installed</option>
                      </select>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-600">
                    Kosong
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Schedule Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Buat Jadwal Pengiriman & Instalasi Baru"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleCreate} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Pilih Pesanan Klien</label>
              <select
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              >
                {orders.map(o => (
                  <option key={o.id} value={o.id}>{o.orderNumber} - {o.customerName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Tanggal Rencana Instalasi</label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Tim Teknisi Ditugaskan</label>
              <input
                type="text"
                required
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Rudi (Teknisi 1) + Randi (Driver)"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Catatan Peralatan / Petunjuk Site</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Bawa tangga lipat 3M & silicone"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Simpan Jadwal
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
