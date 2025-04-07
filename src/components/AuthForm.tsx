
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { signIn, signUp } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
    
    setIsLoading(true);
    try {
      await signIn(loginEmail, loginPassword);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword || !confirmPassword) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
    
    if (registerPassword !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(registerEmail, registerPassword);
      // Reset form
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-center mb-6">Treino Agora</h1>
      
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Cadastro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="input-field"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="input-field"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="register-email"
                type="email"
                placeholder="seu@email.com"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="input-field"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium mb-1">
                Senha
              </label>
              <Input
                id="register-password"
                type="password"
                placeholder="********"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="input-field"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                Confirmar Senha
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
