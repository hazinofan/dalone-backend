import { InjectRepository } from "@nestjs/typeorm";
import { CreateReservationDto, UpdateReservationStatusDto } from "./dto/create-reservation.dto";
import { In, Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Reservation } from "./entities/reservation.entity";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Availability } from "src/availability/entities/availability.entity";
import { format } from "date-fns";

function generateHalfHourSlots(start: string, end: string): string[] {
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  const slots: string[] = [];
  let hour = startHour;
  let minute = startMin;

  while (hour < endHour || (hour === endHour && minute < endMin)) {
    slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    minute += 30;
    if (minute >= 60) {
      minute = 0;
      hour++;
    }
  }

  return slots;
}

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly repo: Repository<Reservation>,
    @InjectRepository(Availability)
    private readonly availabilityRepo: Repository<Availability>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) { }

  async create(clientId: number, dto: CreateReservationDto) {
    const client = await this.userRepo.findOneBy({ id: clientId });
    const professional = await this.userRepo.findOneBy({ id: dto.professionalId });
    if (!client || !professional) throw new NotFoundException('User not found');

    // 1) Ensure no overlap with existing bookings
    const conflictCount = await this.repo
      .createQueryBuilder('r')
      .where('r.professional = :pid', { pid: dto.professionalId })
      .andWhere('r.date = :date', { date: dto.date })
      .andWhere('NOT (r.endTime <= :start OR r.startTime >= :end)', {
        start: dto.startTime,
        end: dto.endTime,
      })
      .andWhere('r.status IN (:...sts)', { sts: ['pending', 'accepted'] })
      .getCount();

    if (conflictCount > 0) {
      throw new ConflictException('Time range overlaps an existing booking');
    }

    // 2) Create the new reservation
    const reservation = this.repo.create({
      client,
      professional,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      message: dto.message,
    });
    return this.repo.save(reservation);
  }

  async getByClient(userId: number) {
    return this.repo.find({
      where: { client: { id: userId } },
      relations: ['professional'],
    });
  }

  async getByProfessional(userId: number) {
    return this.repo.find({
      where: { professional: { id: userId } },
      relations: ['client'],
    });
  }

  async updateStatus(id: number, status: UpdateReservationStatusDto['status']) {
    await this.repo.update(id, { status });
    return this.repo.findOneBy({ id });
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }

  async getAvailableSlots(professionalId: number, weekStartStr: string) {
    // 1) build the 7-day window
    const weekStart = new Date(weekStartStr);
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });

    // 2) fetch the “could-work” rules
    const availabilities = await this.availabilityRepo.find({
      where: { professional: { id: professionalId } },
    });

    // 3) fetch the actual reservations in that range
    const reservations = await this.repo.find({
      where: {
        professional: { id: professionalId },
        date: In(days.map(d => format(d, "yyyy-MM-dd"))),
        status: In(["pending", "accepted"]),
      },
    });

    // 4) build a map date → Set of reserved half-hours
    const reservedMap = new Map<string, Set<string>>();
    for (const r of reservations) {
      if (!reservedMap.has(r.date)) reservedMap.set(r.date, new Set());
      for (const slot of generateHalfHourSlots(r.startTime, r.endTime)) {
        reservedMap.get(r.date)!.add(slot);
      }
    }

    // 5) for each day, either use its rules or default to 08:00–18:00
    const result: Record<string, string[]> = {};
    for (const date of days) {
      const isoDate = format(date, "yyyy-MM-dd");
      const dow = date.getDay();

      // pick explicit rules or fallback
      const dailyRules = availabilities.filter(a => a.dayOfWeek === dow);
      const rulesToUse = dailyRules.length
        ? dailyRules
        : [{ startTime: "08:00:00", endTime: "18:00:00" } as Availability];

      // explode them into half-hours
      let allSlots: string[] = [];
      for (const rule of rulesToUse) {
        allSlots.push(...generateHalfHourSlots(rule.startTime, rule.endTime));
      }

      // star the ones that are reserved
      const reservedSet = reservedMap.get(isoDate) ?? new Set<string>();
      result[isoDate] = allSlots.map(t => (reservedSet.has(t) ? `${t}*` : t));
    }

    return result;
  }
}
