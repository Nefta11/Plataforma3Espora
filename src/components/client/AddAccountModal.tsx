import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Upload, X, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const accountSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .refine(value => /^[a-zA-Z0-9\s-]+$/.test(value), {
      message: 'El nombre solo puede contener letras, números, espacios y guiones'
    }),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AccountFormData & { logoUrl: string }) => Promise<void>;
  existingNames: string[];
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingNames,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema)
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Formato de imagen no válido. Use JPG, PNG o WebP';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'La imagen no debe exceder 5MB';
    }
    return null;
  };

  const handleImageSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setImageError(error);
      setImageFile(null);
      setSelectedImage('');
      return;
    }

    setImageError('');
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleImageSelect(e.target.files[0]);
    }
  };

  const onSubmit = async (data: AccountFormData) => {
    // Validate unique name
    if (existingNames.includes(data.name)) {
      setError('name', { message: 'Este nombre ya está en uso' });
      return;
    }

    // Validate image
    if (!selectedImage) {
      setImageError('Se requiere una imagen para la cuenta');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({ ...data, logoUrl: selectedImage });
      reset();
      setSelectedImage('');
      setImageFile(null);
      onClose();
    } catch (error) {
      console.error('Error al crear la cuenta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar Nueva Cuenta"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Nombre de la Cuenta"
          error={errors.name?.message}
          {...register("name")}
          placeholder="Ingrese el nombre de la cuenta"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Logo de la Cuenta
          </label>
          
          <div 
            className={cn(
              "relative border-2 border-dashed rounded-lg transition-all duration-200",
              dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300",
              imageError ? "border-red-300" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            
            {selectedImage ? (
              <div className="relative p-2">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-48 object-contain rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage('');
                    setImageFile(null);
                  }}
                  className="absolute top-4 right-4 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  PNG, JPG o WebP hasta 5MB
                </p>
              </div>
            )}
          </div>
          
          {imageError && (
            <p className="flex items-center text-sm text-red-600">
              <AlertCircle size={16} className="mr-1" />
              {imageError}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setSelectedImage('');
              setImageFile(null);
              onClose();
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Crear Cuenta
          </Button>
        </div>
      </form>
    </Modal>
  );
};