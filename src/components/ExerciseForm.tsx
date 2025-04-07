
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Save } from "lucide-react";
import { Serie, Exercicio } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface ExerciseFormProps {
  onAddExercise: (exercise: Exercicio) => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onAddExercise }) => {
  const [nome, setNome] = useState("");
  const [series, setSeries] = useState<Serie[]>([{ repeticoes: 0, carga: 0 }]);
  
  const handleAddSerie = () => {
    setSeries([...series, { repeticoes: 0, carga: 0 }]);
  };
  
  const handleRemoveSerie = (index: number) => {
    const updatedSeries = [...series];
    updatedSeries.splice(index, 1);
    setSeries(updatedSeries);
  };
  
  const handleSerieChange = (index: number, field: keyof Serie, value: number) => {
    const updatedSeries = [...series];
    updatedSeries[index][field] = value;
    setSeries(updatedSeries);
  };
  
  const handleSubmit = () => {
    // Validation
    if (!nome.trim()) {
      alert("Por favor, informe o nome do exercício!");
      return;
    }
    
    // Check if any series has missing data
    const hasIncompleteSeries = series.some(serie => 
      serie.repeticoes <= 0 || serie.carga <= 0
    );
    
    if (hasIncompleteSeries) {
      alert("Por favor, preencha repetições e carga para todas as séries!");
      return;
    }
    
    // Create new exercise
    const newExercise: Exercicio = {
      id: uuidv4(),
      nome: nome.trim(),
      series: [...series]
    };
    
    // Add the exercise
    onAddExercise(newExercise);
    
    // Reset form
    setNome("");
    setSeries([{ repeticoes: 0, carga: 0 }]);
  };
  
  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50 animate-fade-in">
      <h3 className="font-medium text-lg">Novo Exercício</h3>
      
      <div>
        <label htmlFor="exercise-name" className="block text-sm font-medium mb-1">
          Nome do Exercício
        </label>
        <Input
          id="exercise-name"
          type="text"
          placeholder="Ex: Supino Reto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="input-field"
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Séries</h4>
          <Button 
            type="button" 
            size="sm"
            variant="outline"
            onClick={handleAddSerie}
            className="flex items-center gap-1 text-xs"
          >
            <Plus size={14} /> Adicionar Série
          </Button>
        </div>
        
        {series.map((serie, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
              {index + 1}
            </div>
            
            <div className="flex-1">
              <label className="block text-xs mb-1">Repetições</label>
              <Input
                type="number"
                min="1"
                value={serie.repeticoes || ""}
                onChange={(e) => handleSerieChange(index, "repeticoes", parseInt(e.target.value) || 0)}
                className="input-field"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-xs mb-1">Carga (kg)</label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={serie.carga || ""}
                onChange={(e) => handleSerieChange(index, "carga", parseFloat(e.target.value) || 0)}
                className="input-field"
              />
            </div>
            
            {series.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveSerie(index)}
                className="flex-shrink-0 h-8 w-8 text-gray-500 hover:text-red-500 mt-5"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <Button 
        type="button" 
        onClick={handleSubmit}
        className="w-full btn-accent"
      >
        <Save size={16} className="mr-2" /> Adicionar Exercício
      </Button>
    </div>
  );
};

export default ExerciseForm;
