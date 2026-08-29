import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HealthEvent, EventCategory } from '../types';
import { EVENT_CATEGORIES } from '../data/mockData';
import { exportToICS, getGoogleCalendarUrl, playLuxuryChime } from '../utils/alertsAndAudio';
import { 
  CalendarDays, 
  Plus, 
  Check, 
  Trash2, 
  Bell, 
  Volume2, 
  Download, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon,
  Filter
} from 'lucide-react';

export const AgendaScreen: React.FC = () => {
  const { 
    events, 
    addEvent, 
    toggleEventCompleted, 
    deleteEvent, 
    triggerAlarmTest, 
    pets, 
    selectedPetId,
    showToast 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPetFilter, setSelectedPetFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [formPetId, setFormPetId] = useState(selectedPetId);
  const [category, setCategory] = useState<EventCategory>('medication');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [dosage, setDosage] = useState('');
  const [notes, setNotes] = useState('');
  const [alarmSound, setAlarmSound] = useState(true);
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('daily');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetPet = pets.find(p => p.id === formPetId) || pets[0];

    addEvent({
      petId: targetPet.id,
      petName: targetPet.name,
      title: title.trim(),
      category,
      date,
      time,
      dosage: dosage.trim() || undefined,
      notes: notes.trim() || undefined,
      alarmSound,
      recurrence,
    });

    setTitle('');
    setDosage('');
    setNotes('');
    setShowAddForm(false);
  };

  const filteredEvents = events.filter(e => {
    const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesPet = selectedPetFilter === 'all' || e.petId === selectedPetFilter;
    return matchesCat && matchesPet;
  });

  const pendingCount = events.filter(e => !e.completed).length;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white to-stone-50 dark:from-[#121B15] dark:to-[#0A0F0D] border border-stone-200 dark:border-[#D4AF37]/30 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 mb-2">
              <CalendarDays className="w-3.5 h-3.5" />
              Gestión Médica & Hábitos Diarios
            </div>
            <h1 className="font-editorial text-3xl font-bold text-stone-900 dark:text-[#F3E5AB]">
              Agenda & Avisos de Salud
            </h1>
            <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 max-w-xl font-medium">
              Recordatorios sonoros para pastillas, tomas de agua/caldos, citas veterinarias y paseos. Sincronización instantánea con Google Calendar.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                exportToICS(events);
                showToast('Archivo de calendario .ics descargado.', 'success');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors shadow-xs"
              title="Exportar a formato iCalendar (.ics)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar .ICS</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 dark:bg-[#D4AF37] dark:hover:bg-[#E5C358] text-white dark:text-stone-950 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuevo Aviso</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Event Form Modal / Expandable Card */}
      {showAddForm && (
        <div className="rounded-2xl p-6 bg-white dark:bg-[#121B15] border-2 border-emerald-600 dark:border-[#D4AF37] shadow-xl text-stone-900 dark:text-stone-100 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200 dark:border-stone-800">
            <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Programar Nuevo Aviso o Toma Médica
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 text-xs"
            >
              Cerrar
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Título del Aviso / Medicación *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Condroprotector con Caldo, Pipeta antiparasitaria..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Mascota Asignada
                </label>
                <select
                  value={formPetId}
                  onChange={(e) => setFormPetId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden"
                >
                  {pets.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.avatarIcon} {p.name} ({p.species === 'dog' ? 'Perro' : 'Gato'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden"
                >
                  {EVENT_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Fecha
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Hora
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Dosis / Posología (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. 1 comprimido masticable con 100ml caldo..."
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Frecuencia de Repetición
                </label>
                <select
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden"
                >
                  <option value="daily">Diaria (Todos los días a esta hora)</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                  <option value="once">Puntual (Una sola vez)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Notas Clínicas o Instrucciones del Veterinario
              </label>
              <textarea
                placeholder="Observaciones adicionales, temperatura de administración, etc..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-stone-700 dark:text-stone-300 font-semibold">
                <input
                  type="checkbox"
                  checked={alarmSound}
                  onChange={(e) => setAlarmSound(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
                />
                <span>Activar Alarma Sonora & Aviso Visual</span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-800 hover:bg-emerald-900 dark:bg-[#D4AF37] dark:hover:bg-[#E5C358] text-white dark:text-stone-950 transition-all shadow-md"
                >
                  Guardar Aviso
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Category & Pet Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/20 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-emerald-800 dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            Todos ({events.length})
          </button>
          {EVENT_CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === c.id
                  ? 'bg-emerald-800 dark:bg-[#D4AF37] text-white dark:text-stone-950 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Pet Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-700 dark:text-stone-300 font-semibold">Mascota:</span>
          <select
            value={selectedPetFilter}
            onChange={(e) => setSelectedPetFilter(e.target.value)}
            className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs font-semibold text-stone-800 dark:text-stone-200"
          >
            <option value="all">Todas las mascotas</option>
            {pets.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#121B15] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              No hay eventos o avisos para los filtros seleccionados.
            </p>
            <p className="text-xs mt-1">
              Pulse en "+ Nuevo Aviso" para programar una toma médica o hábito.
            </p>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const catObj = EVENT_CATEGORIES.find(c => c.id === evt.category);
            const isCompleted = evt.completed;
            const googleCalUrl = getGoogleCalendarUrl(evt);

            return (
              <div
                key={evt.id}
                className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-stone-50/70 dark:bg-[#0A0F0D]/60 border-stone-200 dark:border-stone-800/80 opacity-70'
                    : 'bg-white dark:bg-[#121B15] border-stone-200 dark:border-[#D4AF37]/25 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Left check & info */}
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleEventCompleted(evt.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-400 dark:border-stone-600 hover:border-emerald-500'
                    }`}
                  >
                    {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-[#F3E5AB]">
                        {evt.time}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-amber-500/15 text-amber-900 dark:text-[#D4AF37] border border-amber-500/30">
                        {evt.petName}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {catObj?.icon} {catObj?.label}
                      </span>
                      {evt.recurrence && evt.recurrence !== 'none' && (
                        <span className="text-[10px] text-stone-700 dark:text-stone-300">
                          ({evt.recurrence === 'daily' ? 'Diario' : evt.recurrence === 'weekly' ? 'Semanal' : 'Mensual'})
                        </span>
                      )}
                    </div>

                    <h3 className={`font-editorial text-base sm:text-lg font-bold ${
                      isCompleted 
                        ? 'line-through text-stone-600 dark:text-stone-400' 
                        : 'text-stone-900 dark:text-stone-100'
                    }`}>
                      {evt.title}
                    </h3>

                    {evt.dosage && (
                      <p className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold">
                        Posología: {evt.dosage}
                      </p>
                    )}

                    {evt.notes && (
                      <p className="text-xs text-stone-700 dark:text-stone-300 italic">
                        "{evt.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  
                  {/* Test Alarm Trigger */}
                  <button
                    onClick={() => triggerAlarmTest(evt)}
                    className="p-2 rounded-xl text-amber-700 dark:text-[#D4AF37] hover:bg-amber-500/10 transition-colors"
                    title="Probar sonido y modal de alarma en vivo"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {/* Google Calendar Link */}
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors"
                    title="Añadir a Google Calendar"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteEvent(evt.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Eliminar evento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
