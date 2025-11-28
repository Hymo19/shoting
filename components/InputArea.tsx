/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useCallback, useState, useEffect } from 'react';
import { ArrowUpTrayIcon, CameraIcon, CubeIcon, UserIcon, HomeIcon, SparklesIcon, FireIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface InputAreaProps {
  onGenerate: (prompt: string, category: string, file?: File) => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const CATEGORIES = [
  { id: 'product', label: 'Produit', icon: CubeIcon, desc: 'Éclairage studio, fond neutre' },
  { id: 'portrait', label: 'Portrait', icon: UserIcon, desc: 'Photo professionnelle' },
  { id: 'interior', label: 'Intérieur', icon: HomeIcon, desc: 'Architecture & Design' },
  { id: 'food', label: 'Culinaire', icon: FireIcon, desc: 'Gastronomie, macro' },
  { id: 'fashion', label: 'Mode', icon: SparklesIcon, desc: 'Look éditorial' },
  { id: 'landscape', label: 'Paysage', icon: PhotoIcon, desc: 'Style cinématique' },
];

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isGenerating, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('product');
  const [prompt, setPrompt] = useState('');

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      onGenerate(prompt, selectedCategory, file);
    } else {
      alert("Veuillez télécharger une image ou un PDF.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isGenerating) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [disabled, isGenerating, prompt, selectedCategory]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!disabled && !isGenerating) {
        setIsDragging(true);
    }
  }, [disabled, isGenerating]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      
      {/* Category Selector */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-3 min-w-max px-1">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    disabled={isGenerating || disabled}
                    className={`
                        group flex items-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-300
                        ${selectedCategory === cat.id 
                            ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700'
                        }
                    `}
                >
                    <cat.icon className={`w-5 h-5 ${selectedCategory === cat.id ? 'text-purple-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    <div className="text-left">
                        <div className={`text-sm font-medium ${selectedCategory === cat.id ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{cat.label}</div>
                    </div>
                </button>
            ))}
        </div>
      </div>

      <div className="perspective-1000">
        <div 
          className={`relative group transition-all duration-300 ${isDragging ? 'scale-[1.01]' : ''}`}
        >
          <label
            className={`
              relative flex flex-col items-center justify-center
              h-64 sm:h-72 md:h-[24rem]
              bg-zinc-900/30 
              backdrop-blur-sm
              rounded-xl border border-dashed
              cursor-pointer overflow-hidden
              transition-all duration-300
              ${isDragging 
                ? 'border-purple-500 bg-zinc-900/50 shadow-[inset_0_0_20px_rgba(168,85,247,0.1)]' 
                : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/40'
              }
              ${isGenerating ? 'pointer-events-none' : ''}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
              {/* Technical Grid Background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px'}}>
              </div>
              
              {/* Corner Brackets */}
              <div className={`absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 transition-colors duration-300 ${isDragging ? 'border-purple-500' : 'border-zinc-600'}`}></div>
              <div className={`absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 transition-colors duration-300 ${isDragging ? 'border-purple-500' : 'border-zinc-600'}`}></div>
              <div className={`absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 transition-colors duration-300 ${isDragging ? 'border-purple-500' : 'border-zinc-600'}`}></div>
              <div className={`absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 transition-colors duration-300 ${isDragging ? 'border-purple-500' : 'border-zinc-600'}`}></div>

              <div className="relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-8 p-6 md:p-8 w-full max-w-2xl">
                  
                  {/* Icon */}
                  <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-transform duration-500 ${isDragging ? 'scale-110' : 'group-hover:-translate-y-1'}`}>
                      <div className={`absolute inset-0 rounded-2xl bg-zinc-800 border border-zinc-700 shadow-xl flex items-center justify-center ${isGenerating ? 'animate-pulse' : ''}`}>
                          {isGenerating ? (
                              <CameraIcon className="w-8 h-8 md:w-10 md:h-10 text-purple-400 animate-pulse" />
                          ) : (
                              <ArrowUpTrayIcon className={`w-8 h-8 md:w-10 md:h-10 text-zinc-300 transition-all duration-300 ${isDragging ? '-translate-y-1 text-purple-400' : ''}`} />
                          )}
                      </div>
                  </div>

                  {/* Text */}
                  <div className="space-y-2">
                      <h3 className="text-2xl md:text-4xl text-zinc-100 font-bold tracking-tight">
                         Créez votre shooting <br/>
                         <span className="text-purple-400">Pro {CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
                      </h3>
                      <p className="text-zinc-500 text-sm md:text-base">
                          Glissez-déposez une image de référence pour commencer
                      </p>
                  </div>

                  {/* Optional Text Prompt Input */}
                   <div 
                        className="w-full max-w-md relative group/input"
                        onClick={(e) => e.stopPropagation()} 
                   >
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={`Optionnel : "Ajouter une lumière chaude", "Fond sombre"...`}
                            className="w-full bg-black/40 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        />
                   </div>
              </div>

              <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isGenerating || disabled}
              />
          </label>
        </div>
      </div>
    </div>
  );
};