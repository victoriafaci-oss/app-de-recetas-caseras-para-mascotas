import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pet, Species, ClinicalCondition, ActivityLevel } from '../types';
import { X, Sparkles, Plus, Check, ShieldAlert, ShieldCheck } from 'lucide-react';
import { COMMON_FOOD_ALLERGENS, parseAllergens } from '../utils/allergyUtils';
import { formatLocalDateKey } from '../utils/dietPlanner';

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
  
  // Allergy section state
  const initialAllergens = parseAllergens(petToEdit?.allergies || '');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(initialAllergens);
  const [customAllergenInput, setCustomAllergenInput] = useState('');
  const [hasNoAllergies, setHasNoAllergies] = useState<boolean>(
    petToEdit?.allergies ? initialAllergens.length === 0 : false
  );

  const [avatarUrl, setAvatarUrl] = useState(petToEdit?.avatarUrl || '');
  const [avatarIcon, setAvatarIcon] = useState(petToEdit?.avatarIcon || (species === 'dog' ? '🐕' : '🐈'));
  const [bathFrequencyDays, setBathFrequencyDays] = useState(petToEdit?.bathFrequencyDays ?? (species === 'dog' ? 21 : 45));

  if (!isOpen) return null;

  const handleToggleCommonAllergen = (name: string) => {
    setHasNoAllergies(false);
    setSelectedAllergens(prev => {
      const exists = prev.some(item => item.toLowerCase() === name.toLowerCase());
      if (exists) {
        return prev.filter(item => item.toLowerCase() !== name.toLowerCase());
      } else {
        return [...prev, name];
      }
    });
  };

  const handleAddCustomAllergen = () => {
    const trimmed = customAllergenInput.trim();
    if (!trimmed) return;
    setHasNoAllergies(false);
    if (!selectedAllergens.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedAllergens(prev => [...prev, trimmed]);
    }
    setCustomAllergenInput('');
  };

  const handleRemoveAllergen = (nameToRemove: string) => {
    setSelectedAllergens(prev => prev.filter(item => item.toLowerCase() !== nameToRemove.toLowerCase()));
  };

  const handleSetNoAllergies = () => {
    setHasNoAllergies(true);
    setSelectedAllergens([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalAllergies = hasNoAllergies ? 'Ninguna' : selectedAllergens.join(', ');

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
        allergies: finalAllergies,
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
        allergies: finalAllergies,
        avatarUrl: avatarUrl.trim() || (species === 'dog' ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'),
        avatarIcon,
        avatarColor: species === 'dog' ? 'from-amber-600 to-yellow-800' : 'from-emerald-700 to-teal-900',
        bathFrequencyDays: Number(bathFrequencyDays),
        lastBathDate: formatLocalDateKey(new Date()),
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
                <option value="high_performance">⚡ Alto Rendimiento Deportivo / Competición</option>
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
                <option value="high_performance_hyperactivity">⚡ Alto Rendimiento & Perros Hiperactivos (Guía Especial)</option>
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

          {/* DEDICATED ALLERGY & FOOD INTOLERANCE SECTION */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#0E1511] border border-amber-500/25 dark:border-[#D4AF37]/30 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-[#D4AF37] shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm text-stone-900 dark:text-[#F3E5AB]">
                    Apartado de Alergias & Intolerancias Alimentarias
                  </h4>
                  <p className="text-[11px] text-stone-700 dark:text-stone-300 mt-0.5">
                    Los menús, recetas y platos diarios excluirán automáticamente cualquier alimento aquí indicado.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick status selector */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleSetNoAllergies}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  hasNoAllergies
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-xs'
                    : 'bg-white dark:bg-[#121B15] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sin alergias conocidas</span>
              </button>

              <button
                type="button"
                onClick={() => setHasNoAllergies(false)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  !hasNoAllergies
                    ? 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-[#F3E5AB] shadow-xs'
                    : 'bg-white dark:bg-[#121B15] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Tiene alergias a alimentos</span>
              </button>
            </div>

            {!hasNoAllergies && (
              <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                    Alérgenos alimentarios frecuentes (toca para seleccionar):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_FOOD_ALLERGENS.map((allergen) => {
                      const isSelected = selectedAllergens.some(
                        a => a.toLowerCase() === allergen.nameEs.toLowerCase() ||
                             allergen.keywords.some(k => a.toLowerCase() === k.toLowerCase())
                      );

                      return (
                        <button
                          key={allergen.id}
                          type="button"
                          onClick={() => handleToggleCommonAllergen(allergen.nameEs)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? 'bg-rose-500/20 border-rose-500 text-rose-800 dark:text-rose-300 shadow-xs'
                              : 'bg-white dark:bg-[#121B15] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-400'
                          }`}
                        >
                          <span>{allergen.icon}</span>
                          <span>{allergen.nameEs.split('/')[0].trim()}</span>
                          {isSelected && <Check className="w-3 h-3 text-rose-800 dark:text-rose-300 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Allergen input */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Añadir otro alimento alérgeno específico:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ej. Pato, Zanahoria, Salmón, Chía..."
                      value={customAllergenInput}
                      onChange={(e) => setCustomAllergenInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomAllergen();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomAllergen}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#B8860B] hover:bg-[#996515] text-white flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir</span>
                    </button>
                  </div>
                </div>

                {/* Active Excluded Allergens summary */}
                {selectedAllergens.length > 0 ? (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/25">
                    <span className="block text-[11px] font-bold text-rose-800 dark:text-rose-300 mb-1.5">
                      🚫 Alimentos excluidos de los menús ({selectedAllergens.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAllergens.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-white dark:bg-[#121B15] text-rose-800 dark:text-rose-300 border border-rose-500/30"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAllergen(item)}
                            className="hover:text-rose-800 text-stone-700 dark:text-stone-300 ml-1"
                            title="Quitar alérgeno"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 italic">
                    💡 No has seleccionado ningún alérgeno aún. Toca los alimentos arriba para marcarlos o escribe uno personalizado.
                  </p>
                )}
              </div>
            )}
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
