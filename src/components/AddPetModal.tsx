import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pet, Species, ClinicalCondition, ActivityLevel } from '../types';
import { X, Sparkles, Plus, Check } from 'lucide-react';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  petToEdit?: Pet;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose, petToEdit }) => {
  const { addPet, updatePet, language } = useApp();

  const [name, setName] = useState(petToEdit?.name || '');
  const [species, setSpecies] = useState<Species>(petToEdit?.species || 'dog');
  const [breed, setBreed] = useState(petToEdit?.breed || '');
  const [ageYears, setAgeYears] = useState(petToEdit?.ageYears ?? 3);
  const [ageMonths, setAgeMonths] = useState(petToEdit?.ageMonths ?? 0);
  const [gender, setGender] = useState<'male' | 'female'>(petToEdit?.gender || 'male');
  const [isNeutered, setIsNeutered] = useState(petToEdit?.isNeutered ?? true);
  const [weightKg, setWeightKg] = useState(petToEdit?.weightKg ?? 12);
  const [targetWeightKg, setTargetWeightKg] = useState(petToEdit?.targetWeightKg ?? 12);
  const [bodyConditionScore, setBodyConditionScore] = useState(petToEdit?.bodyConditionScore ?? 5);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(petToEdit?.activityLevel || 'moderate');
  const [clinicalCondition, setClinicalCondition] = useState<ClinicalCondition>(petToEdit?.clinicalCondition || 'healthy');
  const [allergies, setAllergies] = useState(petToEdit?.allergies || '');
  const [avatarUrl, setAvatarUrl] = useState(petToEdit?.avatarUrl || '');
  const [avatarIcon, setAvatarIcon] = useState(petToEdit?.avatarIcon || (species === 'dog' ? '🐕' : '🐈'));
  const [bathFrequencyDays, setBathFrequencyDays] = useState(petToEdit?.bathFrequencyDays ?? (species === 'dog' ? 21 : 45));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (petToEdit) {
      updatePet(petToEdit.id, {
        name,
        species,
        breed: breed.trim() || (species === 'dog' ? 'Mestizo noble' : 'Común Europeo'),
        ageYears: Number(ageYears),
        ageMonths: Number(ageMonths),
        gender,
        isNeutered,
        weightKg: Number(weightKg),
        targetWeightKg: Number(targetWeightKg),
        bodyConditionScore: Number(bodyConditionScore),
        activityLevel,
        clinicalCondition,
        allergies,
        avatarUrl: avatarUrl.trim(),
        avatarIcon,
        bathFrequencyDays: Number(bathFrequencyDays),
      });
    } else {
      addPet({
        name,
        species,
        breed: breed.trim() || (species === 'dog' ? 'Mestizo noble' : 'Común Europeo'),
        ageYears: Number(ageYears),
        ageMonths: Number(ageMonths),
        gender,
        isNeutered,
        weightKg: Number(weightKg),
        targetWeightKg: Number(targetWeightKg),
        bodyConditionScore: Number(bodyConditionScore),
        activityLevel,
        clinicalCondition,
        allergies,
        avatarUrl: avatarUrl.trim() || (species === 'dog' ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'),
        avatarIcon,
        avatarColor: species === 'dog' ? 'from-amber-600 to-yellow-800' : 'from-emerald-700 to-teal-900',
        bathFrequencyDays: Number(bathFrequencyDays),
        lastBathDate: new Date().toISOString().split('T')[0],
      });
    }
    onClose();
  };

  const sampleIcons = species === 'dog' ? ['🐕', '🦮', '🐩', '🐾', '👑'] : ['🐈', '🐈‍⬛', '🦁', '🐾', '👑'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl my-8 rounded-2xl p-6 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/30 shadow-2xl text-stone-900 dark:text-stone-100 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-[#D4AF37]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-[#F3E5AB]">
                {petToEdit 
                  ? (language === 'es' ? `Editar Perfil de ${petToEdit.name}` : `Edit Profile for ${petToEdit.name}`)
                  : (language === 'es' ? 'Crear Nuevo Perfil de Mascota' : 'Create New Pet Profile')}
              </h3>
              <p className="text-[11px] text-stone-700 dark:text-stone-300 font-medium">
                Cálculo de nutrición de precisión RER/MER y seguimiento clínico.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          {/* Species Selector */}
          <div>
            <label className="block font-bold mb-1.5 text-stone-700 dark:text-stone-300">
              Especie Fisiológica:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSpecies('dog');
                  if (!avatarIcon || avatarIcon === '🐈') setAvatarIcon('🐕');
                }}
                className={`py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border font-bold text-xs transition-all ${
                  species === 'dog'
                    ? 'bg-amber-600/15 border-amber-600 text-amber-900 dark:text-[#D4AF37] dark:bg-amber-950/40 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
                }`}
              >
                <span className="text-base">🐕</span> Canino (Perro)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSpecies('cat');
                  if (!avatarIcon || avatarIcon === '🐕') setAvatarIcon('🐈');
                }}
                className={`py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border font-bold text-xs transition-all ${
                  species === 'cat'
                    ? 'bg-emerald-600/15 border-emerald-600 text-emerald-900 dark:text-emerald-300 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
                }`}
              >
                <span className="text-base">🐈</span> Felino (Gato - Carnívoro Estricto)
              </button>
            </div>
          </div>

          {/* Name & Breed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Nombre de la Mascota *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Leopold, Cleo, Max..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Raza / Cruce
              </label>
              <input
                type="text"
                placeholder="Ej. Golden Retriever, Persa, Mestizo..."
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Age, Gender & Neutered */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Edad (Años)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                value={ageYears}
                onChange={(e) => setAgeYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Sexo
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              >
                <option value="male">Macho</option>
                <option value="female">Hembra</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Esterilizado
              </label>
              <select
                value={isNeutered ? 'yes' : 'no'}
                onChange={(e) => setIsNeutered(e.target.value === 'yes')}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              >
                <option value="yes">Sí (Esterilizado)</option>
                <option value="no">No (Entero)</option>
              </select>
            </div>
          </div>

          {/* Weights & Body Condition Score */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-stone-100/70 dark:bg-[#0E1511] border border-stone-200 dark:border-[#D4AF37]/20">
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Peso Actual (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="100"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] font-bold text-stone-900 dark:text-[#F3E5AB] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Peso Meta (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="100"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Condición Corporal (1-9)
              </label>
              <select
                value={bodyConditionScore}
                onChange={(e) => setBodyConditionScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              >
                <option value={3}>1-3: Delgado / Bajo peso</option>
                <option value={5}>4-5: Peso Ideal Óptimo</option>
                <option value={7}>6-7: Sobrepeso Leve/Moderado</option>
                <option value={9}>8-9: Obesidad Clínica</option>
              </select>
            </div>
          </div>

          {/* Activity & Health Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Nivel de Actividad Diaria:
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              >
                <option value="sedentary">Sedentario / Interior / Reposo</option>
                <option value="moderate">Moderado (Paseos estándar)</option>
                <option value="active">Activo (Senderismo / Agility / Juego diario)</option>
                <option value="working">Muy Activo / Deporte de trabajo</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Condición Clínica o Meta Nutricional:
              </label>
              <select
                value={clinicalCondition}
                onChange={(e) => setClinicalCondition(e.target.value as ClinicalCondition)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              >
                <option value="healthy">Sano / Mantenimiento Gourmet</option>
                <option value="renal">Soporte Renal & Fósforo Bajo</option>
                <option value="weight_loss">Control de Peso / Saciante</option>
                <option value="joint_support">Articulaciones, Colágeno & Longevidad</option>
                <option value="sensitive_digestive">Digestión Sensible & Gastroprotector</option>
                <option value="allergies">Hipoalergénico / Alergias Alimentarias</option>
                <option value="cardiac">Soporte Cardiovascular & Bajo Sodio</option>
                <option value="senior_vitality">Senior Vitality & Antioxidantes</option>
              </select>
            </div>
          </div>

          {/* Allergies / Special notes */}
          <div>
            <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
              Alergias o Intolerancias Conocidas:
            </label>
            <input
              type="text"
              placeholder="Ej. Pollo industrial, cereales con gluten, ternera..."
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
            />
          </div>

          {/* Bath frequency & Icon/Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Frecuencia recomendada de baño (días):
              </label>
              <input
                type="number"
                min="7"
                max="180"
                value={bathFrequencyDays}
                onChange={(e) => setBathFrequencyDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Icono de Avatar:
              </label>
              <div className="flex items-center gap-2">
                {sampleIcons.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setAvatarIcon(ic)}
                    className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all ${
                      avatarIcon === ic
                        ? 'border-amber-500 bg-amber-500/20 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Avatar Image URL (Optional) */}
          <div>
            <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
              URL de Foto (Opcional):
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-[#D4AF37]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-emerald-800 hover:bg-emerald-900 dark:bg-[#D4AF37] dark:hover:bg-[#E5C358] text-white dark:text-stone-950 transition-all shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {petToEdit ? 'Guardar Cambios' : 'Registrar Mascota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
