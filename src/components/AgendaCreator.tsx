import { useState, useRef } from 'react';
import {
  Plus,
  Download,
  Trash2,
  GripVertical,
  Timer,
  Clock,
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Users,
  Lightbulb,
  Target,
  MessageSquare,
  Map
} from 'lucide-react';
import { translations } from '../translations';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AgendaItem {
  id: string;
  title: string;
  description: string;
  duration: number;
}

interface AgendaCreatorProps {
  language: 'est' | 'eng';
}

export default function AgendaCreator({ language }: AgendaCreatorProps) {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [timerItem, setTimerItem] = useState<AgendaItem | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<number>();

  const t = translations[language].agenda;

  const templates = [
    {
      icon: Sparkles,
      name: t.template1,
      items: [{ title: t.template1, description: '', duration: 10 }]
    },
    {
      icon: Lightbulb,
      name: t.template2,
      items: [{ title: t.template2, description: '', duration: 30 }]
    },
    {
      icon: RotateCcw,
      name: t.template3,
      items: [{ title: t.template3, description: '', duration: 45 }]
    },
    {
      icon: Target,
      name: t.template4,
      items: [{ title: t.template4, description: '', duration: 40 }]
    },
    {
      icon: MessageSquare,
      name: t.template5,
      items: [{ title: t.template5, description: '', duration: 20 }]
    },
    {
      icon: Map,
      name: t.template6,
      items: [{ title: t.template6, description: '', duration: 60 }]
    }
  ];

  const addItem = () => {
    const newItem: AgendaItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      duration: 15
    };
    setItems([...items, newItem]);
  };

  const addTemplate = (templateItems: any[]) => {
    const newItems = templateItems.map(item => ({
      id: Date.now().toString() + Math.random(),
      ...item
    }));
    setItems([...items, ...newItems]);
  };

  const updateItem = (id: string, field: keyof AgendaItem, value: string | number) => {
    setItems(items.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearAll = () => {
    if (window.confirm(language === 'est' ? 'Kas oled kindel?' : 'Are you sure?')) {
      setItems([]);
    }
  };

  const exportPDF = () => {
    if (items.length === 0) {
      alert(language === 'est' ? 'Agenda on tühi!' : 'Agenda is empty!');
      return;
    }

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString(language === 'est' ? 'et-EE' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'est' ? 'Koosoleku Agenda' : 'Meeting Agenda', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(currentDate, 14, 28);

    const tableData = items.map((item, index) => [
      (index + 1).toString(),
      item.title || (language === 'est' ? 'Pealkirjata' : 'Untitled'),
      item.description || '-',
      `${item.duration} ${language === 'est' ? 'min' : 'min'}`
    ]);

    autoTable(doc, {
      startY: 35,
      head: [[
        '#',
        language === 'est' ? 'Teema' : 'Topic',
        language === 'est' ? 'Kirjeldus' : 'Description',
        language === 'est' ? 'Kestus' : 'Duration'
      ]],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [34, 139, 34],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 50 },
        2: { cellWidth: 90 },
        3: { cellWidth: 25 }
      },
      margin: { top: 35 }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 35;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `${language === 'est' ? 'Kogukestus:' : 'Total Duration:'} ${totalTime} ${language === 'est' ? 'minutit' : 'minutes'}`,
      14,
      finalY + 15
    );

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128);
    doc.text(
      language === 'est'
        ? `Genereeritud ${currentDate} | Reimo Rehkli Fasilitatsioon`
        : `Generated on ${currentDate} | Reimo Rehkli Facilitation`,
      14,
      finalY + 25
    );

    doc.save(`agenda-${new Date().getTime()}.pdf`);
  };

  const totalTime = items.reduce((sum, item) => sum + item.duration, 0);

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== id) {
      const draggedIdx = items.findIndex(item => item.id === draggedItem);
      const targetIdx = items.findIndex(item => item.id === id);
      const newItems = [...items];
      const [removed] = newItems.splice(draggedIdx, 1);
      newItems.splice(targetIdx, 0, removed);
      setItems(newItems);
    }
  };

  const startTimer = (item: AgendaItem) => {
    setTimerItem(item);
    setTimeLeft(item.duration * 60);
    setTimerRunning(false);
  };

  const toggleTimer = () => {
    if (timerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimerRunning(false);
    } else {
      setTimerRunning(true);
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
    if (timerItem) setTimeLeft(timerItem.duration * 60);
  };

  const closeTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerItem(null);
    setTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600">{t.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-lg font-bold text-gray-800 mb-4">{t.templates}</h2>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template, idx) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => addTemplate(template.items)}
                      className="bg-green-50 hover:bg-green-100 p-4 rounded-xl transition-all hover:scale-105 flex flex-col items-center gap-2"
                    >
                      <Icon size={24} className="text-green-600" />
                      <span className="text-xs font-semibold text-gray-700 text-center">
                        {template.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-lg font-bold text-gray-800 mb-4">{t.actions}</h2>
              <button
                onClick={addItem}
                className="w-full bg-green-50 hover:bg-green-600 hover:text-white p-3 rounded-xl transition-all flex items-center gap-3 mb-3 font-semibold"
              >
                <Plus size={20} />
                {t.addItem}
              </button>
              <button
                onClick={exportPDF}
                className="w-full bg-yellow-50 hover:bg-yellow-400 p-3 rounded-xl transition-all flex items-center gap-3 mb-3 font-semibold"
              >
                <Download size={20} />
                {t.exportPdf}
              </button>
              <button
                onClick={clearAll}
                className="w-full bg-red-50 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all flex items-center gap-3 font-semibold"
              >
                <Trash2 size={20} />
                {t.clearAll}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b-2 border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {language === 'est' ? 'Sinu Agenda' : 'Your Agenda'}
              </h2>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={20} />
                <span className="font-semibold">{t.totalTime}</span>
                <span className="text-2xl font-bold text-green-600">{totalTime}</span>
                <span className="text-sm">{t.minutes}</span>
              </div>
            </div>

            <div className="p-6 min-h-[400px]">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Target size={64} className="mb-4 opacity-30" />
                  <p className="text-xl font-semibold">{t.emptyState}</p>
                  <p className="text-sm mt-2">{t.emptyHint}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                      onDragOver={(e) => handleDragOver(e, item.id)}
                      className="bg-gray-50 border-2 border-transparent hover:border-green-200 p-6 rounded-2xl transition-all cursor-move"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <GripVertical size={20} className="text-gray-400 mt-2" />
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                          placeholder={t.itemTitle}
                          className="flex-1 bg-white px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-green-600 focus:outline-none font-semibold"
                        />
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-gray-200">
                          <input
                            type="number"
                            value={item.duration}
                            onChange={(e) => updateItem(item.id, 'duration', parseInt(e.target.value) || 0)}
                            className="w-16 text-right font-bold text-green-600 focus:outline-none"
                          />
                          <span className="text-sm text-gray-600">{t.minutes}</span>
                        </div>
                      </div>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder={t.itemDescription}
                        className="w-full bg-white px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-600 focus:outline-none text-sm resize-none mb-4"
                        rows={2}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => startTimer(item)}
                          className="bg-green-100 hover:bg-green-600 hover:text-white p-2 rounded-lg transition-all"
                        >
                          <Timer size={20} />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="bg-red-100 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {timerItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b-2 border-gray-100 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">{t.timerTitle}</h3>
              <button onClick={closeTimer} className="text-gray-400 hover:text-gray-600">
                <X size={28} />
              </button>
            </div>
            <div className="p-8 text-center">
              <div className="text-7xl font-bold text-green-600 mb-6">
                {formatTime(timeLeft)}
              </div>
              <p className="text-lg text-gray-700 font-semibold mb-8">{timerItem.title}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={toggleTimer}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  {timerRunning ? (
                    <>
                      <Pause size={20} />
                      {t.pause}
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      {t.start}
                    </>
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <RotateCcw size={20} />
                  {t.reset}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
