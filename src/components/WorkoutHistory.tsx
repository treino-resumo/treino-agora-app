
import React from "react";
import { Treino } from "@/types";
import { formatDate } from "@/lib/dateUtils";
import ExerciseList from "./ExerciseList";

interface WorkoutHistoryProps {
  treinos: Treino[];
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ treinos }) => {
  if (treinos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground animate-fade-in">
        <p className="text-xl">🏋️ Nenhum treino registrado ainda</p>
      </div>
    );
  }
  
  // Sort workouts by date (newest first)
  const sortedTreinos = [...treinos].sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );
  
  return (
    <div className="space-y-6 animate-fade-in">
      {sortedTreinos.map((treino) => (
        <div key={treino.id} className="card-container">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-lg capitalize">{treino.diaSemana}</h3>
              <p className="text-gray-500">{formatDate(treino.data)}</p>
            </div>
          </div>
          
          <ExerciseList exercicios={treino.exercicios} isReadOnly />
        </div>
      ))}
    </div>
  );
};

export default WorkoutHistory;
