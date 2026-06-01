import React, { useState, useEffect } from 'react';
import { Search, Compass, Layers, ZoomIn, Info, AlertCircle, BookOpen, ArrowLeft, MapPin, Calendar, User, Database, ChevronRight, Archive, ChevronDown, X, Home, Lock, Unlock, Eye, EyeOff, Plus, Check, Edit, FolderKanban, LogOut, Settings } from 'lucide-react';

// --- CONTRASTES DE COLOR PARA LAS FAMILIAS DINÁMICAS ---
const FAMILY_COMMONS = {
  Furnariidae: 'Horneros y Vencejos',
  Tyrannidae: 'Benteveos y Suiriríes',
  Columbidae: 'Torcazas y Palomas',
  Tinamidae: 'Perdices e Inambúes',
  Mimidae: 'Calandrias',
  Falconidae: 'Halcones y Caranchos',
  Thraupidae: 'Cardenales y Jilgueros'
};

const FAMILY_COLORS = {
  Furnariidae: 'bg-amber-700',
  Tyrannidae: 'bg-yellow-500',
  Columbidae: 'bg-slate-400',
  Tinamidae: 'bg-stone-600',
  Mimidae: 'bg-emerald-600',
  Falconidae: 'bg-red-700',
  Thraupidae: 'bg-orange-500'
};

// --- DATOS INICIALES DE ESPECÍMENES (HUEVOS - CÓRDOBA) ---
const INITIAL_SPECIMENS = [
  { 
    id: 'O-001', catalogNumber: 'OOL-1984-001', family: 'Tinamidae', species: 'Nothura maculosa', common: 'Inambú Común (Perdiz)', 
    length: 43, breadth: 30, shape: 'oval', colorCode: '#6b4c4a', pattern: 'pebbly',
    notes: 'Cáscara muy lustrosa y lisa, color vináceo oscuro. Típico de los pastizales pampeanos.', collector: 'Dr. A. Castellanos', date: '1984-11-12', location: 'Mar Chiquita, Córdoba', nest: 'Depresión en el Suelo', clutch: 5, active: true
  },
  { 
    id: 'O-002', catalogNumber: 'OOL-2015-089', family: 'Columbidae', species: 'Zenaida auriculata', common: 'Torcaza Común', 
    length: 25, breadth: 19, shape: 'elliptical', colorCode: '#ffffff', pattern: 'unmarked',
    notes: 'Huevo blanco inmaculado. Recolectado tras fuerte tormenta estival.', collector: 'E. Bucher', date: '2015-03-22', location: 'Sierras Chicas, Córdoba', nest: 'Plataforma de Ramas', clutch: 2, active: true
  },
  { 
    id: 'O-003', catalogNumber: 'OOL-1999-042', family: 'Mimidae', species: 'Mimus saturninus', common: 'Calandria Grande', clutchId: 'NID-MIM-1999-A',
    length: 28, breadth: 20, shape: 'oval', colorCode: '#d1e6d3', pattern: 'blotched',
    notes: 'Fondo verdoso pálido con manchas rojizas oscuras. Primer huevo de la nidada.', collector: 'M. Nores', date: '1999-10-15', location: 'Traslasierra, Córdoba', nest: 'Taza Abierta (Ramitas)', clutch: 4, active: true
  },
  { 
    id: 'O-003B', catalogNumber: 'OOL-1999-043', family: 'Mimidae', species: 'Mimus saturninus', common: 'Calandria Grande', clutchId: 'NID-MIM-1999-A',
    length: 27.5, breadth: 19.8, shape: 'oval', colorCode: '#cce3ce', pattern: 'blotched',
    notes: 'Segundo huevo de la misma nidada. Ligeramente más pequeño.', collector: 'M. Nores', date: '1999-10-15', location: 'Traslasierra, Córdoba', nest: 'Taza Abierta (Ramitas)', clutch: 4, active: true
  },
  { 
    id: 'O-004', catalogNumber: 'OOL-1920-112', family: 'Furnariidae', species: 'Furnarius rufus', common: 'Hornero', 
    length: 28, breadth: 21, shape: 'oval', colorCode: '#fcfcfc', pattern: 'unmarked',
    notes: 'Huevo blanco opaco clásico del ave nacional. Extraído de un nido de barro caído.', collector: 'Desconocido', date: '1920-09-10', location: 'Córdoba Capital, Córdoba', nest: 'Horno de Barro', clutch: 3, active: true
  },
  { 
    id: 'O-005', catalogNumber: 'OOL-2008-005', family: 'Falconidae', species: 'Caracara plancus', common: 'Carancho', 
    length: 59, breadth: 45, shape: 'oval', colorCode: '#e8ddc5', pattern: 'blotched',
    notes: 'Fondo ocre densamente manchado de marrón rojizo oscuro.', collector: 'R. Heredia', date: '2008-11-03', location: 'Pampa de Achala, Córdoba', nest: 'Plataforma de Ramas Altas', clutch: 2, active: true
  },
  { 
    id: 'O-006', catalogNumber: 'OOL-2010-022', family: 'Tyrannidae', species: 'Pitangus sulphuratus', common: 'Benteveo Común', 
    length: 28, breadth: 21, shape: 'oval', colorCode: '#fdf6e3', pattern: 'speckled',
    notes: 'Color crema claro con pecas oscuras concentradas en el polo mayor.', collector: 'S. Salvador', date: '2010-11-18', location: 'Río Ceballos, Córdoba', nest: 'Esférico Cerrado (Pastos)', clutch: 4, active: true
  },
  { 
    id: 'O-007', catalogNumber: 'OOL-1995-104', family: 'Thraupidae', species: 'Paroaria coronata', common: 'Cardenal Copete Rojo', clutchId: 'NID-PAR-1995',
    length: 24, breadth: 17, shape: 'oval', colorCode: '#e5ecd6', pattern: 'speckled',
    notes: 'Fondo blanco verdoso intensamente salpicado de pardo y oliva. Huevo A.', collector: 'J. Navas', date: '1995-11-02', location: 'San Marcos Sierras, Córdoba', nest: 'Taza Abierta (Raíces)', clutch: 3, active: true
  },
  { 
    id: 'O-007B', catalogNumber: 'OOL-1995-105', family: 'Thraupidae', species: 'Paroaria coronata', common: 'Cardenal Copete Rojo', clutchId: 'NID-PAR-1995',
    length: 24.2, breadth: 17.1, shape: 'oval', colorCode: '#e1e8d1', pattern: 'speckled',
    notes: 'Huevo B de la nidada.', collector: 'J. Navas', date: '1995-11-02', location: 'San Marcos Sierras, Córdoba', nest: 'Taza Abierta (Raíces)', clutch: 3, active: true
  },
  { 
    id: 'O-007C', catalogNumber: 'OOL-1995-106', family: 'Thraupidae', species: 'Paroaria coronata', common: 'Cardenal Copete Rojo', clutchId: 'NID-PAR-1995',
    length: 23.8, breadth: 16.9, shape: 'oval', colorCode: '#ebf1dd', pattern: 'speckled',
    notes: 'Huevo C de la nidada.', collector: 'J. Navas', date: '1995-11-02', location: 'San Marcos Sierras, Córdoba', nest: 'Taza Abierta (Raíces)', clutch: 3, active: true
  },
  { 
    id: 'O-007D', catalogNumber: 'OOL-2005-014', family: 'Thraupidae', species: 'Paroaria coronata', common: 'Cardenal Copete Rojo', 
    length: 24.5, breadth: 17.5, shape: 'oval', colorCode: '#e5ecd6', pattern: 'speckled',
    notes: 'Huevo individual donado por un particular.', collector: 'L. Gomez', date: '2005-12-14', location: 'Cruz del Eje, Córdoba', nest: 'Taza Abierta (Raíces)', clutch: 1, active: true
  },
  { 
    id: 'O-008', catalogNumber: 'OOL-2001-055', family: 'Thraupidae', species: 'Sicalis flaveola', common: 'Jilguero Dorado', 
    length: 19, breadth: 14, shape: 'oval', colorCode: '#e8f4f8', pattern: 'speckled',
    notes: 'Huevo celeste muy pálido con pecas castañas. Encontrado en nido abandonado de hornero.', collector: 'T. Parra', date: '2001-11-11', location: 'Villa Carlos Paz, Córdoba', nest: 'Cavidad Natural (Hornero)', clutch: 4, active: true
  }
];

// --- DATOS INICIALES DE NIDADAS (CLUTCHES - CÓRDOBA) ---
const INITIAL_CLUTCHES = [
  { id: 'NID-MIM-1999-A', family: 'Mimidae', species: 'Mimus saturninus', common: 'Calandria Grande', collector: 'M. Nores', date: '1999-10-15', location: 'Traslasierra, Córdoba', nest: 'Taza Abierta (Ramitas)', clutch: 4 },
  { id: 'NID-PAR-1995', family: 'Thraupidae', species: 'Paroaria coronata', common: 'Cardenal Copete Rojo', collector: 'J. Navas', date: '1995-11-02', location: 'San Marcos Sierras, Córdoba', nest: 'Taza Abierta (Raíces)', clutch: 3 }
];

// --- COMPONENT: Reusable eBird Style Dropdown Filter ---
const FilterDropdown = ({ label, icon: Icon, value, setValue, active, onToggle, onClose }) => {
  return (
    <div className="relative font-['Open_Sans']">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-300 text-sm font-semibold ${
          active || value 
            ? 'text-[#2A5A3B] bg-[#E9F0EC] hover:bg-[#D4E2DA]' 
            : 'text-[#555555] hover:text-[#333333] hover:bg-[#EAEAEA]'
        }`}
      >
        {label}
        {value && (
          <span className="ml-1 text-xs text-white bg-[#2A5A3B] px-1.5 py-0.5 rounded truncate max-w-[80px]">
            {value}
          </span>
        )}
        <ChevronDown size={14} className={`transform transition-transform ${active ? 'rotate-180' : ''}`} />
      </button>

      {active && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose}></div>
          <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#EAEAEA] shadow-[0_10px_15px_rgba(0,0,0,0.1)] rounded-lg z-20 p-4 animate-in fade-in slide-in-from-top-2">
            <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
              Filtrar por {label}
            </label>
            <div className="relative mb-4">
              {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#555555]" size={16} />}
              <input
                type="text"
                autoFocus
                placeholder={`Buscar ${label.toLowerCase()}...`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2 bg-[#F4F6F5] border border-[#EAEAEA] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors font-['Open_Sans']`}
              />
            </div>
            <div className="flex justify-between items-center font-['Montserrat']">
              <button 
                onClick={() => { setValue(''); onClose(); }}
                className="text-xs text-[#555555] hover:text-[#E67E22] font-semibold px-2 py-1 transition-colors"
              >
                Limpiar
              </button>
              <button 
                onClick={onClose} 
                className="bg-[#2A5A3B] hover:bg-[#1f422b] text-white px-4 py-1.5 rounded-md text-sm font-bold transition-all"
              >
                Listo
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- COMPONENT: Breadcrumbs Navigation ---
const Breadcrumbs = ({ path }) => {
  return (
    <nav className="flex items-center text-sm font-semibold text-[#555555] mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide font-['Open_Sans']">
      {path.map((item, index) => {
        const Icon = item.icon;
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight size={16} className="mx-2 text-[#EAEAEA] flex-shrink-0" />}
            <button
              onClick={item.onClick}
              disabled={!item.onClick}
              className={`flex items-center gap-1.5 transition-colors ${
                item.onClick 
                  ? 'hover:text-[#E67E22] cursor-pointer' 
                  : 'text-[#333333] cursor-default'
              }`}
            >
              {Icon && <Icon size={14} className={item.onClick ? "text-[#2A5A3B]" : "text-[#E67E22]"} />}
              {item.label}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// --- COMPONENT: Comparative Scale Card ---
const ComparativeScaleCard = ({ specimen, onClick }) => {
  const PIXELS_PER_MM = 2.5; 
  const visualHeight = specimen.length * PIXELS_PER_MM;
  const visualWidth = specimen.breadth * PIXELS_PER_MM;

  let borderRadius = "50% 50% 50% 50% / 60% 60% 40% 40%"; 
  if (specimen.shape === 'pyriform') borderRadius = "50% 50% 50% 50% / 70% 70% 30% 30%";
  if (specimen.shape === 'circular') borderRadius = "50%";
  if (specimen.shape === 'elliptical') borderRadius = "50% / 50%";

  let bgImage = 'none';
  if (specimen.pattern === 'speckled' || specimen.pattern === 'pebbly') {
    bgImage = 'radial-gradient(circle at 30% 30%, rgba(0,0,0,0.1) 1px, transparent 1px)';
  } else if (specimen.pattern === 'blotched') {
    bgImage = 'radial-gradient(circle at 20% 40%, rgba(0,0,0,0.15) 3px, transparent 4px), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.1) 4px, transparent 5px)';
  }

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#EAEAEA] flex flex-col overflow-hidden transition-all duration-300 h-full ${onClick ? 'cursor-pointer hover:shadow-[0_10px_15px_rgba(0,0,0,0.1)] hover:-translate-y-1' : ''}`}
    >
      <div className="p-5 border-b border-[#EAEAEA] bg-[#F4F6F5] flex justify-between items-start">
        <div>
          <h4 className="font-bold text-[#333333] italic leading-tight text-[18px] font-['Montserrat']">{specimen.species}</h4>
          <p className="text-[13px] text-[#555555] font-semibold font-['Open_Sans'] mt-1">{specimen.common}</p>
        </div>
        <span className="text-[12px] font-bold bg-white border border-[#EAEAEA] px-2 py-1 rounded-md text-[#333333] shadow-sm whitespace-nowrap">
          {specimen.length}×{specimen.breadth}mm
        </span>
      </div>

      <div 
        className="h-64 flex items-center justify-center relative overflow-hidden bg-white"
        style={{
          backgroundImage: `
            linear-gradient(to right, #f1f5f9 1px, transparent 1px),
            linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)
          `,
          backgroundSize: `${10 * PIXELS_PER_MM}px ${10 * PIXELS_PER_MM}px`,
          backgroundPosition: 'center center'
        }}
      >
        <div className="absolute top-2 left-2 text-[10px] text-[#555555] font-mono bg-white/90 px-1.5 py-0.5 rounded shadow-sm border border-[#EAEAEA]">
          1cm²
        </div>
        
        <div 
          className="relative transition-all duration-500 shadow-xl border border-black/5"
          style={{
            width: `${visualWidth}px`, height: `${visualHeight}px`, borderRadius: borderRadius,
            backgroundColor: specimen.colorCode, backgroundImage: bgImage,
            backgroundSize: specimen.pattern === 'blotched' ? '30px 30px' : '8px 8px',
            boxShadow: 'inset -15px -15px 25px rgba(0,0,0,0.3), inset 5px 5px 15px rgba(255,255,255,0.4), 10px 10px 20px rgba(0,0,0,0.15)'
          }}
        >
          <div className="absolute top-[10%] left-[15%] w-[25%] h-[35%] bg-white/40 rounded-full blur-[6px] rotate-[-40deg]"></div>
        </div>
      </div>
      
      <div className="p-5 bg-white text-[13px] text-[#555555] border-t border-[#EAEAEA] flex items-start gap-3 mt-auto font-['Open_Sans'] leading-relaxed">
        <Info className="w-5 h-5 text-[#2A5A3B] flex-shrink-0 mt-0.5" />
        <p className="line-clamp-2">{specimen.notes}</p>
      </div>
    </div>
  );
};

// --- COMPONENT: Specimen Detail View ---
const SpecimenDetailView = ({ specimen, breadcrumbs }) => {
  const PIXELS_PER_MM = 2.5; 
  const visualHeight = specimen.length * PIXELS_PER_MM;
  const visualWidth = specimen.breadth * PIXELS_PER_MM;

  let borderRadius = "50% 50% 50% 50% / 60% 60% 40% 40%"; 
  if (specimen.shape === 'pyriform') borderRadius = "50% 50% 50% 50% / 70% 70% 30% 30%";
  if (specimen.shape === 'circular') borderRadius = "50%";
  if (specimen.shape === 'elliptical') borderRadius = "50% / 50%";

  let bgImage = 'none';
  if (specimen.pattern === 'speckled' || specimen.pattern === 'pebbly') {
    bgImage = 'radial-gradient(circle at 30% 30%, rgba(0,0,0,0.1) 1px, transparent 1px)';
  } else if (specimen.pattern === 'blotched') {
    bgImage = 'radial-gradient(circle at 20% 40%, rgba(0,0,0,0.15) 3px, transparent 4px), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.1) 4px, transparent 5px)';
  }

  return (
    <div className="bg-white rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#EAEAEA] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {breadcrumbs}
      
      <div className="flex flex-col lg:flex-row gap-10 mt-2">
        <div className="lg:w-1/3 flex flex-col items-center">
          <div 
            className="w-full h-80 flex items-center justify-center relative overflow-hidden bg-[#F4F6F5] rounded-lg border border-[#EAEAEA] mb-4"
            style={{
              backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
              backgroundSize: `${10 * PIXELS_PER_MM}px ${10 * PIXELS_PER_MM}px`,
              backgroundPosition: 'center center'
            }}
          >
            <div className="absolute top-2 left-2 text-[10px] text-[#555555] font-mono bg-white/90 px-2 py-0.5 rounded shadow-sm border border-[#EAEAEA]">Cuadrícula: 1cm²</div>
            <div 
              className="relative transition-all duration-500 shadow-xl border border-black/5"
              style={{
                width: `${visualWidth}px`, height: `${visualHeight}px`, borderRadius: borderRadius,
                backgroundColor: specimen.colorCode, backgroundImage: bgImage,
                backgroundSize: specimen.pattern === 'blotched' ? '30px 30px' : '8px 8px',
                boxShadow: 'inset -15px -15px 25px rgba(0,0,0,0.3), inset 5px 5px 15px rgba(255,255,255,0.4), 10px 10px 20px rgba(0,0,0,0.15)'
              }}
            >
              <div className="absolute top-[10%] left-[15%] w-[25%] h-[35%] bg-white/40 rounded-full blur-[6px] rotate-[-40deg]"></div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full font-['Montserrat']">
             <button className="w-full bg-[#E67E22] hover:brightness-90 text-white py-2.5 px-6 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
               <ZoomIn size={18} /> Ver Escaneo Alta Resolución
             </button>
             <button className="w-full bg-transparent border-2 border-[#2A5A3B] text-[#2A5A3B] hover:bg-[#2A5A3B] hover:text-white py-2.5 px-6 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2">
               <Database size={18} /> Descargar Metadata (DwC)
             </button>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold text-[#2A5A3B] italic font-['Montserrat'] leading-tight">{specimen.species}</h2>
              <p className="text-xl text-[#555555] font-['Open_Sans'] mt-1">{specimen.common}</p>
            </div>
            <span className="bg-[#E9F0EC] text-[#2A5A3B] text-xs font-bold font-['Open_Sans'] px-3 py-1 rounded-full border border-[#2A5A3B]/20 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#E67E22] animate-pulse"></span>
              Colección Oficial
            </span>
          </div>
          
          <p className="text-[#333333] bg-[#F4F6F5] p-5 rounded-lg border-l-4 border-[#2A5A3B] mt-4 mb-8 italic font-['Open_Sans'] leading-relaxed text-[16px]">
            "{specimen.notes}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-[14px] font-bold text-[#555555] uppercase tracking-wider mb-4 font-['Montserrat']">Evento de Colección</h3>
              <ul className="space-y-4 font-['Open_Sans'] text-[16px]">
                <li className="flex items-center gap-3 text-[#555555]"><User size={20} className="text-[#2A5A3B]" /> <span className="font-semibold text-[#333333]">{specimen.collector}</span></li>
                <li className="flex items-center gap-3 text-[#555555]"><Calendar size={20} className="text-[#2A5A3B]" /> <span>{specimen.date}</span></li>
                <li className="flex items-center gap-3 text-[#555555]"><MapPin size={20} className="text-[#2A5A3B]" /> <span>{specimen.location}</span></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-[14px] font-bold text-[#555555] uppercase tracking-wider mb-4 font-['Montserrat']">Rasgos Oológicos</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-[16px] font-['Open_Sans']">
                <div className="text-[#555555]">Dimensiones:</div><div className="font-semibold text-[#333333]">{specimen.length} × {specimen.breadth} mm</div>
                <div className="text-[#555555]">Forma:</div><div className="capitalize font-semibold text-[#333333]">{specimen.shape}</div>
                <div className="text-[#555555]">Patrón:</div><div className="capitalize font-semibold text-[#333333]">{specimen.pattern}</div>
                <div className="text-[#555555]">Nido:</div><div className="font-semibold text-[#333333]">{specimen.nest}</div>
                <div className="text-[#555555]">Nidada:</div><div className="font-semibold text-[#333333]">{specimen.clutch} huevos</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#EAEAEA]">
            <h3 className="text-[14px] font-bold text-[#555555] uppercase tracking-wider mb-3 font-['Montserrat']">Identificadores</h3>
            <div className="flex gap-4">
              <div className="bg-[#F4F6F5] border border-[#EAEAEA] px-3 py-2 rounded-md text-[13px] font-mono text-[#333333]"><span className="text-[#555555] font-sans font-bold">Nº Catálogo: </span>{specimen.catalogNumber}</div>
              <div className="bg-[#F4F6F5] border border-[#EAEAEA] px-3 py-2 rounded-md text-[13px] font-mono text-[#333333]"><span className="text-[#555555] font-sans font-bold">Familia: </span>{specimen.family}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: Taxonomic Explorer ---
const TaxonomicExplorer = ({ specimensList, familiesList }) => {
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [selectedClutch, setSelectedClutch] = useState(null);
  const [selectedSpecimen, setSelectedSpecimen] = useState(null);
  
  const [familySearch, setFamilySearch] = useState('');
  const [speciesSearch, setSpeciesSearch] = useState('');
  
  const [specimenSearch, setSpecimenSearch] = useState('');
  const [filterCollector, setFilterCollector] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const resetAllFilters = () => {
    setSpecimenSearch('');
    setFilterCollector('');
    setFilterLocation('');
    setFilterDate('');
    setActiveDropdown(null);
  };

  const goToRoot = () => {
    setSelectedFamily(null);
    setSelectedSpecies(null);
    setSelectedClutch(null);
    setSelectedSpecimen(null);
    resetAllFilters();
  };

  const goToFamily = () => {
    setSelectedSpecies(null);
    setSelectedClutch(null);
    setSelectedSpecimen(null);
    resetAllFilters();
  };

  const goToSpecies = () => {
    setSelectedClutch(null);
    setSelectedSpecimen(null);
  };

  const goToClutch = () => {
    setSelectedSpecimen(null);
  };

  // --- Dynamic calculation of families based on active specimens in current list ---
  const activeSpecimensGlobal = specimensList.filter(s => s.active);

  const dynamicFamilies = familiesList.map(fam => {
    const count = activeSpecimensGlobal.filter(s => s.family === fam.name).length;
    return { ...fam, count };
  });

  // 4. VISTA DE DETALLE DE ESPÉCIMEN (HUEVO)
  if (selectedSpecimen) {
    const path = [
      { label: 'Inicio', icon: Home, onClick: goToRoot },
      { label: selectedFamily.name, onClick: goToFamily },
      { label: selectedSpecies.species, onClick: goToSpecies },
    ];
    if (selectedClutch) {
      path.push({ label: `Nidada: ${selectedClutch.id}`, onClick: goToClutch });
    }
    path.push({ label: selectedSpecimen.catalogNumber });

    return <SpecimenDetailView specimen={selectedSpecimen} breadcrumbs={<Breadcrumbs path={path} />} />;
  }

  // 3. VISTA DE NIDADA
  if (selectedClutch) {
    const path = [
      { label: 'Inicio', icon: Home, onClick: goToRoot },
      { label: selectedFamily.name, onClick: goToFamily },
      { label: selectedSpecies.species, onClick: goToSpecies },
      { label: `Nidada: ${selectedClutch.id}` }
    ];

    const activeClutchSpecimens = selectedClutch.specimens.filter(spec => {
      const currentStatus = specimensList.find(s => s.id === spec.id);
      return currentStatus ? currentStatus.active : false;
    });

    return (
      <div className="p-8 bg-white rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#EAEAEA] animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Breadcrumbs path={path} />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-[#EAEAEA] gap-4">
          <div>
            <h2 className="text-[36px] font-bold text-[#333333] flex items-center gap-3 mt-2 font-['Montserrat']">
              <Archive className="text-[#E67E22]" size={32} />
              Nidada: {selectedClutch.id}
            </h2>
            <p className="text-[#555555] mt-2 text-[16px] font-['Open_Sans']">Recolección agrupada de la especie {selectedSpecies.species}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-[#E67E22] bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg">
              {activeClutchSpecimens.length} Huevos Activos en esta Nidada
            </div>
          </div>
        </div>

        {activeClutchSpecimens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {activeClutchSpecimens.map(specimen => (
              <div key={specimen.id} className="cursor-pointer transform transition-all duration-300">
                <ComparativeScaleCard specimen={specimen} onClick={() => setSelectedSpecimen(specimen)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#F4F6F5] rounded-lg border border-[#EAEAEA] shadow-inner font-['Open_Sans']">
            <Info className="mx-auto text-[#555555] mb-4" size={40} />
            <h3 className="text-[20px] font-bold text-[#333333] mb-2 font-['Montserrat']">Nidada vacía</h3>
            <p className="text-[#555555] text-[16px]">Todos los huevos de esta nidada han sido desactivados temporalmente por un administrador.</p>
          </div>
        )}
      </div>
    );
  }

  // 2. VISTA DE ESPECIE
  if (selectedSpecies) {
    const speciesSpecimens = specimensList.filter(s => s.species === selectedSpecies.species && s.active);
    
    const filteredSpecimens = speciesSpecimens.filter(s => {
      const matchSearch = specimenSearch === '' || 
        s.catalogNumber.toLowerCase().includes(specimenSearch.toLowerCase()) ||
        s.notes.toLowerCase().includes(specimenSearch.toLowerCase());
      const matchCollector = s.collector.toLowerCase().includes(filterCollector.toLowerCase());
      const matchLocation = s.location.toLowerCase().includes(filterLocation.toLowerCase());
      const matchDate = s.date.toLowerCase().includes(filterDate.toLowerCase());
      return matchSearch && matchCollector && matchLocation && matchDate;
    });

    const clutches = {};
    const individualSpecimens = [];

    filteredSpecimens.forEach(specimen => {
      if (specimen.clutchId) {
        if (!clutches[specimen.clutchId]) clutches[specimen.clutchId] = [];
        clutches[specimen.clutchId].push(specimen);
      } else {
        individualSpecimens.push(specimen);
      }
    });

    const isFiltered = filterCollector || filterLocation || filterDate || specimenSearch;
    
    const path = [
      { label: 'Inicio', icon: Home, onClick: goToRoot },
      { label: selectedFamily.name, onClick: goToFamily },
      { label: selectedSpecies.species }
    ];

    return (
      <div className="bg-white rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#EAEAEA] animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden">
        
        {/* Cabecera Principal */}
        <div className="px-8 pt-8 pb-4">
          <Breadcrumbs path={path} />
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mt-2">
            <div>
              <h2 className="text-[36px] font-bold text-[#2A5A3B] italic flex items-center gap-3 font-['Montserrat']">
                {selectedSpecies.species}
              </h2>
              <p className="text-[#555555] mt-1 text-[18px] font-['Open_Sans']">{selectedSpecies.common}</p>
            </div>
          </div>
        </div>

        {/* eBird Style Filter Bar */}
        <div className="bg-white border-y border-[#EAEAEA] sticky top-0 z-10">
          <div className="px-8 py-4 border-b border-[#EAEAEA] bg-[#F4F6F5]">
            <div className="relative max-w-4xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#555555]" size={20} />
              <input
                type="text"
                placeholder="Buscar por Nº de catálogo o notas de recolección..."
                value={specimenSearch}
                onChange={(e) => setSpecimenSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-[#EAEAEA] bg-white rounded-md text-[16px] focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-all shadow-sm font-['Open_Sans']"
              />
            </div>
          </div>

          <div className="px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center text-[#555555] text-sm font-['Open_Sans']">
               <Layers size={18} className="mr-2 text-[#2A5A3B]" />
               <span className="font-bold text-[#333333] mr-1">{filteredSpecimens.length}</span> resultados activos
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FilterDropdown 
                label="Lugar" icon={MapPin} 
                value={filterLocation} setValue={setFilterLocation} 
                active={activeDropdown === 'location'} 
                onToggle={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
                onClose={() => setActiveDropdown(null)}
              />
              <FilterDropdown 
                label="Fecha" icon={Calendar} 
                value={filterDate} setValue={setFilterDate} 
                active={activeDropdown === 'date'} 
                onToggle={() => setActiveDropdown(activeDropdown === 'date' ? null : 'date')}
                onClose={() => setActiveDropdown(null)}
              />
              <FilterDropdown 
                label="Recolector" icon={User} 
                value={filterCollector} setValue={setFilterCollector} 
                active={activeDropdown === 'collector'} 
                onToggle={() => setActiveDropdown(activeDropdown === 'collector' ? null : 'collector')}
                onClose={() => setActiveDropdown(null)}
              />
              
              {isFiltered && (
                <button
                  onClick={resetAllFilters}
                  className="ml-2 text-[13px] text-[#E67E22] hover:text-white bg-transparent hover:bg-[#E67E22] border border-[#E67E22] px-3 py-1.5 rounded-md font-bold transition-all uppercase tracking-wide font-['Montserrat']"
                >
                  Restablecer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contenido de la Colección */}
        <div className="p-8 bg-[#F4F6F5]/50 font-['Open_Sans']">
          {Object.keys(clutches).length > 0 && (
            <div className="mb-12">
              <h4 className="text-[14px] font-bold text-[#555555] uppercase tracking-wider mb-6 border-b border-[#EAEAEA] pb-2 font-['Montserrat']">Nidadas Documentadas</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(clutches).map(([clutchId, specimens]) => (
                  <div 
                    key={clutchId}
                    onClick={() => setSelectedClutch({ id: clutchId, specimens })}
                    className="group cursor-pointer bg-white border border-[#EAEAEA] rounded-lg p-6 hover:shadow-[0_10px_15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-[#F4F6F5] p-3 rounded-full text-[#E67E22] shadow-sm">
                        <Archive size={24} />
                      </div>
                      <span className="bg-[#E9F0EC] text-[#2A5A3B] text-[13px] font-bold px-3 py-1 rounded-full shadow-sm font-['Open_Sans']">
                        {specimens.length} huevos activos
                      </span>
                    </div>
                    <h5 className="font-bold text-[#333333] text-[18px] group-hover:text-[#E67E22] transition-colors font-['Montserrat']">Id: {clutchId}</h5>
                    <p className="text-[14px] text-[#555555] mt-2 flex items-center gap-2 font-['Open_Sans']"><Calendar size={14} className="text-[#2A5A3B]" /> {specimens[0].date}</p>
                    <p className="text-[14px] text-[#555555] mt-1 flex items-center gap-2 font-['Open_Sans']"><MapPin size={14} className="text-[#2A5A3B]" /> {specimens[0].location}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {individualSpecimens.length > 0 && (
            <div>
              <h4 className="text-[14px] font-bold text-[#555555] uppercase tracking-wider mb-6 border-b border-[#EAEAEA] pb-2 font-['Montserrat']">Huevos Individuales</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {individualSpecimens.map(specimen => (
                  <div key={specimen.id} className="cursor-pointer transform transition-all duration-300">
                    <ComparativeScaleCard specimen={specimen} onClick={() => setSelectedSpecimen(specimen)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredSpecimens.length === 0 && (
            <div className="py-20 text-center bg-white rounded-lg border border-[#EAEAEA] shadow-inner font-['Open_Sans']">
              <Search className="mx-auto text-[#555555] mb-4" size={40} />
              <h3 className="text-[20px] font-bold text-[#333333] mb-2 font-['Montserrat']">No hay resultados</h3>
              <p className="text-[#555555] text-[#16px]">Intenta ajustar los filtros o los términos de búsqueda.</p>
              <button onClick={resetAllFilters} className="mt-6 bg-[#E67E22] text-white font-bold py-2.5 px-6 rounded-md hover:brightness-90 transition-all text-sm font-['Montserrat']">
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 1. VISTA DE FAMILIA
  if (selectedFamily) {
    const familySpecimens = specimensList.filter(s => s.family === selectedFamily.name && s.active);
    
    const speciesMap = familySpecimens.reduce((acc, curr) => {
      if (!acc[curr.species]) {
        acc[curr.species] = { species: curr.species, common: curr.common, count: 0 };
      }
      acc[curr.species].count += 1;
      return acc;
    }, {});

    const speciesList = Object.values(speciesMap).filter(s => 
      s.species.toLowerCase().includes(speciesSearch.toLowerCase()) || 
      s.common.toLowerCase().includes(speciesSearch.toLowerCase())
    );
    
    const path = [
      { label: 'Inicio', icon: Home, onClick: goToRoot },
      { label: selectedFamily.name }
    ];

    return (
      <div className="p-8 bg-white rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#EAEAEA] animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Breadcrumbs path={path} />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-[#EAEAEA] gap-4 mt-2 font-['Montserrat']">
          <div>
            <h2 className="text-[36px] font-bold text-[#333333] leading-tight">
              {selectedFamily.name}
            </h2>
            <p className="text-[#555555] mt-1.5 uppercase tracking-wider text-[14px] font-bold font-['Open_Sans'] flex items-center gap-2">
               <Layers size={16} className="text-[#2A5A3B]" /> {selectedFamily.icon}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-[#2A5A3B] bg-[#E9F0EC] px-4 py-2 rounded-md font-['Montserrat']">
              {familySpecimens.length} Especímenes Activos
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className="text-[20px] font-semibold text-[#333333] flex items-center gap-2 font-['Montserrat']">
            <BookOpen size={20} className="text-[#E67E22]" /> Especies Registradas
          </h3>
          <div className="relative w-full md:w-80 font-['Open_Sans']">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#555555]" size={18} />
            <input
              type="text"
              placeholder="Buscar especie..."
              value={speciesSearch}
              onChange={(e) => setSpeciesSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-[#F4F6F5] border border-[#EAEAEA] rounded-md text-[16px] focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-all"
            />
          </div>
        </div>
        
        {speciesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-['Open_Sans']">
            {speciesList.map(sp => (
              <div 
                key={sp.species}
                onClick={() => setSelectedSpecies(sp)}
                className="group cursor-pointer p-6 bg-white rounded-lg border border-[#EAEAEA] shadow-[0_4px_6px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex justify-between items-center"
              >
                <div>
                  <h4 className="text-[20px] font-bold text-[#333333] italic group-hover:text-[#2A5A3B] transition-colors font-['Montserrat']">
                    {sp.species}
                  </h4>
                  <p className="text-[14px] text-[#555555] mt-1">{sp.common}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="text-[12px] font-bold bg-[#F4F6F5] px-3 py-1 rounded-full text-[#333333]">
                    {sp.count} huevos
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#F4F6F5] flex items-center justify-center group-hover:bg-[#E67E22] transition-colors">
                    <ChevronRight size={16} className="text-[#555555] group-hover:text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-[#F4F6F5] rounded-lg border border-[#EAEAEA] shadow-inner font-['Open_Sans']">
            <Search className="mx-auto text-[#555555] mb-4" size={32} />
            <p className="text-[#333333] font-bold text-[18px]">No se encontraron especies activas que coincidan.</p>
          </div>
        )}
      </div>
    );
  }

  // 0. VISTA RAÍZ
  const filteredFamilies = dynamicFamilies.filter(f => 
    f.count > 0 && 
    (f.name.toLowerCase().includes(familySearch.toLowerCase()) ||
    f.icon.toLowerCase().includes(familySearch.toLowerCase()))
  );

  return (
    <div className="p-8 bg-white rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#EAEAEA]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6 border-b border-[#EAEAEA] pb-8">
        <div>
          <h2 className="text-[36px] font-bold text-[#333333] flex items-center gap-3 font-['Montserrat']">
            <Compass className="text-[#E67E22]" size={36} /> Explorador Taxonómico
          </h2>
          <p className="text-[#555555] mt-3 text-[18px] font-['Open_Sans'] max-w-2xl leading-relaxed">
            Explora la colección navegando por Familia, Especie y Espécimen. Contribuyendo a la ciencia y a la conservación de aves.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto font-['Open_Sans']">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#555555]" size={18} />
            <input
              type="text"
              placeholder="Buscar familia (ej. Furnariidae)..."
              value={familySearch}
              onChange={(e) => setFamilySearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F4F6F5] border border-[#EAEAEA] rounded-md text-[16px] focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-all"
            />
          </div>
          <div className="text-[14px] font-bold text-[#2A5A3B] bg-[#E9F0EC] px-4 py-3 rounded-md whitespace-nowrap font-['Montserrat']">
            {activeSpecimensGlobal.length} Registros Activos
          </div>
        </div>
      </div>

      {filteredFamilies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFamilies.map((family) => (
            <div 
              key={family.name}
              onClick={() => { setSelectedFamily(family); setSpeciesSearch(''); }}
              className="group cursor-pointer bg-white rounded-lg border border-[#EAEAEA] shadow-[0_4px_6px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-[24px] font-bold text-[#333333] group-hover:text-[#2A5A3B] transition-colors font-['Montserrat'] leading-tight">
                      {family.name}
                    </h3>
                    <p className="text-[13px] text-[#555555] font-bold uppercase tracking-wider mt-1 font-['Open_Sans']">
                      {family.icon}
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-[#F4F6F5] font-['Open_Sans']">
                  <p className="text-[14px] font-bold text-[#555555] bg-[#F4F6F5] px-3 py-1 rounded-md">
                    {family.count} registros activos
                  </p>
                  <div className="w-10 h-10 rounded-full bg-[#F4F6F5] flex items-center justify-center group-hover:bg-[#E67E22] transition-colors">
                    <ChevronRight size={20} className="text-[#555555] group-hover:text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-[#F4F6F5] rounded-lg border border-[#EAEAEA] shadow-inner font-['Open_Sans']">
          <Search className="mx-auto text-[#555555] mb-4" size={40} />
          <h3 className="text-[20px] font-bold text-[#333333] mb-2 font-['Montserrat']">No hay resultados</h3>
          <p className="text-[#555555] text-[#16px]">No se encontraron familias activas con ese término.</p>
        </div>
      )}
    </div>
  );
};


// --- COMPONENT: Admin Panel (Curators Portal) ---
const AdminPanel = ({ specimensList, setSpecimensList, clutchesList, setClutchesList, adminTab, setAdminTab }) => {
  const [editingSpecimenId, setEditingSpecimenId] = useState(null);
  const [editingClutchId, setEditingClutchId] = useState(null);
  
  const [targetClutchForEgg, setTargetClutchForEgg] = useState(null);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorFormMessage, setErrorFormMessage] = useState('');

  // Search & Filter state for Admin Table
  const [adminSearchCatalog, setAdminSearchCatalog] = useState('');
  const [adminSearchSpecies, setAdminSearchSpecies] = useState('');
  const [adminFilterFamily, setAdminFilterFamily] = useState('');
  const [adminFilterStatus, setAdminFilterStatus] = useState('all');

  // --- Specimen Form Fields ---
  const [catalogNumber, setCatalogNumber] = useState('');
  const [family, setFamily] = useState('Furnariidae');
  const [species, setSpecies] = useState('');
  const [common, setCommon] = useState('');
  const [length, setLength] = useState('');
  const [breadth, setBreadth] = useState('');
  const [shape, setShape] = useState('oval');
  const [pattern, setPattern] = useState('unmarked');
  const [colorCode, setColorCode] = useState('#ffffff');
  const [notes, setNotes] = useState('');
  const [collector, setCollector] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [nest, setNest] = useState('');
  const [clutch, setClutch] = useState(1);
  const [clutchId, setClutchId] = useState('');

  // --- Clutch Form Fields ---
  const [clutchIdInput, setClutchIdInput] = useState('');
  const [clutchFamily, setClutchFamily] = useState('Furnariidae');
  const [clutchSpecies, setClutchSpecies] = useState('');
  const [clutchCommon, setClutchCommon] = useState('');
  const [clutchCollector, setClutchCollector] = useState('');
  const [clutchDate, setClutchDate] = useState('');
  const [clutchLocation, setClutchLocation] = useState('');
  const [clutchNest, setClutchNest] = useState('');
  const [clutchSize, setClutchSize] = useState(1);

  const filteredAdminList = specimensList.filter(s => {
    const matchesCatalog = s.catalogNumber.toLowerCase().includes(adminSearchCatalog.toLowerCase());
    const matchesSpecies = s.species.toLowerCase().includes(adminSearchSpecies.toLowerCase()) || 
                           s.common.toLowerCase().includes(adminSearchSpecies.toLowerCase());
    const matchesFamily = adminFilterFamily === '' || s.family === adminFilterFamily;
    const matchesStatus = adminFilterStatus === 'all' || 
                          (adminFilterStatus === 'active' && s.active) || 
                          (adminFilterStatus === 'inactive' && !s.active);
    
    return matchesCatalog && matchesSpecies && matchesFamily && matchesStatus;
  });

  const startEditSpecimen = (specimen) => {
    setEditingSpecimenId(specimen.id);
    setCatalogNumber(specimen.catalogNumber);
    setFamily(specimen.family);
    setSpecies(specimen.species);
    setCommon(specimen.common);
    setLength(specimen.length.toString());
    setBreadth(specimen.breadth.toString());
    setShape(specimen.shape);
    setPattern(specimen.pattern);
    setColorCode(specimen.colorCode);
    setNotes(specimen.notes);
    setCollector(specimen.collector);
    setDate(specimen.date);
    setLocation(specimen.location);
    setNest(specimen.nest);
    setClutch(specimen.clutch);
    setClutchId(specimen.clutchId || '');
    setAdminTab('add_individual');
    setErrorFormMessage('');
  };

  const startEditClutch = (clutchObj) => {
    setEditingClutchId(clutchObj.id);
    setClutchIdInput(clutchObj.id);
    setClutchFamily(clutchObj.family);
    setClutchSpecies(clutchObj.species);
    setClutchCommon(clutchObj.common);
    setClutchCollector(clutchObj.collector);
    setClutchDate(clutchObj.date);
    setClutchLocation(clutchObj.location);
    setClutchNest(clutchObj.nest);
    setClutchSize(clutchObj.clutch);
    setErrorFormMessage('');
  };

  const toggleActiveStatus = (id) => {
    setSpecimensList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, active: !item.active };
      }
      return item;
    }));
  };

  const handleSaveSpecimen = (e) => {
    e.preventDefault();

    if (!catalogNumber || !species || !common || !length || !breadth) {
      setErrorFormMessage("Por favor completa los campos científicos requeridos (*).");
      return;
    }
    setErrorFormMessage('');

    if (editingSpecimenId) {
      setSpecimensList(prev => prev.map(item => {
        if (item.id === editingSpecimenId) {
          return {
            ...item, catalogNumber, family, species, common,
            length: parseFloat(length), breadth: parseFloat(breadth),
            shape, pattern, colorCode, notes,
            collector: collector || 'Desconocido',
            date: date || new Date().toISOString().split('T')[0],
            location: location || 'No especificada',
            nest: nest || 'No especificado',
            clutch: parseInt(clutch) || 1,
            clutchId: clutchId || undefined
          };
        }
        return item;
      }));
      setSuccessMessage('¡El registro del espécimen se ha actualizado de forma exitosa!');
    } else {
      const newEgg = {
        id: 'O-' + Math.floor(Math.random() * 10000),
        catalogNumber, family, species, common,
        length: parseFloat(length), breadth: parseFloat(breadth),
        shape, pattern, colorCode, notes,
        collector: collector || 'Desconocido',
        date: date || new Date().toISOString().split('T')[0],
        location: location || 'No especificada',
        nest: nest || 'No especificado',
        clutch: parseInt(clutch) || 1,
        clutchId: clutchId || undefined,
        active: true
      };
      setSpecimensList(prev => [newEgg, ...prev]);
      setSuccessMessage('¡Huevo individual publicado exitosamente en la colección!');
    }

    setEditingSpecimenId(null);
    setAdminTab('list');
    resetSpecimenForm();
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSaveEggToClutch = (e) => {
    e.preventDefault();

    if (!catalogNumber || !length || !breadth || !targetClutchForEgg) {
      setErrorFormMessage("Por favor completa los campos requeridos para este huevo.");
      return;
    }

    const clutchData = targetClutchForEgg;

    const newEgg = {
      id: 'O-' + Math.floor(Math.random() * 10000),
      catalogNumber, family: clutchData.family, species: clutchData.species, common: clutchData.common,
      length: parseFloat(length), breadth: parseFloat(breadth),
      shape, pattern, colorCode,
      notes: notes || `Huevo de la nidada ${clutchData.id}`,
      collector: clutchData.collector, date: clutchData.date, location: clutchData.location, nest: clutchData.nest,
      clutch: clutchData.clutch, clutchId: clutchData.id, active: true
    };

    setSpecimensList(prev => [newEgg, ...prev]);
    setSuccessMessage(`¡Huevo de catálogo ${catalogNumber} agregado exitosamente a la nidada ${clutchData.id}!`);
    
    setCatalogNumber(''); setLength(''); setBreadth(''); setNotes('');
    setTargetClutchForEgg(null);
    setAdminTab('manage_clutches');

    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSaveClutch = (e) => {
    e.preventDefault();

    if (!clutchIdInput || !clutchSpecies || !clutchCommon) {
      setErrorFormMessage("Por favor completa los campos requeridos para la nidada.");
      return;
    }
    setErrorFormMessage('');

    if (editingClutchId) {
      setClutchesList(prev => prev.map(c => {
        if (c.id === editingClutchId) {
          return {
            id: clutchIdInput, family: clutchFamily, species: clutchSpecies, common: clutchCommon,
            collector: clutchCollector || 'Desconocido', date: clutchDate || new Date().toISOString().split('T')[0],
            location: clutchLocation || 'No especificada', nest: clutchNest || 'No especificado',
            clutch: parseInt(clutchSize) || 1
          };
        }
        return c;
      }));

      setSpecimensList(prev => prev.map(s => {
        if (s.clutchId === editingClutchId) {
          return {
            ...s, clutchId: clutchIdInput, family: clutchFamily, species: clutchSpecies, common: clutchCommon,
            collector: clutchCollector || 'Desconocido', date: clutchDate || new Date().toISOString().split('T')[0],
            location: clutchLocation || 'No especificada', nest: clutchNest || 'No especificado',
            clutch: parseInt(clutchSize) || 1
          };
        }
        return s;
      }));

      setSuccessMessage(`¡Nidada "${clutchIdInput}" y todos sus huevos asociados se actualizaron con éxito!`);
      setEditingClutchId(null);
    } else {
      if (clutchesList.some(c => c.id.toLowerCase() === clutchIdInput.toLowerCase())) {
        setErrorFormMessage("Ya existe una nidada con ese identificador.");
        return;
      }

      const newClutch = {
        id: clutchIdInput, family: clutchFamily, species: clutchSpecies, common: clutchCommon,
        collector: clutchCollector || 'Desconocido', date: clutchDate || new Date().toISOString().split('T')[0],
        location: clutchLocation || 'No especificada', nest: clutchNest || 'No especificado',
        clutch: parseInt(clutchSize) || 1
      };

      setClutchesList(prev => [...prev, newClutch]);
      setSuccessMessage(`¡Nidada "${clutchIdInput}" creada exitosamente! Ya puedes agregarle huevos en la lista de abajo.`);
    }

    setClutchIdInput(''); setClutchSpecies(''); setClutchCommon(''); setClutchCollector('');
    setClutchDate(''); setClutchLocation(''); setClutchNest(''); setClutchSize(1);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const cancelFamilyEdit = () => {
    setEditingClutchId(null);
    setClutchIdInput(''); setClutchSpecies(''); setClutchCommon(''); setClutchCollector('');
    setClutchDate(''); setClutchLocation(''); setClutchNest(''); setClutchSize(1);
  };

  const resetSpecimenForm = () => {
    setCatalogNumber(''); setSpecies(''); setCommon(''); setLength(''); setBreadth('');
    setNotes(''); setCollector(''); setDate(''); setLocation(''); setNest('');
    setClutch(1); setClutchId(''); setEditingSpecimenId(null); setTargetClutchForEgg(null);
    setErrorFormMessage('');
  };

  const dynamicFamilyOptions = Array.from(new Set(specimensList.map(s => s.family)));

  return (
    <div className="bg-white rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05)] border border-[#EAEAEA] p-8 animate-in fade-in duration-300">
      
      {/* Header Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#EAEAEA] pb-6 mb-8 gap-4 font-['Montserrat']">
        <div>
          <h2 className="text-3xl font-bold text-[#2A5A3B] flex items-center gap-2">
            <Unlock className="text-[#E67E22]" size={28} />
            Portal de Gestión Científica
          </h2>
          <p className="text-[#555555] text-sm mt-1 font-['Open_Sans']">Administra el inventario biológico, nidadas asociadas y visibilidad de forma centralizada.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-['Montserrat']">
          <button
            onClick={() => { setAdminTab('list'); setTargetClutchForEgg(null); resetSpecimenForm(); }}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
              adminTab === 'list' 
                ? 'bg-[#2A5A3B] text-white shadow-sm' 
                : 'bg-slate-100 hover:bg-slate-200 text-[#333333]'
            }`}
          >
            Inventario General
          </button>
          <button
            onClick={() => { setAdminTab('add_individual'); setTargetClutchForEgg(null); resetSpecimenForm(); }}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all flex items-center gap-1.5 ${
              adminTab === 'add_individual' && !editingSpecimenId
                ? 'bg-[#E67E22] text-white shadow-sm' 
                : 'bg-slate-100 hover:bg-slate-200 text-[#333333]'
            }`}
          >
            <Plus size={16} /> Cargar Huevo Individual
          </button>
          <button
            onClick={() => { setAdminTab('manage_clutches'); setTargetClutchForEgg(null); }}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all flex items-center gap-1.5 ${
              adminTab === 'manage_clutches' 
                ? 'bg-[#2A5A3B] text-white shadow-sm' 
                : 'bg-slate-100 hover:bg-slate-200 text-[#333333]'
            }`}
          >
            <FolderKanban size={16} /> Gestionar Nidadas
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-4 mb-6 flex items-center gap-2 text-sm font-semibold animate-in zoom-in-95">
          <Check size={18} className="text-emerald-600" />
          {successMessage}
        </div>
      )}

      {errorFormMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-4 mb-6 flex items-center gap-2 text-sm font-semibold animate-in zoom-in-95">
          <AlertCircle size={18} className="text-rose-600" />
          {errorFormMessage}
        </div>
      )}

      {/* --- TAB 0: MI PERFIL (Profile Editing) --- */}
      {adminTab === 'profile' && (
        <div className="max-w-2xl bg-[#F4F6F5] p-8 rounded-lg border border-[#EAEAEA] font-['Open_Sans'] animate-in fade-in duration-300">
          <h3 className="text-xl font-bold text-[#2A5A3B] mb-6 font-['Montserrat'] flex items-center gap-2">
            <User size={22} className="text-[#E67E22]" /> Configuración del Curador
          </h3>
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              setSuccessMessage("Tu perfil ha sido actualizado exitosamente."); 
              setTimeout(() => setSuccessMessage(''), 4000);
            }} 
            className="space-y-5"
          >
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Nombre Completo</label>
              <input type="text" defaultValue="Administrador Mil Aves" required className="w-full px-4 py-2.5 bg-white border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Correo Electrónico</label>
              <input type="email" defaultValue="admin@milaves.org.ar" required className="w-full px-4 py-2.5 bg-white border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Institución / Rol</label>
              <input type="text" defaultValue="Curador Principal - Colección de Oología" required className="w-full px-4 py-2.5 bg-white border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors" />
            </div>
            <div className="pt-2 border-t border-slate-200 mt-4">
              <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Nueva Contraseña (Opcional)</label>
              <input type="password" placeholder="Dejar en blanco para mantener tu contraseña actual" className="w-full px-4 py-2.5 bg-white border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors" />
            </div>
            <div className="pt-6 flex justify-end font-['Montserrat']">
              <button type="submit" className="bg-[#E67E22] hover:bg-[#d6731b] text-white font-bold py-2.5 px-8 rounded-md text-sm transition-all shadow-sm">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- FORMULARIO SUB-FLUJO: AGREGAR HUEVO A NIDADA EXISTENTE --- */}
      {targetClutchForEgg && adminTab === 'manage_clutches' && (
        <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-6 mb-8 animate-in zoom-in-95 duration-200 font-['Open_Sans']">
          <div className="flex justify-between items-center mb-4 border-b border-amber-200 pb-2">
            <h4 className="font-bold text-amber-900 flex items-center gap-2 font-['Montserrat']">
              <Archive size={18} /> Agregar Huevo a Nidada: <span className="font-mono">{targetClutchForEgg.id}</span>
            </h4>
            <button 
              onClick={() => setTargetClutchForEgg(null)}
              className="text-amber-700 hover:text-amber-900 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-xs text-amber-800 mb-4">
            El nuevo huevo heredará los siguientes datos de campo de la nidada de manera automática: 
            <strong> {targetClutchForEgg.family} — {targetClutchForEgg.species} ({targetClutchForEgg.common})</strong>. Recolector: {targetClutchForEgg.collector}. Ubicación: {targetClutchForEgg.location}.
          </p>

          <form onSubmit={handleSaveEggToClutch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-amber-900 uppercase mb-1.5 font-['Montserrat']">Nº Catálogo *</label>
              <input
                type="text"
                required
                placeholder="Ej. OOL-1995-107"
                value={catalogNumber}
                onChange={(e) => setCatalogNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-900 uppercase mb-1.5 font-['Montserrat']">Largo (mm) *</label>
              <input
                type="number"
                required
                step="0.01"
                placeholder="Largo"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-900 uppercase mb-1.5 font-['Montserrat']">Ancho (mm) *</label>
              <input
                type="number"
                required
                step="0.01"
                placeholder="Ancho"
                value={breadth}
                onChange={(e) => setBreadth(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-900 uppercase mb-1.5 font-['Montserrat']">Forma</label>
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-md text-sm focus:outline-none"
              >
                <option value="oval">Ovalada</option>
                <option value="pyriform">Piriforme</option>
                <option value="circular">Circular</option>
                <option value="elliptical">Elíptica</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-900 uppercase mb-1.5 font-['Montserrat']">Patrón</label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-md text-sm focus:outline-none"
              >
                <option value="unmarked">Liso / Sin marcas</option>
                <option value="speckled">Pecas sutiles</option>
                <option value="blotched">Manchas grandes</option>
                <option value="pebbly">Rugoso / Texturizado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-900 uppercase mb-1.5 font-['Montserrat']">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorCode}
                  onChange={(e) => setColorCode(e.target.value)}
                  className="w-10 h-8 border border-amber-300 rounded cursor-pointer"
                />
                <span className="text-xs font-mono">{colorCode}</span>
              </div>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <input
                type="text"
                placeholder="Observaciones de este huevo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-grow px-3 py-2 bg-white border border-amber-300 rounded-md text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-md text-sm whitespace-nowrap transition-colors shadow-sm"
              >
                Guardar Huevo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- TAB 1: INVENTARIO GENERAL --- */}
      {adminTab === 'list' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#F4F6F5] p-5 rounded-lg border border-[#EAEAEA] grid grid-cols-1 md:grid-cols-4 gap-4 font-['Open_Sans'] text-sm">
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Código Catálogo</label>
              <input
                type="text"
                placeholder="Ej. OOL-1984..."
                value={adminSearchCatalog}
                onChange={(e) => setAdminSearchCatalog(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Especie / Común</label>
              <input
                type="text"
                placeholder="Buscar por especie..."
                value={adminSearchSpecies}
                onChange={(e) => setAdminSearchSpecies(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Filtrar por Familia</label>
              <select
                value={adminFilterFamily}
                onChange={(e) => setAdminFilterFamily(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              >
                <option value="">Todas las familias</option>
                {dynamicFamilyOptions.map(famName => (
                  <option key={famName} value={famName}>{famName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Visibilidad</label>
              <select
                value={adminFilterStatus}
                onChange={(e) => setAdminFilterStatus(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              >
                <option value="all">Todos los registros</option>
                <option value="active">Activos / Públicos</option>
                <option value="inactive">Ocultos / Inactivos</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EAEAEA] text-xs font-bold uppercase text-[#555555] bg-slate-50 font-['Montserrat']">
                  <th className="py-3 px-4">Nº Catálogo</th>
                  <th className="py-3 px-4">Especie / Común</th>
                  <th className="py-3 px-4">Familia</th>
                  <th className="py-3 px-4">Medidas (L x A)</th>
                  <th className="py-3 px-4">Nidada (Clutch)</th>
                  <th className="py-3 px-4 text-center">Visibilidad</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA] text-sm font-['Open_Sans']">
                {filteredAdminList.length > 0 ? (
                  filteredAdminList.map(specimen => (
                    <tr key={specimen.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-slate-800">{specimen.catalogNumber}</td>
                      <td className="py-4 px-4">
                        <div className="font-bold italic text-[#2A5A3B]">{specimen.species}</div>
                        <div className="text-xs text-slate-500">{specimen.common}</div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-600">{specimen.family}</td>
                      <td className="py-4 px-4 font-mono text-xs">{specimen.length} x {specimen.breadth} mm</td>
                      <td className="py-4 px-4 font-mono text-xs text-[#E67E22]">{specimen.clutchId || 'Individual'}</td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleActiveStatus(specimen.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                            specimen.active 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200' 
                              : 'bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200'
                          }`}
                        >
                          {specimen.active ? (
                            <>
                              <Eye size={14} /> Activo
                            </>
                          ) : (
                            <>
                              <EyeOff size={14} /> Oculto
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => startEditSpecimen(specimen)}
                          className="p-2 text-slate-500 hover:text-[#E67E22] hover:bg-orange-50 rounded-full transition-all inline-flex items-center gap-1.5 text-xs font-bold font-['Montserrat']"
                          title="Editar Registro"
                        >
                          <Edit size={16} />
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-[#555555] italic">
                      No se encontraron especímenes que coincidan con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 2: CARGA / EDICIÓN INDIVIDUAL --- */}
      {adminTab === 'add_individual' && (
        <form onSubmit={handleSaveSpecimen} className="max-w-4xl space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xl font-bold text-[#333333] font-['Montserrat']">
              {editingSpecimenId ? `Modificando Registro: ${catalogNumber}` : "Registrar Huevo Individual (Carga Completa)"}
            </h3>
            {editingSpecimenId && (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                Modo Edición Activo
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Número de Catálogo *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. OOL-2026-999"
                value={catalogNumber}
                onChange={(e) => setCatalogNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Familia Taxonómica *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Furnariidae"
                value={family}
                onChange={(e) => setFamily(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Forma Geométrica
              </label>
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
              >
                <option value="oval">Ovalada</option>
                <option value="pyriform">Piriforme (Asimétrica)</option>
                <option value="circular">Circular / Esférica</option>
                <option value="elliptical">Elíptica</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Especie (Científico) *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Furnarius rufus"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm italic focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Nombre Común *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Hornero"
                value={common}
                onChange={(e) => setCommon(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Largo (mm) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0.1"
                placeholder="En mm"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Ancho (mm) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0.1"
                placeholder="En mm"
                value={breadth}
                onChange={(e) => setBreadth(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Patrón Cáscara
              </label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
              >
                <option value="unmarked">Liso / Sin marcas</option>
                <option value="speckled">Pecas sutiles</option>
                <option value="blotched">Manchas grandes</option>
                <option value="pebbly">Rugoso / Texturizado</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Color de Cáscara (Simulado)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colorCode}
                  onChange={(e) => setColorCode(e.target.value)}
                  className="w-12 h-10 border border-slate-300 rounded-md cursor-pointer animate-in fade-in"
                />
                <span className="text-xs font-mono text-slate-500 uppercase">{colorCode}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Recolector Principal
              </label>
              <input
                type="text"
                placeholder="Ej. Dr. Arturo Castellanos"
                value={collector}
                onChange={(e) => setCollector(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Fecha Colección (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Ubicación Geográfica
              </label>
              <input
                type="text"
                placeholder="Ej. Sierras Chicas, Córdoba"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Descripción del Nido
              </label>
              <input
                type="text"
                placeholder="Ej. Horno de barro en poste"
                value={nest}
                onChange={(e) => setNest(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                Tamaño de Nidada (Huevos Totales)
              </label>
              <input
                type="number"
                min="1"
                value={clutch}
                onChange={(e) => setClutch(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
                ID Nidada (Dejar vacío si es huevo suelto)
              </label>
              <input
                type="text"
                placeholder="Ej. NID-FUR-2026-A"
                value={clutchId}
                onChange={(e) => setClutchId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-2 font-['Montserrat']">
              Observaciones / Notas de Campo
            </label>
            <textarea
              rows="3"
              placeholder="Detalles de la cáscara, pigmentación o del entorno silvestre..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors font-['Open_Sans']"
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#EAEAEA] font-['Montserrat']">
            <button
              type="button"
              onClick={() => { setAdminTab('list'); resetSpecimenForm(); }}
              className="px-6 py-2 border border-slate-300 hover:bg-slate-100 rounded-md text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#E67E22] hover:bg-[#d6731b] text-white font-bold py-2 px-8 rounded-md text-sm transition-all shadow-sm"
            >
              {editingSpecimenId ? 'Guardar Cambios' : 'Publicar Registro'}
            </button>
          </div>
        </form>
      )}

      {/* --- TAB 3: CONTROL DE NIDADAS COMPLETO --- */}
      {adminTab === 'manage_clutches' && !targetClutchForEgg && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
          
          {/* Formulario de Crear o Editar Nidada */}
          <div className="bg-[#F4F6F5] p-6 rounded-lg border border-[#EAEAEA] h-fit font-['Open_Sans'] text-sm">
            <h3 className="text-lg font-bold text-[#2A5A3B] font-['Montserrat'] mb-4">
              {editingClutchId ? `Modificando Nidada: ${editingClutchId}` : 'Crear Nueva Nidada (Lote)'}
            </h3>
            
            <form onSubmit={handleSaveClutch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">ID Único de Nidada *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. NID-FUR-2026-B"
                  value={clutchIdInput}
                  disabled={!!editingClutchId}
                  onChange={(e) => setClutchIdInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22] disabled:bg-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Familia *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Furnariidae"
                    value={clutchFamily}
                    onChange={(e) => setClutchFamily(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Tamaño Nidada *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={clutchSize}
                    onChange={(e) => setClutchSize(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Especie Científico *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Furnarius rufus"
                  value={clutchSpecies}
                  onChange={(e) => setClutchSpecies(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22] italic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Nombre Común *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Hornero"
                  value={clutchCommon}
                  onChange={(e) => setClutchCommon(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Recolector</label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={clutchCollector}
                    onChange={(e) => setClutchCollector(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Fecha</label>
                  <input
                    type="date"
                    value={clutchDate}
                    onChange={(e) => setClutchDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Ubicación</label>
                <input
                  type="text"
                  placeholder="Ej. Sierras Chicas, Córdoba"
                  value={clutchLocation}
                  onChange={(e) => setClutchLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555555] uppercase mb-1.5 font-['Montserrat']">Estructura del Nido</label>
                <input
                  type="text"
                  placeholder="Ej. Horno de barro en poste"
                  value={clutchNest}
                  onChange={(e) => setClutchNest(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                />
              </div>

              <div className="pt-4 flex gap-2 font-['Montserrat']">
                {editingClutchId && (
                  <button
                    type="button"
                    onClick={cancelFamilyEdit}
                    className="flex-1 px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-md text-sm font-semibold transition-colors"
                  >
                    Descartar
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-[#E67E22] hover:bg-[#d6731b] text-white font-bold py-2 rounded-md text-sm transition-all shadow-sm"
                >
                  {editingClutchId ? 'Actualizar' : 'Crear Nidada'}
                </button>
              </div>
            </form>
          </div>

          {/* Listado de Nidadas y Añadido Rápido de Huevos */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-[#333333] font-['Montserrat']">Nidadas bajo Custodia</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clutchesList.map(c => {
                const eggsAssociated = specimensList.filter(s => s.clutchId === c.id);
                return (
                  <div key={c.id} className="bg-white border border-[#EAEAEA] rounded-lg p-5 flex flex-col justify-between shadow-sm font-['Open_Sans']">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Archive className="text-[#E67E22]" size={18} />
                          <h4 className="font-bold text-[#333333] text-[16px] font-['Montserrat'] font-mono">{c.id}</h4>
                        </div>
                        <span className="bg-[#E9F0EC] text-[#2A5A3B] text-[11px] font-bold px-2 py-0.5 rounded-full font-mono border border-[#2A5A3B]/20">
                          {eggsAssociated.length} / {c.clutch} Huevos
                        </span>
                      </div>
                      <p className="text-sm italic font-bold text-[#2A5A3B] leading-none mb-1">{c.species}</p>
                      <p className="text-xs text-[#555555] font-medium mb-3">{c.common}</p>
                      <p className="text-xs text-[#555555] leading-normal line-clamp-2 mt-1">
                        <strong>Recolector:</strong> {c.collector} <br />
                        <strong>Nido:</strong> {c.nest}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-['Montserrat'] mt-4 gap-2">
                      <button
                        onClick={() => startEditClutch(c)}
                        className="text-[#555555] hover:text-[#2A5A3B] hover:bg-[#E9F0EC] px-2.5 py-1.5 rounded font-bold transition-all flex items-center gap-1 border border-[#EAEAEA]"
                      >
                        <Edit size={12} /> Editar
                      </button>
                      <button
                        onClick={() => {
                          resetSpecimenForm();
                          setTargetClutchForEgg(c);
                        }}
                        className="bg-[#E67E22] text-white hover:bg-[#d6731b] px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus size={14} /> Agregar Huevo
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('explore'); 
  const [adminTab, setAdminTab] = useState('list');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [specimensList, setSpecimensList] = useState(INITIAL_SPECIMENS);
  const [clutchesList, setClutchesList] = useState(INITIAL_CLUTCHES);
  
  // Auth state simulated
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Carga de tipografías de Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Open+Sans:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (passwordInput.toLowerCase() === 'admin') {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setPasswordInput('');
      setLoginError('');
      setActiveTab('admin');
      setAdminTab('list');
    } else {
      setLoginError('Contraseña incorrecta. Intenta con "admin".');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('explore');
    setAdminTab('list');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] font-sans text-[#333333] selection:bg-[#E67E22] selection:text-white flex flex-col justify-between" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      
      <div>
        {/* Mockup Warning Banner */}
        <div className="bg-amber-100 text-amber-800 text-xs font-medium text-center py-2 border-b border-amber-200 flex items-center justify-center gap-2">
          <AlertCircle size={14} />
          Este es un prototipo interactivo de UI/UX para Fundación Mil Aves. La base de datos es local.
        </div>

        {/* HEADER - Condicional dependiendo de la sesión y pestaña */}
        <header className="bg-[#EAE7DB] sticky top-0 z-50 shadow-sm border-b border-[#D8D5C8]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <a href="https://milaves.org.ar" 
               onClick={(e) => { if (activeTab === 'admin') { e.preventDefault(); setActiveTab('explore'); }}}
               className="flex-shrink-0 transition-transform hover:scale-105"
            >
              <img 
                src="https://milaves.org.ar/wp-content/uploads/2024/08/LOGO-MILAVES-HORIZONTAL.png.webp" 
                alt="Logo Fundación Mil Aves" 
                className="h-10 md:h-12 w-auto object-contain" 
              />
            </a>
            
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              
              {/* VISTA PÚBLICA (Colección normal) */}
              {activeTab !== 'admin' ? (
                <>
                  <nav className="flex flex-wrap justify-center md:flex-nowrap items-center gap-2 md:space-x-1">
                    <a href="https://milaves.org.ar/#nosotros" className="text-[#333333] hover:text-[#2A5A3B] text-[14px] md:text-[15px] font-bold px-3 py-2 transition-colors font-['Montserrat']">Nosotros</a>
                    <a href="https://milaves.org.ar/#pilares" className="text-[#333333] hover:text-[#2A5A3B] text-[14px] md:text-[15px] font-bold px-3 py-2 transition-colors font-['Montserrat']">Nuestros pilares</a>
                    <a href="https://milaves.org.ar/#actividades" className="text-[#333333] hover:text-[#2A5A3B] text-[14px] md:text-[15px] font-bold px-3 py-2 transition-colors font-['Montserrat']">¿Qué hacemos?</a>
                    
                    <button 
                      onClick={() => setActiveTab('explore')}
                      className={`text-[14px] md:text-[15px] font-bold px-3 py-2 transition-colors font-['Montserrat'] relative ${activeTab === 'explore' ? 'text-[#2A5A3B]' : 'text-[#333333] hover:text-[#2A5A3B]'}`}
                    >
                      Colección
                      {activeTab === 'explore' && (
                        <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#2A5A3B]"></span>
                      )}
                    </button>
                  </nav>
                  <div className="flex items-center gap-2">
                    {/* Botón de acceso administrativo al panel (Si está logueado pero viendo vista pública) */}
                    {isLoggedIn && (
                      <button 
                        onClick={() => setActiveTab('admin')}
                        className={`text-[14px] md:text-[15px] font-bold px-3 py-2 transition-colors font-['Montserrat'] relative text-[#E67E22] flex items-center gap-1.5`}
                      >
                        <Unlock size={14} /> Panel Curador
                      </button>
                    )}
                    <a 
                      href="https://milaves.org.ar/#asociate" 
                      className="bg-[#5D7A5C] hover:bg-[#4D664E] text-white font-bold py-2 px-6 rounded-md transition-all hover:scale-105 shadow-[0_4px_6px_rgba(0,0,0,0.15)] flex items-center justify-center text-[14px] md:text-[15px] font-['Montserrat']"
                    >
                      Asociate
                    </a>
                  </div>
                </>
              ) : (
                /* VISTA CURADORES (Panel de Control Cerrado) */
                <nav className="flex items-center gap-4 relative">
                  <button 
                    onClick={() => setActiveTab('explore')}
                    className="text-[#555555] hover:text-[#2A5A3B] text-[14px] font-bold px-3 py-2 transition-colors font-['Montserrat'] flex items-center gap-1.5"
                  >
                    <ArrowLeft size={16} /> Volver a Colección Pública
                  </button>
                  
                  {/* Dropdown de Perfil en Header */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="bg-white border border-[#EAEAEA] hover:border-[#2A5A3B]/30 text-[#333333] font-bold py-2 px-4 rounded-md transition-all shadow-sm flex items-center gap-2 text-[14px] font-['Montserrat']"
                    >
                      <User size={16} className="text-[#2A5A3B]" /> Administrador <ChevronDown size={14} className="text-[#555555]" />
                    </button>

                    {showProfileDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)}></div>
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-[#EAEAEA] shadow-[0_10px_15px_rgba(0,0,0,0.1)] rounded-md overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 font-['Open_Sans']">
                          <div className="px-4 py-3 border-b border-[#EAEAEA] bg-[#F4F6F5]">
                            <p className="text-xs font-bold text-[#555555] uppercase tracking-wider font-['Montserrat']">Conectado como</p>
                            <p className="text-sm font-bold text-[#2A5A3B] truncate">admin@milaves.org.ar</p>
                          </div>
                          <button 
                            onClick={() => { setAdminTab('profile'); setShowProfileDropdown(false); }}
                            className="w-full text-left px-4 py-3 text-sm font-semibold text-[#555555] hover:bg-[#E9F0EC] hover:text-[#2A5A3B] border-b border-[#EAEAEA] flex items-center gap-2 transition-colors"
                          >
                            <Edit size={14} /> Editar Mi Perfil
                          </button>
                          <button 
                            onClick={() => { alert('Las preferencias estarán disponibles en la próxima actualización.'); setShowProfileDropdown(false); }}
                            className="w-full text-left px-4 py-3 text-sm font-semibold text-[#555555] hover:bg-[#E9F0EC] hover:text-[#2A5A3B] border-b border-[#EAEAEA] flex items-center gap-2 transition-colors"
                          >
                            <Settings size={14} /> Preferencias
                          </button>
                          <button 
                            onClick={() => { handleLogout(); setShowProfileDropdown(false); }}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                          >
                            <LogOut size={14} /> Cerrar Sesión
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </nav>
              )}

            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {activeTab === 'explore' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TaxonomicExplorer specimensList={specimensList} familiesList={Object.keys(FAMILY_COMMONS).map(name => ({name, icon: FAMILY_COMMONS[name], color: FAMILY_COLORS[name]}))} />
            </div>
          )}

          {activeTab === 'admin' && isLoggedIn && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AdminPanel 
                specimensList={specimensList} 
                setSpecimensList={setSpecimensList} 
                clutchesList={clutchesList} 
                setClutchesList={setClutchesList} 
                adminTab={adminTab}
                setAdminTab={setAdminTab}
              />
            </div>
          )}

        </main>
      </div>

      {/* Footer Académico e Institucional Rediseñado */}
      <footer className="bg-[#333333] text-[#F4F6F5] py-12 border-t-4 border-[#2A5A3B] font-['Open_Sans'] mt-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          
          <div>
            <h4 className="font-['Montserrat'] font-bold text-white text-base mb-3 uppercase tracking-wider">Licencia y Uso de Datos</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Los datos taxonómicos, morfométricos e imágenes de esta colección se distribuyen bajo una licencia 
              <strong className="text-emerald-400"> Creative Commons Atribución 4.0 Internacional (CC BY 4.0)</strong>. 
              Puedes compartir y adaptar los recursos siempre que se otorgue el crédito correspondiente y se cite la fuente original.
            </p>
          </div>
          
          <div>
            <h4 className="font-['Montserrat'] font-bold text-white text-base mb-3 uppercase tracking-wider">Cómo Citar la Colección</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Para publicaciones o proyectos científicos que utilicen estos datos, por favor cite el recurso de la siguiente forma: <br />
              <span className="italic font-mono text-slate-300 block mt-2 bg-[#252525] p-2.5 rounded text-[11px] border border-slate-700 leading-normal">
                Fundación Mil Aves (2026). Repositorio Digital de la Colección de Oología (DwC-A). Córdoba, Argentina. Recuperado desde la plataforma integrada milaves.org.ar
              </span>
            </p>
          </div>

          <div>
            <h4 className="font-['Montserrat'] font-bold text-white text-base mb-3 uppercase tracking-wider">Enlaces Científicos</h4>
            <ul className="text-slate-400 text-xs space-y-2">
              <li>
                <a href="https://www.gbif.org" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  Integración y Cosecha con GBIF
                </a>
              </li>
              <li>
                <a href="https://dwc.tdwg.org" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  Estándar Internacional Darwin Core (DwC)
                </a>
              </li>
              
              {/* Acceso de Curadores Discreto */}
              {!isLoggedIn && (
                <li className="pt-4 border-t border-slate-700 mt-4 flex justify-between items-center">
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="text-slate-500 hover:text-white flex items-center gap-1.5 transition-colors font-bold font-['Montserrat'] text-xs uppercase"
                  >
                    <Lock size={14} /> Acceso de Curadores
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© 2026 Fundación Mil Aves. Conservando aves, bosques y comunidades.</p>
        </div>
      </footer>

      {/* MOCK LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-lg shadow-2xl border border-[#EAEAEA] p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#2A5A3B] font-['Montserrat'] flex items-center gap-2">
                <Lock size={20} className="text-[#E67E22]" /> Autenticación de Curador
              </h3>
              <button 
                onClick={() => { setShowLoginModal(false); setLoginError(''); setPasswordInput(''); }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 font-['Open_Sans']">
              <div className="bg-[#F4F6F5] border border-slate-200 p-3 rounded-md text-xs text-[#555555]">
                <p className="font-semibold text-[#2A5A3B]">Ingreso para pruebas:</p>
                <p className="mt-1">Escribe <strong className="font-mono text-[#E67E22]">admin</strong> en la contraseña y haz clic en ingresar.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555555] uppercase tracking-wider mb-1 font-['Montserrat']">
                  Contraseña de Acceso *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Contraseña"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] transition-colors"
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                  <AlertCircle size={12} />
                  {loginError}
                </p>
              )}

              <div className="pt-2 flex justify-end gap-2 font-['Montserrat']">
                <button
                  type="button"
                  onClick={() => { setShowLoginModal(false); setLoginError(''); setPasswordInput(''); }}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-md text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#2A5A3B] hover:bg-[#1f422b] text-white font-bold py-2 px-6 rounded-md text-sm transition-all"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}