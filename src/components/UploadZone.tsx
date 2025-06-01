
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadZoneProps {
  onImageUpload: (file: File) => void;
}

const UploadZone = ({ onImageUpload }: UploadZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card 
      className={`border-2 border-dashed transition-colors cursor-pointer hover:border-green-400 ${
        isDragOver ? "border-green-400 bg-green-50" : "border-green-200"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
            <Image className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload your meal photo
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop an image here, or click to select a file
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Choose Image
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Supports JPG, PNG, and other image formats
          </p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default UploadZone;
