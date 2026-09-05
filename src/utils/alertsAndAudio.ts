import { HealthEvent } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a refined, luxurious crystal chime / harmonic bell
 * using Web Audio API synthesis (no external audio assets needed).
 */
export function playLuxuryChime(type: 'gentle' | 'reminder' | 'success' = 'reminder') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'success') {
      // Harmonic chord C5 -> G5 -> C6
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0, now + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 1.0);
      });
    } else if (type === 'gentle') {
      // Warm gong / singing bowl chime
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, now); // 432 Hz healing tone
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(864, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 1.8);
      osc2.stop(now + 1.8);
    } else {
      // Luxury alert chime: Two tone crystal bell (A5 -> E6)
      const tones = [880, 1318.5];
      tones.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.16);

        gain.gain.setValueAtTime(0, now + i * 0.16);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.16 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.16 + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.16);
        osc.stop(now + i * 0.16 + 1.5);
      });
    }
  } catch (err) {
    console.warn('Audio playback error (browser user gesture may be needed):', err);
  }
}

/**
 * Generates and downloads an RFC 5545 .ics Calendar file for an event or collection of events
 */
export function exportToICS(events: HealthEvent[], filename = 'NutriPet_Agenda.ics') {
  if (!events || events.length === 0) return;

  const formatDateToICS = (dateStr: string, timeStr = '09:00'): string => {
    // dateStr: YYYY-MM-DD, timeStr: HH:MM
    const [year, month, day] = dateStr.split('-');
    const [hours, mins] = timeStr.split(':');
    return `${year}${month}${day}T${hours || '09'}${mins || '00'}00`;
  };

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Recetas Caseras para Mascotas//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Agenda Salud & Nutrición de Mascotas',
    'X-WR-TIMEZONE:Europe/Madrid',
  ];

  events.forEach((evt) => {
    const dtStart = formatDateToICS(evt.date, evt.time);
    const dtEnd = formatDateToICS(evt.date, addMinutesToTime(evt.time || '09:00', 30));
    const uid = `petrecetas-${evt.id}-${Date.now()}@recetasmascotas.local`;

    icsLines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatDateToICS(new Date().toISOString().split('T')[0], '00:00')}Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:🐾 [Nutrición] ${evt.petName}: ${evt.title}`,
      `DESCRIPTION:${(evt.dosage ? `Dosis/Detalle: ${evt.dosage}\\n` : '') + (evt.notes ? `Notas: ${evt.notes}\\n` : '') + `Categoría: ${evt.category}`}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:Recordatorio: ${evt.title}`,
      'TRIGGER:-PT15M',
      'END:VALARM',
      'END:VEVENT'
    );
  });

  icsLines.push('END:VCALENDAR');

  const icsBlob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(icsBlob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  const [h, m] = (timeStr || '09:00').split(':').map(Number);
  const total = (h * 60 + m + minutesToAdd) % 1440;
  const newH = String(Math.floor(total / 60)).padStart(2, '0');
  const newM = String(total % 60).padStart(2, '0');
  return `${newH}:${newM}`;
}

/**
 * Creates a direct Google Calendar web link for 1-click addition
 */
export function getGoogleCalendarUrl(evt: HealthEvent): string {
  const [year, month, day] = evt.date.split('-');
  const [hours, mins] = (evt.time || '09:00').split(':');
  const startIso = `${year}${month}${day}T${hours}${mins}00`;
  const [endHours, endMins] = addMinutesToTime(evt.time || '09:00', 30).split(':');
  const endIso = `${year}${month}${day}T${endHours}${endMins}00`;

  const title = encodeURIComponent(`🐾 [Nutrición] ${evt.petName}: ${evt.title}`);
  const details = encodeURIComponent(
    `${evt.dosage ? `Dosis: ${evt.dosage}\n` : ''}${evt.notes ? `Notas: ${evt.notes}\n` : ''}Plan de Nutrición y Recetas Caseras.`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=Casa`;
}
