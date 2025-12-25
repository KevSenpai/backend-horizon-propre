export class CreateTourDto {
  name: string;
  tour_date: string; // ou Date, mais string 'YYYY-MM-DD' est plus simple pour l'API
  team_id: string;
  vehicle_id: string;
}