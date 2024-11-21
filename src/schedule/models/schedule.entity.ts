import { ActivityEntity } from "../../activity/models/activity.entity";
import { Activity } from "../../activity/models/activity.interface";
import { Schedule } from "./schedule.interface";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"

@Entity('schedule')
export class ScheduleEntity implements Schedule {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: String;

  @Column()
  url: String;

  @OneToMany(() => ActivityEntity, (activity) => activity.schedule)
  activities?: ActivityEntity[];

  @Column()
  idOwner: number

}