import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CloudArrowUpIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import type { ApplicationDocument, DocumentType } from '../../types';

interface DocumentItem {
  id: string;
  type: DocumentType;
  name: string;
  required: boolean;
  status: 'missing' | 'uploaded' | 'verified' | 'rejected';
  uploadedAt?: string;
  fileSize?: number;
  applicationId?: string;
  university?: string;
  program?: string;
  rejectionReason?: string;
}

interface DocumentChecklistProps {
  documents: DocumentItem[];
  isLoading?: boolean;
  onUpload?: (documentType: DocumentType) => void;
  onView?: (document: DocumentItem) => void;
  onDelete?: (documentId: string) => void;
}

const getDocumentTypeLabel = (type: DocumentType): string => {
  const labels: Record<DocumentType, string> = {
    transcript: 'Official Transcript',
    recommendation_letter: 'Letter of Recommendation',
    personal_statement: 'Personal Statement',
    resume: 'Resume/CV',
    portfolio: 'Portfolio',
    financial_statement: 'Financial Statement',
    passport: 'Passport Copy',
    diploma: 'Diploma/Certificate',
    other: 'Other Document',
  };
  return labels[type] || type;
};

const getStatusColor = (status: DocumentItem['status'], required: boolean): string => {
  if (status === 'missing' && required) {
    return 'border-l-error-500 bg-error-50';
  }
  
  const colors = {
    missing: 'border-l-gray-300 bg-gray-50',
    uploaded: 'border-l-warning-500 bg-warning-50',
    verified: 'border-l-success-500 bg-success-50',
    rejected: 'border-l-error-500 bg-error-50',
  };
  return colors[status] || colors.missing;
};

const getStatusIcon = (status: DocumentItem['status'], required: boolean) => {
  const iconProps = { className: 'w-5 h-5' };
  
  switch (status) {
    case 'verified':
      return <CheckCircleIconSolid {...iconProps} className="w-5 h-5 text-success-600" />;
    case 'uploaded':
      return <ClockIcon {...iconProps} className="w-5 h-5 text-warning-600" />;
    case 'rejected':
      return <ExclamationTriangleIcon {...iconProps} className="w-5 h-5 text-error-600" />;
    case 'missing':
    default:
      return required ? (
        <ExclamationTriangleIcon {...iconProps} className="w-5 h-5 text-error-600" />
      ) : (
        <DocumentTextIcon {...iconProps} className="w-5 h-5 text-gray-400" />
      );
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DocumentItem: React.FC<{
  document: DocumentItem;
  index: number;
  onUpload?: (documentType: DocumentType) => void;
  onView?: (document: DocumentItem) => void;
  onDelete?: (documentId: string) => void;
}> = ({ document, index, onUpload, onView, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`border-l-4 rounded-r-lg transition-all duration-200 ${getStatusColor(
        document.status,
        document.required
      )}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="mt-0.5">
              {getStatusIcon(document.status, document.required)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-gray-900 truncate">
                  {getDocumentTypeLabel(document.type)}
                </h4>
                {document.required && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                    Required
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                {document.university && document.program && (
                  <p>{document.university} - {document.program}</p>
                )}
                
                {document.status !== 'missing' && document.uploadedAt && (
                  <p>Uploaded {new Date(document.uploadedAt).toLocaleDateString()}</p>
                )}
                
                {document.fileSize && (
                  <p>File size: {formatFileSize(document.fileSize)}</p>
                )}
                
                {document.status === 'rejected' && document.rejectionReason && (
                  <p className="text-error-600 font-medium">
                    Rejected: {document.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {document.status === 'missing' ? (
              <button
                onClick={() => onUpload?.(document.type)}
                className="inline-flex items-center px-3 py-1.5 border border-primary-600 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                <CloudArrowUpIcon className="w-4 h-4 mr-1" />
                Upload
              </button>
            ) : (
              <>
                <button
                  onClick={() => onView?.(document)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="View document"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete?.(document.id)}
                  className="p-2 text-gray-400 hover:text-error-600 transition-colors"
                  title="Delete document"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="border-l-4 border-l-gray-200 bg-gray-50 rounded-r-lg p-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="w-16 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  documents,
  isLoading = false,
  onUpload,
  onView,
  onDelete,
}) => {
  const [filter, setFilter] = useState<'all' | 'required' | 'missing' | 'uploaded'>('all');

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  const filteredDocuments = documents.filter(doc => {
    switch (filter) {
      case 'required':
        return doc.required;
      case 'missing':
        return doc.status === 'missing';
      case 'uploaded':
        return doc.status !== 'missing';
      default:
        return true;
    }
  });

  const stats = {
    total: documents.length,
    required: documents.filter(d => d.required).length,
    missing: documents.filter(d => d.status === 'missing').length,
    uploaded: documents.filter(d => d.status !== 'missing').length,
    verified: documents.filter(d => d.status === 'verified').length,
  };

  const completionPercentage = stats.total > 0 ? Math.round((stats.uploaded / stats.total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Document Checklist</h2>
            <p className="text-gray-600">Track your application documents</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{completionPercentage}%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-warning-600">{stats.missing}</div>
            <div className="text-xs text-gray-500">Missing</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{stats.uploaded}</div>
            <div className="text-xs text-gray-500">Uploaded</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-success-600">{stats.verified}</div>
            <div className="text-xs text-gray-500">Verified</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-6">
          {[
            { key: 'all', label: 'All', count: stats.total },
            { key: 'required', label: 'Required', count: stats.required },
            { key: 'missing', label: 'Missing', count: stats.missing },
            { key: 'uploaded', label: 'Uploaded', count: stats.uploaded },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filter === key
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Document List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
              <p className="text-sm text-gray-400">
                {filter === 'missing' ? 'All documents are uploaded!' : 'Try adjusting your filter'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((document, index) => (
                <DocumentItem
                  key={document.id}
                  document={document}
                  index={index}
                  onUpload={onUpload}
                  onView={onView}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DocumentChecklist;