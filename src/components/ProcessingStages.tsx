import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export type ProcessingStage = 
  | "upload"
  | "tilt-correction"
  | "layout-detection"
  | "ocr"
  | "cleaning"
  | "complete";

interface ProcessingStagesProps {
  currentStage: ProcessingStage;
  isProcessing: boolean;
}

const stages = [
  { id: "upload", label: "Document Upload", description: "Upload your documents" },
  { id: "tilt-correction", label: "Tilt Correction", description: "Correcting document orientation" },
  { id: "layout-detection", label: "Layout Detection", description: "Detecting text regions with YOLO" },
  { id: "ocr", label: "OCR Processing", description: "Extracting text from regions" },
  { id: "cleaning", label: "Text Cleaning", description: "Applying language-specific corrections" },
  { id: "complete", label: "Complete", description: "Processing finished" },
];

export const ProcessingStages = ({ currentStage, isProcessing }: ProcessingStagesProps) => {
  const currentIndex = stages.findIndex(s => s.id === currentStage);

  const getStageStatus = (index: number) => {
    if (index < currentIndex) return "complete";
    if (index === currentIndex) return isProcessing ? "processing" : "current";
    return "pending";
  };

  return (
    <Card className="p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        Processing Pipeline
        {isProcessing && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
      </h3>
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const status = getStageStatus(index);
          return (
            <div 
              key={stage.id} 
              className="flex items-start gap-4 transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                {status === "complete" ? (
                  <CheckCircle2 className="w-6 h-6 text-success" />
                ) : status === "processing" ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : status === "current" ? (
                  <Circle className="w-6 h-6 text-primary fill-primary" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
                {index < stages.length - 1 && (
                  <div 
                    className={`w-0.5 h-12 mt-2 transition-all duration-300 ${
                      status === "complete" ? "bg-success" : "bg-border"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pb-8">
                <h4 className={`font-medium transition-colors duration-200 ${
                  status === "complete" || status === "processing" || status === "current"
                    ? "text-foreground" 
                    : "text-muted-foreground"
                }`}>
                  {stage.label}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
