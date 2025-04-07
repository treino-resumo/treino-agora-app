
import React from "react";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const { currentUser, isApproved, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="app-container">
          <div className="card-container flex items-center justify-center py-12">
            <p>Carregando...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="app-container">
        {currentUser && isApproved ? (
          <Dashboard />
        ) : (
          <div className="card-container">
            <AuthForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
