import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Stamp } from "./Stamp"
import { User } from "./User"

@Entity()
export class File {
  @PrimaryGeneratedColumn("uuid")
  file_id: string

  @Column()
  name: string

  @Column()
  url: string

  @Column()
  thumbnail: string

  @CreateDateColumn()
  posted_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => User, (user) => user.updated_files)
  updated_by: User

  @ManyToOne(() => User, (user) => user.files)
  author: User

  @OneToMany(() => Stamp, (stamp) => stamp.file)
  stamps: Stamp[]
}
