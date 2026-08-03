"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";

interface PremiumDateTimePickerProps {
  value: string; // Format: "YYYY-MM-DDThh:mm"
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function PremiumDateTimePicker({ value, onChange, placeholder = "Select date & time", disabled = false }: PremiumDateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse the incoming value or use current date
  const initialDate = value ? new Date(value) : new Date();
  
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  
  // Selected state
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? initialDate : null);
  
  // Time state (default 23:59 for expiry dates if none selected)
  const [hours, setHours] = useState(value ? initialDate.getHours().toString().padStart(2, '0') : "23");
  const [minutes, setMinutes] = useState(value ? initialDate.getMinutes().toString().padStart(2, '0') : "59");

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update internal state if value prop changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
        setCurrentMonth(d.getMonth());
        setCurrentYear(d.getFullYear());
        setHours(d.getHours().toString().padStart(2, '0'));
        setMinutes(d.getMinutes().toString().padStart(2, '0'));
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
  };

  const handleApply = () => {
    if (selectedDate) {
      // Format to YYYY-MM-DDThh:mm
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      
      const formatted = `${yyyy}-${mm}-${dd}T${hours}:${minutes}`;
      onChange(formatted);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  // Format display string
  const displayString = value 
    ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : "";

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input Field */}
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full bg-surface-card border rounded-xl px-4 py-2.5 text-sm flex items-center justify-between cursor-pointer transition-all ${
          isOpen ? "border-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.1)]" : "border-border hover:border-orange-500/50"
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className={value ? "text-orange-500" : "text-muted"} />
          <span className={value ? "text-heading font-bold" : "text-muted"}>
            {displayString || placeholder}
          </span>
        </div>
        {value && (
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); handleClear(); }}
            className="text-muted hover:text-red-500 transition-colors p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Popover */}
      {isOpen && (
        <div className="absolute z-50 top-full mt-2 left-0 w-72 bg-surface-card border border-border rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={handlePrevMonth} className="p-1.5 rounded-lg hover:bg-orange-500/10 text-muted hover:text-orange-500 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="font-bold text-sm text-heading">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button type="button" onClick={handleNextMonth} className="p-1.5 rounded-lg hover:bg-orange-500/10 text-muted hover:text-orange-500 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-muted uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentMonth && selectedDate?.getFullYear() === currentYear;
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;

              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    isSelected 
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 font-bold" 
                      : isToday
                        ? "bg-orange-500/10 text-orange-500 font-bold hover:bg-orange-500/20"
                        : "text-heading hover:bg-surface hover:text-orange-500"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="h-px bg-border w-full my-3" />

          {/* Time Picker */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-1.5 text-muted text-xs font-bold">
              <Clock size={14} />
              <span>TIME</span>
            </div>
            <div className="flex items-center gap-1">
              <input 
                type="number" 
                min="0" max="23" 
                value={hours} 
                onChange={e => setHours(e.target.value.padStart(2, '0'))}
                className="w-12 text-center bg-surface border border-border rounded-lg py-1 text-xs font-bold text-heading focus:border-orange-500 focus:outline-none"
              />
              <span className="text-muted font-bold">:</span>
              <input 
                type="number" 
                min="0" max="59" 
                value={minutes} 
                onChange={e => setMinutes(e.target.value.padStart(2, '0'))}
                className="w-12 text-center bg-surface border border-border rounded-lg py-1 text-xs font-bold text-heading focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Apply Button */}
          <button 
            type="button"
            onClick={handleApply}
            disabled={!selectedDate}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Expiry Date
          </button>
        </div>
      )}
    </div>
  );
}
