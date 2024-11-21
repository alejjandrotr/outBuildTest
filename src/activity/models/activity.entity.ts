import { ScheduleEntity } from "../../schedule/models/schedule.entity";
import { Activity } from "./activity.interface";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"

@Entity('activity')
export class ActivityEntity implements Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: String;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToOne(() => ScheduleEntity, (schedule) => schedule.id)
  schedule?: ScheduleEntity;

  @Column()
  idOwner: number
}