
import React from "react";
import { Exercicio } from "@/types";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExerciseListProps {
  exercicios: Exercicio[];
  onRemoveExercise?: (id: string) => void;
  isReadOnly?: boolean;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ 
  exercicios, 
  onRemoveExercise,
  isReadOnly = false
}) => {
  if (exercicios.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>🏋️ Nenhum exercício adicionado ainda</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 animate-slide-up">
      {exercicios.map((exercicio) => (
        <div 
          key={exercicio.id} 
          className="border border-gray-200 rounded-lg p-4 bg-white"
        >
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-lg">{exercicio.nome}</h4>
            
            {!isReadOnly && onRemoveExercise && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveExercise(exercicio.id!)}
                className="h-8 w-8 text-gray-500 hover:text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
          
          <div className="mt-3 space-y-2">
            {exercicio.series.map((serie, index) => (
              <div 
                key={index} 
                className="flex items-center p-2 bg-gray-50 rounded-lg text-sm"
              >
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <span className="text-gray-500 mr-1">Repetições:</span>
                  <span className="font-medium">{serie.repeticoes}</span>
                </div>
                <div className="flex-1">
                  <span className="text-gray-500 mr-1">Carga:</span>
                  <span className="font-medium">{serie.carga} kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;
