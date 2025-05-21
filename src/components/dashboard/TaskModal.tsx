import React, { useState, useEffect } from 'react';
import { Check, X, Upload } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useTask } from '../../context/TaskContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskNumber: number;
  isOrangeButton?: boolean;
  onComplete: (taskNumber: number, isCompleted: boolean) => void;
  isCompleted: boolean;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskNumber,
  isOrangeButton = false,
  onComplete,
  isCompleted: initialIsCompleted
}) => {
  const { tasks, saveTask, getTask } = useTask();
  const [notes, setNotes] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(initialIsCompleted);
  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [initialTaskState, setInitialTaskState] = useState<{
    notes: string;
    completed: boolean;
  }>({ notes: '', completed: initialIsCompleted });

  // Reset state when modal opens with a new task
  useEffect(() => {
    const taskData = getTask(taskNumber);
    const initialNotes = taskData?.notes || '';
    const initialCompleted = initialIsCompleted;
    
    setInitialTaskState({
      notes: initialNotes,
      completed: initialCompleted
    });
    
    if (taskData) {
      setNotes(initialNotes);
      setIsCompleted(initialCompleted);
      // Convert stored file references back to File objects if needed
    } else {
      setNotes(initialNotes);
      setIsCompleted(initialCompleted);
      setFiles([]);
    }
    setUnsavedChanges(false);
  }, [taskNumber, initialIsCompleted, getTask]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = 
      notes !== initialTaskState.notes ||
      isCompleted !== initialTaskState.completed ||
      files.length > 0;
    setUnsavedChanges(hasChanges);
  }, [notes, isCompleted, files, initialTaskState]);

  const handleStatusChange = (newState: boolean) => {
    setIsCompleted(newState);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      setUnsavedChanges(true);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setUnsavedChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Convert files to metadata for storage
      const fileData = files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }));

      // Save all task data
      await saveTask(taskNumber, {
        notes,
        completed: isCompleted,
        files: fileData
      });

      setUnsavedChanges(false);
      onComplete(taskNumber, isCompleted);
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskNumber <= 9 || taskNumber === 10 || taskNumber === 11 || taskNumber === 16 || taskNumber === 17 || taskNumber === 18 || taskNumber === 19 || (taskNumber >= 36 && taskNumber <= 39) || (taskNumber >= 80 && taskNumber <= 82) || taskNumber === 99 || taskNumber === 59 || taskNumber === 100 || taskNumber === 101 ? "Tarea por definirse" : taskNumber === 12 ? "3.2.N.1" : taskNumber === 13 ? "3.2.N.1.1" : taskNumber === 14 ? "3.2.N.1.1.1" : taskNumber === 15 ? "3.2.N.2" : taskNumber === 20 ? "3.2.R.1" : taskNumber === 21 ? "3.2.R.2" : taskNumber === 22 ? "3.2.R.3" : taskNumber === 23 ? "3.2.R.4.1" : taskNumber === 24 ? "3.2.R.4.2" : taskNumber === 25 ? "3.2.R.5" : taskNumber === 26 ? "3.2.R.6" : taskNumber === 30 ? "3.2.M.1" : taskNumber === 31 ? "3.2.M.2" : taskNumber === 40 ? "3.2.P.1" : taskNumber === 41 ? "3.2.P.2" : taskNumber === 42 ? "3.2.P.3" : taskNumber === 43 ? "3.2.P.3.1" : taskNumber === 44 ? "3.2.P.3.2" : taskNumber === 45 ? "3.2.P.4" : taskNumber === 53 ? "3.2.VO.1" : taskNumber === 54 ? "3.2.VO.1.1" : taskNumber === 55 ? "3.2.VO.1.1.1" : taskNumber === 56 ? "3.2.VO.1.1.2" : taskNumber === 57 ? "3.2.VO.1.1.2.1" : taskNumber === 58 ? "3.2.VO.1.1.2.1.1" : taskNumber === 60 ? "3.2.VC.1" : taskNumber === 61 ? "3.2.VC.1.1" : taskNumber === 62 ? "3.2.VC.1.1.1" : taskNumber === 63 ? "3.2.VC.1.1.1.1" : taskNumber === 64 ? "3.2.VC.1.1.2" : taskNumber === 65 ? "3.2.VC.1.1.2.1" : taskNumber === 66 ? "3.2.VC.1.3" : taskNumber === 67 ? "3.2.VC.1.3.1" : taskNumber === 68 ? "3.2.VC.1.3.1.1" : taskNumber === 69 ? "3.2.VC.1.3.1.2" : taskNumber === 70 ? "3.2.VC.1.3.1.3" : taskNumber === 71 ? "3.2.VC.1.3.1.4" : taskNumber === 72 ? "3.2.VC.2" : taskNumber === 73 ? "3.2.VC.2.1" : taskNumber === 74 ? "3.2.VC.2.2" : taskNumber === 75 ? "3.2.VC.2.2.1" : taskNumber === 76 ? "3.2.VC.2.2.2" : taskNumber === 77 ? "3.2.VC.3" : taskNumber === 78 ? "3.2.VC.3.1" : taskNumber === 79 ? "3.2.VC.3.2" : taskNumber === 32 ? "3.2.M.3" : taskNumber === 33 ? "3.2.M.3.1" : taskNumber === 34 ? "3.2.M.3.2" : taskNumber === 35 ? "3.2.M.4" : taskNumber === 90 ? "3.2.A.1" : taskNumber === 91 ? "3.2.A.2.1" : taskNumber === 92 ? "3.2.A.2.2" : taskNumber === 93 ? "3.2.A.2.3" : taskNumber === 94 ? "3.2.A.2.4" : taskNumber === 95 ? "3.2.A.2.5" : taskNumber === 96 ? "3.2.A.3" : taskNumber === 97 ? "3.2.A.4" : taskNumber === 98 ? "3.2.A.5" : `Tarea ${taskNumber}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="block text-xs font-medium text-gray-900 text-center">
            Descripción de la Tarea
          </label>
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-center text-xs text-gray-600">
            <p className="leading-relaxed">
              {taskNumber <= 9 || taskNumber === 10 || taskNumber === 11 || taskNumber === 16 || taskNumber === 17 || taskNumber === 18 || taskNumber === 19 || (taskNumber >= 36 && taskNumber <= 39) || (taskNumber >= 80 && taskNumber <= 82) || taskNumber === 99 || taskNumber === 59 || taskNumber === 100 || taskNumber === 101 ? "Tarea por definirse" : taskNumber === 12 ? "Roadmap de PMO" : taskNumber === 13 ? "3.2.N.1.1" : taskNumber === 14 ? "3.2.N.1.1.1" : taskNumber === 15 ? "3.2.N.2" : taskNumber === 20 ? "3.2.R.1" : taskNumber === 21 ? "3.2.R.2" : taskNumber === 22 ? "3.2.R.3" : taskNumber === 23 ? "3.2.R.4.1" : taskNumber === 24 ? "3.2.R.4.2" : taskNumber === 25 ? "3.2.R.5" : taskNumber === 26 ? "3.2.R.6" : taskNumber === 30 ? "Definiciones iniciales de producción" : taskNumber === 53 ? "Kickoff y presentación" : taskNumber === 54 ? "3.2.VO.1.1" : taskNumber === 60 ? "Presentación de implantes" : taskNumber === 61 ? "Definiciones iniciales para el programa de acompañamiento" : taskNumber === 62 ? "Diseño del proceso de estrategia digital en sitio" : taskNumber === 63 ? "Recopilación de insights" : taskNumber === 64 ? "Diseño del sistema de levantamiento de imagen" : taskNumber === 65 ? "Diseño del sistema de comunicación instantánea" : taskNumber === 66 ? "Diseño del sistema de acompañamiento (playbook / reporte diario)" : taskNumber === 67 ? "Instalación de mesas" : taskNumber === 68 ? "Diseño de minuta" : taskNumber === 69 ? "Diseño de playbook" : taskNumber === 78 ? "Sistema de acompañamiento" : taskNumber === 90 ? "Estudios para la estrategia digital" : taskNumber === 91 ? "Diseño estratégico y cuestionario" : taskNumber === 92 ? "Definición y selección de proveedor de levantamiento" : taskNumber === 93 ? "Recepción de base de levantamiento" : taskNumber === 94 ? "Graficación / Visualización de datos" : taskNumber === 95 ? "Graficación / Visualización de datos (encuesta basal)" : taskNumber === 96 ? "Social listening base" : taskNumber === 97 ? "Estudio de fórmulas de viralización" : taskNumber === 98 ? "Evaluación de contenidos iniciales según estudios / estrategia" : ""}
              {taskNumber === 31 ? "Estudio de tendencias gráficas" : taskNumber === 32 ? "Estudio de tendencias gráficas" : taskNumber === 40 ? "Definiciones iniciales de producción" : taskNumber === 55 ? "Presentación de implantes" : taskNumber === 56 ? "Estudio de demografía digital" : taskNumber === 57 ? "Benchmark" : taskNumber === 58 ? "Estrategia digital consolidada" : taskNumber === 70 ? "Diseño de sistema de reportes" : taskNumber === 82 ? "Diseño de parrilla" : taskNumber === 71 ? "Diseño de parrilla" : taskNumber === 72 ? "Definiciones iniciales para el programa de gerencia" : taskNumber === 73 ? "Diseño de organigrama, funciones, metas y participantes" : taskNumber === 74 ? "Diseño del proceso de gestión de desempeño" : ""}
              {taskNumber === 41 ? "Estudio de tendencias gráficas" : taskNumber === 42 ? "Estudio de tendencias gráficas" : taskNumber === 43 ? "Desarrollo de identidad gráfica inicial" : taskNumber === 44 ? "Desarrollo de parrilla inicial" : taskNumber === 82 ? "Diseño de parrilla" : taskNumber === 33 ? "Desarrollo de identidad gráfica inicial" : taskNumber === 34 ? "Desarrollo de parrilla inicial" : taskNumber === 35 ? "Optimización y parrilla inicial (VF)" : ""}
              {taskNumber === 45 ? "Optimización y parrilla inicial (VF)" : ""}
              {taskNumber === 75 ? "Diseño del proceso de gestión de desempeño" : taskNumber === 76 ? "Procesos con áreas externas" : taskNumber === 77 ? "Diseño de presupuesto y flujo" : taskNumber === 79 ? "Sistema de gerencia" : ""}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-900 mb-2 text-center">
            Notas
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full min-h-[120px] px-4 py-3 bg-gray-50/50 border border-gray-200 
              rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400
              transition-all duration-200 ease-out backdrop-blur-sm
              placeholder:text-gray-400 text-gray-900 font-medium text-sm text-center"
            placeholder="Escribe aquí tus notas sobre el progreso de la tarea..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-900 mb-2 text-center">
            Cargar Archivos
          </label>
          <div 
            className={`
              relative group border-2 border-dashed rounded-xl
              ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}
              transition-all duration-200 ease-out
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full px-4 py-6 flex flex-col items-center justify-center text-gray-500">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <span className="text-sm font-medium text-center">
                Arrastra los archivos aquí
                <br />
                o haz clic para seleccionarlos
              </span>
            </div>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="text-sm truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between py-2 px-4 bg-gray-50/30 
          border border-gray-100 rounded-xl">
          <label htmlFor="completed" className="text-xs font-medium text-gray-900">
            Tarea completada
          </label>
          <div className="relative">
            <input
              type="checkbox"
              id="completed"
              checked={isCompleted}
              onChange={(e) => handleStatusChange(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-12 h-7 rounded-full transition-all duration-200 ease-out cursor-pointer
              ${isCompleted ? 'bg-blue-500' : 'bg-gray-200'}`}
              onClick={() => handleStatusChange(!isCompleted)}>
              <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white 
                shadow-sm transition-all duration-200 ease-out transform
                ${isCompleted ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (unsavedChanges) {
                if (window.confirm('¿Descartar los cambios no guardados?')) {
                  onClose();
                }
              } else {
                onClose();
              }
            }}
            className="px-6 py-2.5 text-sm font-medium rounded-xl border border-gray-200
              hover:bg-gray-50 transition-all duration-200 ease-out text-xs"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-medium rounded-xl
              bg-gradient-to-br from-blue-500 to-blue-600 text-white border border-blue-400
              hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ease-out
              shadow-sm hover:shadow transform hover:scale-[1.02]
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!unsavedChanges}
          >
            <Check size={16} />
            {isSaving ? 'Guardando...' : 'Guardar Tarea'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}