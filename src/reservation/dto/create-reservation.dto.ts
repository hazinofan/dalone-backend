// dto/create-reservation.dto.ts
export class CreateReservationDto {
  professionalId: number;
  date: string;
  startTime: string;
  endTime:   string;
  message?: string;
}

// dto/update-reservation-status.dto.ts
export class UpdateReservationStatusDto {
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
}
