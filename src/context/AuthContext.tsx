
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { auth, database } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: User | null;
  isApproved: boolean;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Check if user is approved
        try {
          const userRef = ref(database, `usuarios/${user.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setIsApproved(!!userData.aprovado);
          } else {
            setIsApproved(false);
          }
        } catch (error) {
          console.error("Error checking approval status:", error);
          setIsApproved(false);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user record in Realtime Database
      await set(ref(database, `usuarios/${result.user.uid}`), {
        email,
        aprovado: false
      });
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Aguarde a aprovação do administrador para acessar o sistema.",
      });
    } catch (error: any) {
      console.error("Error signing up:", error);
      
      let errorMessage = "Erro ao criar conta. Tente novamente.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres.";
      }
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: errorMessage,
      });
      
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is approved
      const userRef = ref(database, `usuarios/${result.user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setIsApproved(!!userData.aprovado);
        
        if (!userData.aprovado) {
          alert("Sua conta ainda não foi aprovada.");
          await firebaseSignOut(auth);
          return false;
        }
        
        toast({
          title: "Login realizado com sucesso!",
        });
        
        return true;
      } else {
        alert("Usuário não encontrado no banco de dados.");
        await firebaseSignOut(auth);
        return false;
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      
      let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Email ou senha incorretos.";
      }
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: errorMessage,
      });
      
      return false;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setIsApproved(false);
      toast({
        title: "Logout realizado com sucesso!"
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
      });
    }
  };

  const value = {
    currentUser,
    isApproved,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
