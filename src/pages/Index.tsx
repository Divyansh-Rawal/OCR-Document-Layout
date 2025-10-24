import { useState } from "react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ProcessingStages, ProcessingStage } from "@/components/ProcessingStages";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ben");
  const [currentStage, setCurrentStage] = useState<ProcessingStage>("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const processDocuments = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one document to process",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const stages: ProcessingStage[] = [
      "upload",
      "tilt-correction", 
      "layout-detection",
      "ocr",
      "cleaning",
      "complete"
    ];

    try {
      const processedResults = [];

      for (const file of selectedFiles) {
        // Progress through stages
        for (let i = 0; i < stages.length; i++) {
          setCurrentStage(stages[i]);
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Call the backend API
        const formData = new FormData();
        formData.append('file', file);
        formData.append('language', selectedLanguage);

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-document`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to process ${file.name}`);
        }

        const result = await response.json();
        processedResults.push({
          ...result,
          file: file, // Keep the file object for visualization
        });
      }

      setResults(processedResults);
      setIsProcessing(false);

      toast({
        title: "Processing complete!",
        description: `Successfully processed ${selectedFiles.length} document(s)`,
      });
    } catch (error) {
      console.error('Processing error:', error);
      setIsProcessing(false);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An error occurred during processing",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setCurrentStage("upload");
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                OCR Document Layout
              </h1>
              <p className="text-sm text-muted-foreground">
                Multi-language layout detection and text extraction
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Config */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <Sparkles className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Get Started</h2>
                  <p className="text-sm text-muted-foreground">
                    This UI demonstrates the OCR pipeline from your uploaded Python code. 
                    Upload documents, select the language, and process them through layout detection 
                    and text extraction stages.
                  </p>
                </div>
              </div>
            </Card>

      <DocumentUpload 
        onFilesSelected={handleFilesSelected} 
        selectedLanguage={selectedLanguage}
      />

            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />

            <div className="flex gap-3">
              <Button 
                onClick={processDocuments} 
                disabled={isProcessing || selectedFiles.length === 0}
                className="flex-1 transition-all duration-200"
                size="lg"
              >
                {isProcessing ? "Processing..." : "Start Processing"}
              </Button>
              {(selectedFiles.length > 0 || results.length > 0) && (
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                  size="lg"
                  className="transition-all duration-200"
                >
                  Reset
                </Button>
              )}
            </div>

            {results.length > 0 && <ResultsDisplay results={results} />}
          </div>

          {/* Right Column - Pipeline Status */}
          <div className="lg:col-span-1">
            <ProcessingStages 
              currentStage={currentStage} 
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Info Footer */}
        <Card className="mt-8 p-6 bg-muted/30">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>Technical Implementation Notes</span>
            <div className="h-0.5 w-24 bg-primary rounded-full" />
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong className="text-primary">Layout Detection:</strong> Uses YOLO model (yolov12l-doclaynet.pt) for detecting text regions</li>
            <li>• <strong className="text-primary">OCR Engine:</strong> Tesseract OCR for multi-language text extraction</li>
            <li>• <strong className="text-primary">Preprocessing:</strong> Automatic tilt correction using Hough Line Transform</li>
            <li>• <strong className="text-primary">Post-processing:</strong> Language-specific text cleaning and error correction</li>
            <li>• <strong className="text-primary">Backend Integration:</strong> Requires Python backend with YOLO and Tesseract dependencies</li>
          </ul>
        </Card>
      </main>
    </div>
  );
};

export default Index;
