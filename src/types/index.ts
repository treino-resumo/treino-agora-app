
export interface Serie {
  repeticoes: number;
  carga: number;
}

export interface Exercicio {
  id?: string;
  nome: string;
  series: Serie[];
}

export interface Treino {
  id?: string;
  data: string;
  diaSemana: string;
  exercicios: Exercicio[];
  timestamp: number;
}
