import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Pet, Species, ClinicalCondition, ActivityLevel } from '../types';
import { 
  X, 
  Sparkles, 
  Plus, 
  Check, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  AlertTriangle, 
  ShieldCheck, 
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { COMMON_FOOD_ALLERGENS, extractPetAllergens } from '../data/allergensData';
import { compressImageFile } from '../utils/imageUpload';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  petToEdit?: Pet;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose, petToEdit }) => {
  const { addPet, updatePet, language, showToast } = useApp();

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
  
  // Allergens state
  const initialAllergens = petToEdit?.allergensList && petToEdit.allergensList.length > 0 
    ? petToEdit.allergensList 
    : extractPetAllergens(petToEdit?.allergies);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(initialAllergens);
  const [customAllergenInput, setCustomAllergenInput] = useState('');
  const [allergyNotes, setAllergyNotes] = useState('');

  // Avatar & Photo state
  const [avatarUrl, setAvatarUrl] = useState(petToEdit?.avatarUrl || '');
  const [avatarIcon, setAvatarIcon] = useState(petToEdit?.avatarIcon || (species === 'dog' ? '🐕' : '🐈'));
  const [bathFrequencyDays, setBathFrequencyDays] = useState(petToEdit?.bathFrequencyDays ?? (species === 'dog' ? 21 : 45));
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const toggleAllergen = (allergenId: string) => {
    setSelectedAllergens(prev => 
      prev.includes(allergenId) 
        ? prev.filter(id => id !== allergenId)
        : [...prev, allergenId]
    );
  };

  const handleAddCustomAllergen = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customAllergenInput.trim();
    if (!clean) return;
    if (!selectedAllergens.some(a => a.toLowerCase() === clean.toLowerCase())) {
      setSelectedAllergens(prev => [...prev, clean]);
    }
    setCustomAllergenInput('');
  };

  const removeAllergen = (item: string) => {
    setSelectedAllergens(prev => prev.filter(a => a !== item));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const compressedDataUrl = await compressImageFile(file, 800, 0.85);
      setAvatarUrl(compressedDataUrl);
      showToast(
        language === 'es' ? '¡Foto subida con éxito desde tu galería!' : 'Photo uploaded successfully from gallery!',
        'success'
      );
    } catch (err: any) {
      console.error('Error al subir imagen:', err);
      showToast(
        err?.message || (language === 'es' ? 'Error al procesar la imagen' : 'Error processing image'),
        'warning'
      );
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Compile allergies string from selected tags and notes
    const formattedAllergies = [
      ...selectedAllergens,
      ...(allergyNotes.trim() ? [allergyNotes.trim()] : [])
    ].join(', ');

    if (petToEdit) {
      updatePet(petToEdit.id, {
        name: name.trim(),
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
        allergies: formattedAllergies,
        allergensList: selectedAllergens,
        avatarUrl: avatarUrl.trim(),
        avatarIcon,
        bathFrequencyDays: Number(bathFrequencyDays),
      });
      showToast(
        language === 'es' ? `Perfil de ${name} actualizado correctamente` : `${name}'s profile updated successfully`,
        'success'
      );
    } else {
      addPet({
        name: name.trim(),
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
        allergies: formattedAllergies,
        allergensList: selectedAllergens,
        avatarUrl: avatarUrl.trim() || (species === 'dog' ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80' : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'),
        avatarIcon,
        avatarColor: species === 'dog' ? 'from-amber-600 to-yellow-800' : 'from-emerald-700 to-teal-900',
        bathFrequencyDays: Number(bathFrequencyDays),
        lastBathDate: new Date().toISOString().split('T')[0],
      });
      showToast(
        language === 'es' ? `¡Bienvenido/a ${name}! Perfil registrado` : `Welcome ${name}! Profile created`,
        'success'
      );
    }
    onClose();
  };

  const sampleIcons = species === 'dog' ? ['🐕', '🦮', '🐩', '🐾', '👑'] : ['🐈', '🐈‍⬛', '🦁', '🐾', '👑'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl my-6 rounded-3xl p-5 sm:p-7 bg-white dark:bg-[#121B15] border border-stone-200 dark:border-[#D4AF37]/30 shadow-2xl text-stone-900 dark:text-stone-100 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-[#D4AF37]/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B8860B]/15 dark:bg-[#D4AF37]/20 border border-[#B8860B]/30 flex items-center justify-center text-[#B8860B] dark:text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-900 dark:text-[#F3E5AB]">
                {petToEdit 
                  ? (language === 'es' ? `Editar Perfil de ${petToEdit.name}` : `Edit Profile for ${petToEdit.name}`)
                  : (language === 'es' ? 'Registrar Nueva Mascota' : 'Register New Pet')}
              </h3>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">
                Personalización completa de foto, nutrición RER/MER y control estricto de alergias.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5 text-xs">
          
          {/* ========================================================================= */}
          {/* SECTION: PHOTO UPLOAD FROM GALLERY & CAMERA                               */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#0A0F0D] border border-stone-200 dark:border-stone-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#B8860B] dark:text-[#D4AF37]" />
                <span>Foto de la Mascota (Subir desde Galería):</span>
              </label>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="text-[11px] text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Quitar foto</span>
                </button>
              )}
            </div>

            {/* Hidden File Input for Gallery / Camera */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Photo Preview Avatar Box */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden p-1 bg-gradient-to-br from-amber-500 via-[#D4AF37] to-emerald-600 shadow-md shrink-0 transition-transform hover:scale-105"
                title={language === 'es' ? 'Toca para abrir la galería de tu teléfono' : 'Tap to open your phone gallery'}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name || 'Mascota'}
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-900 rounded-[14px] flex flex-col items-center justify-center text-stone-400 gap-1">
                    <span className="text-3xl">{avatarIcon}</span>
                    <span className="text-[9px] text-stone-300 font-semibold">Tocar para foto</span>
                  </div>
                )}
                
                {/* Hover/Tap Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-semibold transition-opacity rounded-[14px] backdrop-blur-2xs">
                  <Camera className="w-5 h-5 mb-0.5 text-[#F3E5AB]" />
                  <span>Cambiar</span>
                </div>
              </div>

              {/* Upload Action Buttons */}
              <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="px-4 py-2.5 rounded-xl font-bold bg-[#B8860B] dark:bg-[#D4AF37] text-white dark:text-stone-950 hover:bg-[#996515] dark:hover:bg-[#E5C358] transition-all shadow-xs flex items-center gap-2 text-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingPhoto ? 'Procesando...' : 'Elegir Foto de la Galería'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlField(!showUrlField)}
                    className="px-3 py-2 rounded-xl font-medium border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Pegar URL</span>
                    {showUrlField ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Formatos JPG, PNG o HEIC desde tu móvil. Se comprime y optimiza automáticamente.
                </p>

                {/* Optional URL input */}
                {showUrlField && (
                  <div className="pt-2 animate-in fade-in duration-200">
                    <input
                      type="url"
                      placeholder="https://ejemplo.com/foto-mascota.jpg"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#121B15] text-stone-900 dark:text-stone-100 focus:outline-hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Alternative Avatar Emoji Selector */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="text-[11px] text-stone-600 dark:text-stone-400">
                Icono alternativo (si no subes foto):
              </span>
              <div className="flex items-center gap-1.5">
                {sampleIcons.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setAvatarIcon(ic)}
                    className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center border transition-all cursor-pointer ${
                      avatarIcon === ic
                        ? 'border-[#B8860B] dark:border-[#D4AF37] bg-amber-500/20 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION: BASIC IDENTITY                                                  */}
          {/* ========================================================================= */}
          <div>
            <label className="block font-bold mb-1.5 text-stone-700 dark:text-stone-300">
              Especie Fisiológica:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSpecies('dog');
                  if (!avatarUrl && avatarIcon === '🐈') setAvatarIcon('🐕');
                  setBathFrequencyDays(21);
                }}
                className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  species === 'dog'
                    ? 'border-[#B8860B] dark:border-[#D4AF37] bg-[#B8860B]/10 dark:bg-[#D4AF37]/15 text-[#B8860B] dark:text-[#F3E5AB] shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                <span className="text-lg">🐕</span>
                <span>Canino (Perro)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSpecies('cat');
                  if (!avatarUrl && avatarIcon === '🐕') setAvatarIcon('🐈');
                  setBathFrequencyDays(45);
                }}
                className={`py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  species === 'cat'
                    ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                <span className="text-lg">🐈</span>
                <span>Felino (Gato)</span>
              </button>
            </div>
          </div>

          {/* Name & Breed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Nombre de la Mascota: *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Charlie, Luna, Simba..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Raza o Cruce:
              </label>
              <input
                type="text"
                placeholder={species === 'dog' ? 'Ej. Golden Retriever, Mestizo...' : 'Ej. Siamés, Común Europeo...'}
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Age & Sex */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Años:
              </label>
              <input
                type="number"
                min="0"
                max="25"
                value={ageYears}
                onChange={(e) => setAgeYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Meses:
              </label>
              <input
                type="number"
                min="0"
                max="11"
                value={ageMonths}
                onChange={(e) => setAgeMonths(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Sexo:
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full px-2.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              >
                <option value="male">Macho</option>
                <option value="female">Hembra</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Esterilizado:
              </label>
              <button
                type="button"
                onClick={() => setIsNeutered(!isNeutered)}
                className={`w-full py-2 px-2 rounded-xl font-bold border transition-all text-xs cursor-pointer ${
                  isNeutered
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                {isNeutered ? '✓ Sí' : 'No'}
              </button>
            </div>
          </div>

          {/* Weight & Body Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Peso Actual (kg):
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="100"
                value={weightKg}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWeightKg(val);
                  if (!petToEdit) setTargetWeightKg(val);
                }}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Peso Meta (kg):
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="100"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                Condición Corporal (1-9)
              </label>
              <select
                value={bodyConditionScore}
                onChange={(e) => setBodyConditionScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
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
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
              >
                <option value="sedentary">Sedentario / Interior / Reposo</option>
                <option value="moderate">Moderado (Paseos estándar)</option>
                <option value="active">Activo (Senderismo / Agility / Juego)</option>
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
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
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

          {/* ========================================================================= */}
          {/* SECTION: ALERGIAS E INTOLERANCIAS ALIMENTARIAS (PRIMORDIAL REQUIREMENT)   */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-[#0E1712] border border-amber-500/30 dark:border-[#D4AF37]/30 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900 dark:text-[#F3E5AB]">
                    Alergias e Intolerancias Alimentarias (Excluir de los Menús):
                  </h4>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    Marca o escribe los alimentos prohibidos. Los menús diarios los sustituirán automáticamente por fuentes seguras.
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 shrink-0">
                Filtro Activo
              </span>
            </div>

            {/* Quick Common Allergen Chips to Toggle */}
            <div>
              <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1.5">
                Alérgenos frecuentes (toca para marcar):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_FOOD_ALLERGENS.map((allg) => {
                  const isSelected = selectedAllergens.includes(allg.id);
                  return (
                    <button
                      key={allg.id}
                      type="button"
                      onClick={() => toggleAllergen(allg.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/60 shadow-xs'
                          : 'bg-white dark:bg-[#121B15] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-500/50'
                      }`}
                    >
                      <span>{allg.icon}</span>
                      <span>{allg.nameEs.split('/')[0].trim()}</span>
                      {isSelected && <Check className="w-3 h-3 text-rose-600 dark:text-rose-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Allergen Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Añadir otro ingrediente prohibido (Ej. Cerdo, Calabaza, Conejo...)"
                value={customAllergenInput}
                onChange={(e) => setCustomAllergenInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomAllergen();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#121B15] text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37]"
              />
              <button
                type="button"
                onClick={() => handleAddCustomAllergen()}
                className="px-3 py-1.5 rounded-xl font-bold bg-stone-800 dark:bg-stone-700 text-white hover:bg-stone-900 dark:hover:bg-stone-600 transition-colors flex items-center gap-1 text-xs shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>

            {/* Active Selected Allergens List */}
            {selectedAllergens.length > 0 ? (
              <div className="pt-2 border-t border-amber-500/20">
                <span className="text-[11px] font-bold text-rose-800 dark:text-rose-400 block mb-1.5">
                  Restricciones activas de {name || 'la mascota'}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAllergens.map((alg) => {
                    const matchedDef = COMMON_FOOD_ALLERGENS.find(d => d.id === alg);
                    const label = matchedDef ? matchedDef.nameEs : alg;
                    return (
                      <span
                        key={alg}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30 shadow-2xs"
                      >
                        {matchedDef?.icon || '⚠️'} {label}
                        <button
                          type="button"
                          onClick={() => removeAllergen(alg)}
                          className="p-0.5 hover:bg-rose-500/20 rounded-full transition-colors ml-0.5 cursor-pointer"
                          title="Eliminar alérgeno"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sin alergias registradas por ahora. Dieta libre de restricciones.</span>
              </p>
            )}

            {/* Additional allergy observations */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                Detalles clínicos o notas de intolerancia (opcional):
              </label>
              <input
                type="text"
                placeholder="Ej. Sensibilidad estomacal a grasas altas, vómitos con pollo..."
                value={allergyNotes}
                onChange={(e) => setAllergyNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden"
              />
            </div>
          </div>

          {/* Bath frequency */}
          <div>
            <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
              Frecuencia de baño recomendada (días):
            </label>
            <input
              type="number"
              min="7"
              max="180"
              value={bathFrequencyDays}
              onChange={(e) => setBathFrequencyDays(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#0A0F0D] text-stone-900 dark:text-stone-100 focus:outline-hidden"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-[#D4AF37]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors font-medium text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-[#B8860B] dark:bg-[#D4AF37] hover:bg-[#996515] dark:hover:bg-[#E5C358] text-white dark:text-stone-950 transition-all shadow-md flex items-center gap-2 text-xs cursor-pointer"
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
