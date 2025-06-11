// src/availability/dto/create-availability.dto.ts
export class CreateAvailabilityDto {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// src/availability/dto/update-availability.dto.ts
export class UpdateAvailabilityDto {
  startTime?: string;
  endTime?: string;
}
