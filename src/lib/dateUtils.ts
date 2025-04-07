
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const getDayOfWeek = (date: string): string => {
  const parsedDate = parseISO(date);
  return format(parsedDate, "EEEE", { locale: ptBR });
};

export const formatDate = (date: string): string => {
  const parsedDate = parseISO(date);
  return format(parsedDate, "dd/MM/yyyy");
};

export const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const getDayIndex = (date: string): number => {
  const parsedDate = parseISO(date);
  return parsedDate.getDay();
};
