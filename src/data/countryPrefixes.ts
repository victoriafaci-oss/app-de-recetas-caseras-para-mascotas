export interface CountryPrefix {
  code: string;
  name: string;
  flag: string;
  region: 'Europa' | 'América del Sur' | 'América Central y Caribe' | 'América del Norte' | 'Otros';
}

export const COUNTRY_PREFIXES: CountryPrefix[] = [
  // --- EUROPA ---
  { code: '+34', name: 'España', flag: '🇪🇸', region: 'Europa' },
  { code: '+39', name: 'Italia', flag: '🇮🇹', region: 'Europa' },
  { code: '+33', name: 'Francia', flag: '🇫🇷', region: 'Europa' },
  { code: '+49', name: 'Alemania', flag: '🇩🇪', region: 'Europa' },
  { code: '+44', name: 'Reino Unido', flag: '🇬🇧', region: 'Europa' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹', region: 'Europa' },
  { code: '+41', name: 'Suiza', flag: '🇨🇭', region: 'Europa' },
  { code: '+43', name: 'Austria', flag: '🇦🇹', region: 'Europa' },
  { code: '+32', name: 'Bélgica', flag: '🇧🇪', region: 'Europa' },
  { code: '+31', name: 'Países Bajos', flag: '🇳🇱', region: 'Europa' },
  { code: '+353', name: 'Irlanda', flag: '🇮🇪', region: 'Europa' },
  { code: '+46', name: 'Suecia', flag: '🇸🇪', region: 'Europa' },
  { code: '+47', name: 'Noruega', flag: '🇳🇴', region: 'Europa' },
  { code: '+45', name: 'Dinamarca', flag: '🇩🇰', region: 'Europa' },
  { code: '+358', name: 'Finlandia', flag: '🇫🇮', region: 'Europa' },
  { code: '+48', name: 'Polonia', flag: '🇵🇱', region: 'Europa' },
  { code: '+420', name: 'República Checa', flag: '🇨🇿', region: 'Europa' },
  { code: '+421', name: 'Eslovaquia', flag: '🇸🇰', region: 'Europa' },
  { code: '+36', name: 'Hungría', flag: '🇭🇺', region: 'Europa' },
  { code: '+30', name: 'Grecia', flag: '🇬🇷', region: 'Europa' },
  { code: '+40', name: 'Rumanía', flag: '🇷🇴', region: 'Europa' },
  { code: '+359', name: 'Bulgaria', flag: '🇧🇬', region: 'Europa' },
  { code: '+385', name: 'Croacia', flag: '🇭🇷', region: 'Europa' },
  { code: '+386', name: 'Eslovenia', flag: '🇸🇮', region: 'Europa' },
  { code: '+372', name: 'Estonia', flag: '🇪🇪', region: 'Europa' },
  { code: '+371', name: 'Letonia', flag: '🇱🇻', region: 'Europa' },
  { code: '+370', name: 'Lituania', flag: '🇱🇹', region: 'Europa' },
  { code: '+352', name: 'Luxemburgo', flag: '🇱🇺', region: 'Europa' },
  { code: '+356', name: 'Malta', flag: '🇲🇹', region: 'Europa' },
  { code: '+357', name: 'Chipre', flag: '🇨🇾', region: 'Europa' },
  { code: '+354', name: 'Islandia', flag: '🇮🇸', region: 'Europa' },
  { code: '+376', name: 'Andorra', flag: '🇦🇩', region: 'Europa' },
  { code: '+381', name: 'Serbia', flag: '🇷🇸', region: 'Europa' },
  { code: '+387', name: 'Bosnia y Herzegovina', flag: '🇧🇦', region: 'Europa' },
  { code: '+382', name: 'Montenegro', flag: '🇲🇪', region: 'Europa' },
  { code: '+389', name: 'Macedonia del Norte', flag: '🇲🇰', region: 'Europa' },
  { code: '+355', name: 'Albania', flag: '🇦🇱', region: 'Europa' },
  { code: '+380', name: 'Ucrania', flag: '🇺🇦', region: 'Europa' },
  { code: '+373', name: 'Moldavia', flag: '🇲🇩', region: 'Europa' },

  // --- AMÉRICA LATINA: AMÉRICA DEL SUR ---
  { code: '+54', name: 'Argentina', flag: '🇦🇷', region: 'América del Sur' },
  { code: '+591', name: 'Bolivia', flag: '🇧🇴', region: 'América del Sur' },
  { code: '+55', name: 'Brasil', flag: '🇧🇷', region: 'América del Sur' },
  { code: '+56', name: 'Chile', flag: '🇨🇱', region: 'América del Sur' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴', region: 'América del Sur' },
  { code: '+593', name: 'Ecuador', flag: '🇪🇨', region: 'América del Sur' },
  { code: '+595', name: 'Paraguay', flag: '🇵🇾', region: 'América del Sur' },
  { code: '+51', name: 'Perú', flag: '🇵🇪', region: 'América del Sur' },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾', region: 'América del Sur' },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪', region: 'América del Sur' },
  { code: '+592', name: 'Guyana', flag: '🇬🇾', region: 'América del Sur' },
  { code: '+597', name: 'Surinam', flag: '🇸🇷', region: 'América del Sur' },

  // --- AMÉRICA CENTRAL Y EL CARIBE ---
  { code: '+506', name: 'Costa Rica', flag: '🇨🇷', region: 'América Central y Caribe' },
  { code: '+507', name: 'Panamá', flag: '🇵🇦', region: 'América Central y Caribe' },
  { code: '+502', name: 'Guatemala', flag: '🇬🇹', region: 'América Central y Caribe' },
  { code: '+503', name: 'El Salvador', flag: '🇸🇻', region: 'América Central y Caribe' },
  { code: '+504', name: 'Honduras', flag: '🇭🇳', region: 'América Central y Caribe' },
  { code: '+505', name: 'Nicaragua', flag: '🇳🇮', region: 'América Central y Caribe' },
  { code: '+501', name: 'Belice', flag: '🇧🇿', region: 'América Central y Caribe' },
  { code: '+1809', name: 'Rep. Dominicana (809)', flag: '🇩🇴', region: 'América Central y Caribe' },
  { code: '+1829', name: 'Rep. Dominicana (829)', flag: '🇩🇴', region: 'América Central y Caribe' },
  { code: '+1849', name: 'Rep. Dominicana (849)', flag: '🇩🇴', region: 'América Central y Caribe' },
  { code: '+1787', name: 'Puerto Rico (787)', flag: '🇵🇷', region: 'América Central y Caribe' },
  { code: '+1939', name: 'Puerto Rico (939)', flag: '🇵🇷', region: 'América Central y Caribe' },
  { code: '+53', name: 'Cuba', flag: '🇨🇺', region: 'América Central y Caribe' },

  // --- AMÉRICA DEL NORTE ---
  { code: '+52', name: 'México', flag: '🇲🇽', region: 'América del Norte' },
  { code: '+1', name: 'Estados Unidos / Canadá', flag: '🇺🇸', region: 'América del Norte' },

  // --- OTROS POPULARES ---
  { code: '+61', name: 'Australia', flag: '🇦🇺', region: 'Otros' },
  { code: '+64', name: 'Nueva Zelanda', flag: '🇳🇿', region: 'Otros' },
  { code: '+81', name: 'Japón', flag: '🇯🇵', region: 'Otros' },
  { code: '+971', name: 'Emiratos Árabes', flag: '🇦🇪', region: 'Otros' },
];
