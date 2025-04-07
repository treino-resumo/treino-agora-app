
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { diasSemana, getDayIndex } from "@/lib/dateUtils";
import ExerciseForm from "./ExerciseForm";
import ExerciseList from "./ExerciseList";
import { Exercicio, Treino } from "@/types";

interface WorkoutFormProps {
  onSaveWorkout: (workout: Omit<Treino, "id">) => Promise<void>;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSaveWorkout }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddExercise = (exercise: Exercicio) => {
    setExercicios([...exercicios, exercise]);
  };
  
  const handleRemoveExercise = (id: string) => {
    setExercicios(exercicios.filter(ex => ex.id !== id));
  };
  
  const handleSaveWorkout = async () => {
    // Validation
    if (!date) {
      alert("Por favor, selecione uma data para o treino!");
      return;
    }
    
    if (exercicios.length === 0) {
      alert("Por favor, adicione pelo menos um exercício!");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const diaSemana = format(date, "EEEE", { locale: ptBR });
      
      const workout: Omit<Treino, "id"> = {
        data: formattedDate,
        diaSemana,
        exercicios,
        timestamp: Date.now()
      };
      
      await onSaveWorkout(workout);
      
      // Reset form after successful save
      setExercicios([]);
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Erro ao salvar o treino. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get current day of week index (0-6)
  const selectedDayIndex = getDayIndex(format(date, "yyyy-MM-dd"));
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold">Registrar Novo Treino</h2>
      
      <div className="card-container">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Data do Treino</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Dia da Semana</label>
            <div className="flex justify-between">
              {diasSemana.map((dia, index) => (
                <button
                  key={index}
                  type="button"
                  className={cn(
                    "day-button",
                    index === selectedDayIndex ? "active" : "inactive"
                  )}
                  disabled
                >
                  {dia}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-container">
        <ExerciseForm onAddExercise={handleAddExercise} />
        
        {exercicios.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium text-lg mb-4">Exercícios Adicionados</h3>
            <ExerciseList 
              exercicios={exercicios} 
              onRemoveExercise={handleRemoveExercise} 
            />
          </div>
        )}
        
        <Button
          className="w-full mt-6 btn-primary"
          onClick={handleSaveWorkout}
          disabled={isSubmitting || exercicios.length === 0}
        >
          {isSubmitting ? "Salvando..." : "Salvar Treino"}
        </Button>
      </div>
    </div>
  );
};

export default WorkoutForm;
