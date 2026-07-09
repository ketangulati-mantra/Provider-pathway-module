import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const HighlightText = ({ text, highlight }) => {
  if (!highlight || !highlight.trim()) return <>{text}</>;
  const cleanHighlight = highlight.trim().replace(/\s+/g, ' ');
  if (!cleanHighlight) return <>{text}</>;
  
  // Escape regex specials
  const escaped = cleanHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === cleanHighlight.toLowerCase() ? (
          <mark key={i} style={{ background: '#fef08a', color: 'inherit', padding: '0 2px', borderRadius: '4px' }}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};


const SERVICES = [
  "Therapist", "Listener", "Physiotherapist", "Endocrinologist", "Yoga",
  "Diet", "Women Wellness", "Psychiatrist", "General Physician", "Fitness",
  "Hypertension", "EyeMantra", "Clinical Assessment", "Seminar / Workshop / Training",
  "Addiction Treatment", "Coach", "Gynecologist", "LGBTQ", "OCD",
  "Cardiologist", "Orthopedician", "ENT Specialist", "Gastroenterologist",
  "Paediatrician", "Sexologist", "Dermatologist", "Financial Wellbeing",
  "Dentist", "Neurosurgeon", "Oncologist", "Ophthalmologist",
  "Urologist (Kidney & Urinary Tract)", "Nephrologist", "Pulmonologist (Lung)",
  "Rheumatologist", "Fertility / IVF Specialist", "General Surgery",
  "Legal Counsellor", "Meditation / Mindfulness", "Physio Assistants",
  "Corporate", "Mantra"
];

const ServiceFilter = ({ selectedService, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filterQuery, setFilterQuery] = React.useState('');
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredServices = SERVICES.filter(s => s.toLowerCase().includes(filterQuery.toLowerCase()));

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%', marginBottom: '12px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '48px', padding: '0 16px', borderRadius: '12px',
          border: '1px solid #e5e7eb', background: '#ffffff',
          fontSize: '0.95rem', color: 'var(--text-main)', cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        <span>{selectedService}</span>
        <ChevronDown size={18} color="#9ca3af" />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 50,
          maxHeight: '300px', display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          <div style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search services..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                style={{
                  width: '100%', height: '32px', padding: '0 12px 0 32px',
                  borderRadius: '6px', border: '1px solid #e5e7eb',
                  fontSize: '0.85rem', outline: 'none'
                }}
              />
            </div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '4px' }}>
            <button
              onClick={() => { onSelect('All Services'); setIsOpen(false); setFilterQuery(''); }}
              style={{
                width: '100%', textAlign: 'left', padding: '8px 12px',
                background: selectedService === 'All Services' ? '#f3f4f6' : 'transparent',
                border: 'none', borderRadius: '6px', cursor: 'pointer',
                fontSize: '0.9rem', color: 'var(--text-main)'
              }}
            >
              All Services
            </button>
            {filteredServices.map(service => (
              <button
                key={service}
                onClick={() => { onSelect(service); setIsOpen(false); setFilterQuery(''); }}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 12px',
                  background: selectedService === service ? '#f3f4f6' : 'transparent',
                  border: 'none', borderRadius: '6px', cursor: 'pointer',
                  fontSize: '0.9rem', color: 'var(--text-main)'
                }}
              >
                {service}
              </button>
            ))}
            {filteredServices.length === 0 && (
              <div style={{ padding: '8px 12px', fontSize: '0.85rem', color: '#9ca3af' }}>No services found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function DeveloperLessonsPage({ tasks, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('All Services');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cleanQuery = searchQuery.trim().toLowerCase().replace(/\s+/g, ' ');
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !cleanQuery || (task.title || '').toLowerCase().includes(cleanQuery) || (task.category || '').toLowerCase().includes(cleanQuery);
    const matchesService = selectedService === 'All Services' || task.service === selectedService;
    return matchesSearch && matchesService;
  });

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      background: 'var(--bg-app)', 
      padding: '36px 20px'
    }} className="animate-fade-in">
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>🛠️</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
            Developer Dashboard (Testing Only)
          </h1>
        </div>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
          This page is hidden from providers and is used only to test lesson layouts during development.
        </p>
        
        <ServiceFilter selectedService={selectedService} onSelect={setSelectedService} />
        {/* Search Bar */}
        <div style={{ position: 'relative', marginTop: '4px' }}>
          <div style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <Search size={18} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '48px',
              padding: '0 16px 0 42px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              background: '#ffffff',
              fontSize: '0.95rem',
              color: 'var(--text-main)',
              outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <div style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.7rem',
            color: '#9ca3af',
            background: '#f3f4f6',
            padding: '4px 8px',
            borderRadius: '6px',
            pointerEvents: 'none',
            fontWeight: 700,
            border: '1px solid #e5e7eb'
          }}>
            Ctrl K
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', padding: '0 4px' }}>
          <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
            {cleanQuery ? `Found ${filteredTasks.length} results` : `Showing all ${tasks.length} activities`}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '48px 20px',
              background: '#fff',
              borderRadius: '16px',
              border: '1px dashed #eef0f3',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 6px' }}>
                No lessons found
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                Try searching by lesson name.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className="academy-card" 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: '16px',
                  background: '#fff'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    <HighlightText text={task.title} highlight={cleanQuery} />
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <span>Duration: {task.duration}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--color-accent-orange)', fontWeight: 600 }}>Points: {task.points}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate(task.path)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--gradient-primary)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Open Lesson
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
