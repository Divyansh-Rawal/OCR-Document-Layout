import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";

interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  text: string;
  confidence: number;
}

interface OutputVisualizationProps {
  file: File;
  boxes: BoundingBox[];
  filename: string;
}

export const OutputVisualization = ({ file, boxes, filename }: OutputVisualizationProps) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [file]);

  useEffect(() => {
    if (imageLoaded && canvasRef.current && imgRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imgRef.current;

      if (ctx) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.drawImage(img, 0, 0);

        const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

        boxes.forEach((box, index) => {
          const color = colors[index % colors.length];
          
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);

          ctx.fillStyle = color;
          ctx.globalAlpha = 0.2;
          ctx.fillRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);
          ctx.globalAlpha = 1.0;

          ctx.fillStyle = color;
          const labelText = `${box.label} (${(box.confidence * 100).toFixed(0)}%)`;
          const textWidth = ctx.measureText(labelText).width;
          ctx.fillRect(box.x1, box.y1 - 25, textWidth + 10, 25);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "14px sans-serif";
          ctx.fillText(labelText, box.x1 + 5, box.y1 - 8);
        });
      }
    }
  }, [imageLoaded, boxes]);

  return (
    <Card className="p-4 bg-muted/30 overflow-hidden animate-fade-in transition-all duration-300">
      <div className="mb-3">
        <h5 className="text-sm font-medium mb-2">Layout Visualization</h5>
        <Badge variant="secondary" className="text-xs">{filename}</Badge>
      </div>
      
      <div className="relative w-full overflow-auto max-h-[600px] bg-background rounded-md border border-border">
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Source"
          className="hidden"
          onLoad={() => setImageLoaded(true)}
        />
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {boxes.map((box, index) => {
          const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];
          const color = colors[index % colors.length];
          return (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground">{box.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
