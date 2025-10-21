import { useState, useCallback } from "react";
import { Upload, FileText, X, Folder } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats?: string;
  selectedLanguage?: string;
}

export const DocumentUpload = ({ 
  onFilesSelected,
  acceptedFormats = "image/*,.pdf",
  selectedLanguage = ""
}: DocumentUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type.startsWith("image/") || file.type === "application/pdf"
    );

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid files",
        description: "Some files were skipped. Only images and PDFs are accepted.",
        variant: "destructive"
      });
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    onFilesSelected(validFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFolderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`relative border-2 border-dashed transition-all duration-300 ${
            dragActive 
              ? "border-primary bg-primary/5 scale-105 shadow-lg" 
              : "border-border hover:border-primary/50 hover:scale-102"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Upload className={`w-12 h-12 text-muted-foreground mb-4 transition-transform duration-300 ${dragActive ? 'scale-110' : ''}`} />
              <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Drag and drop your files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supported: Images (PNG, JPG, JPEG) and PDF
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              accept={acceptedFormats}
              onChange={handleFileInput}
            />
          </label>
        </Card>

        <Card className="relative border-2 border-dashed transition-all duration-300 border-border hover:border-primary/50 hover:scale-102 hover:shadow-md">
          <label htmlFor="folder-upload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Folder className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Folder</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Click to select an entire folder of images
              </p>
              <p className="text-xs text-muted-foreground">
                Perfect for batch processing multiple documents
              </p>
            </div>
            <input
              id="folder-upload"
              type="file"
              className="hidden"
              {...({ webkitdirectory: "", directory: "" } as any)}
              multiple
              onChange={handleFolderInput}
            />
          </label>
        </Card>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Selected Files ({selectedFiles.length})</h4>
            {selectedLanguage && (
              <span className="text-xs text-muted-foreground">
                Language: {selectedLanguage}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {selectedFiles.map((file, index) => (
              <Card 
                key={index} 
                className="p-3 hover:bg-accent/5 transition-all duration-200 hover:scale-102 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
