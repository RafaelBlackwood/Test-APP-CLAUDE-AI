import React, { useCallback, forwardRef, useRef } from 'react';
import { 
  DocumentIcon, 
  PhotoIcon, 
  TrashIcon,
  CloudArrowUpIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../utils';

export interface FileUploadProps {
  label?: string;
  error?: string;
  helperText?: string;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  value?: File[];
  onChange?: (files: File[]) => void;
  onError?: (error: string) => void;
}

const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  ({ 
    label,
    error,
    helperText,
    accept = '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx',
    maxSize = 10 * 1024 * 1024, // 10MB
    multiple = false,
    disabled = false,
    value = [],
    onChange,
    onError,
    ...props
  }, ref) => {
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = React.useState(false);

    const validateFile = (file: File): string | null => {
      if (file.size > maxSize) {
        return `File is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`;
      }
      
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type.toLowerCase();
      
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type;
        }
        return mimeType.includes(type.replace('*', ''));
      });
      
      if (!isValidType) {
        return 'File type not supported';
      }
      
      return null;
    };

    const handleFiles = useCallback((files: FileList) => {
      const fileArray = Array.from(files);
      const validFiles: File[] = [];
      
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          onError?.(validationError);
          return;
        }
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        const newFiles = multiple ? [...value, ...validFiles] : validFiles;
        onChange?.(newFiles);
      }
    }, [value, multiple, maxSize, onChange, onError, accept]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      
      if (!disabled && e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    };

    const handleClick = () => {
      if (!disabled) {
        fileInputRef.current?.click();
      }
    };

    const removeFile = (index: number) => {
      const newFiles = value.filter((_, i) => i !== index);
      onChange?.(newFiles);
    };

    const getFileIcon = (file: File) => {
      if (file.type.startsWith('image/')) {
        return <PhotoIcon className="h-6 w-6" />;
      }
      return <DocumentIcon className="h-6 w-6" />;
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
      <div className="w-full" ref={ref} {...props}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        {/* File input (hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Dropzone */}
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            'hover:border-primary-400 hover:bg-primary-50',
            isDragOver && 'border-primary-400 bg-primary-50',
            error && 'border-red-300',
            disabled && 'cursor-not-allowed opacity-50 hover:border-gray-300 hover:bg-transparent',
            !error && 'border-gray-300'
          )}
        >
          
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          
          <div className="text-sm text-gray-600">
            {isDragOver ? (
              <p>Drop the files here...</p>
            ) : (
              <div>
                <span className="font-medium text-primary-600 hover:text-primary-500">
                  Click to upload
                </span>{' '}
                or drag and drop
                <p className="text-xs text-gray-500 mt-1">
                  {accept.toUpperCase()} up to {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* File list */}
        {value.length > 0 && (
          <div className="mt-4 space-y-2">
            {value.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-gray-400">
                    {getFileIcon(file)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  disabled={disabled}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Error or helper text */}
        {(error || helperText) && (
          <div className="mt-1 flex items-center text-sm">
            {error && <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-1" />}
            <span className={error ? 'text-red-600' : 'text-gray-500'}>
              {error || helperText}
            </span>
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export { FileUpload };