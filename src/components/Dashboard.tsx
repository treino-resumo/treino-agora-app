
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkoutForm from "./WorkoutForm";
import WorkoutHistory from "./WorkoutHistory";
import { Treino } from "@/types";
import { database } from "@/lib/firebase";
import { ref, push, set, onValue, get } from "firebase/database";
import { toast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!currentUser) return;
    
    const userTreinosRef = ref(database, `treinos/${currentUser.uid}`);
    
    const unsubscribe = onValue(userTreinosRef, (snapshot) => {
      setLoading(true);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const treinosArray: Treino[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<Treino, "id">)
        }));
        
        setTreinos(treinosArray);
      } else {
        setTreinos([]);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [currentUser]);
  
  const handleSaveWorkout = async (workout: Omit<Treino, "id">) => {
    if (!currentUser) return;
    
    try {
      const newWorkoutRef = push(ref(database, `treinos/${currentUser.uid}`));
      await set(newWorkoutRef, workout);
      
      toast({
        title: "Treino salvo com sucesso!",
      });
    } catch (error) {
      console.error("Error saving workout:", error);
      
      toast({
        variant: "destructive",
        title: "Erro ao salvar treino",
        description: "Tente novamente mais tarde.",
      });
      
      throw error;
    }
  };
  
  return (
    <div className="app-container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Treino Agora</h1>
        
        <Button 
          variant="outline" 
          onClick={signOut}
          size="sm"
        >
          Sair
        </Button>
      </div>
      
      <Tabs defaultValue="register" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">Novo Treino</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="register">
          <WorkoutForm onSaveWorkout={handleSaveWorkout} />
        </TabsContent>
        
        <TabsContent value="history">
          <h2 className="text-xl font-bold mb-6">Histórico de Treinos</h2>
          
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Carregando treinos...</p>
            </div>
          ) : (
            <WorkoutHistory treinos={treinos} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
