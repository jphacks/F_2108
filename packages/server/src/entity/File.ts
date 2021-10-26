import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { Stamp } from "./Stamp"
import { User } from "./User"

@Entity()
export class File {
  @PrimaryColumn()
  fileId: string

  @Column()
  name: string

  @Column()
  url: string

  @Column()
  thumbnail: string

  @CreateDateColumn()
  postedAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.updatedFiles)
  updatedBy: User

  @ManyToOne(() => User, (user) => user.files)
  author: User

  @OneToMany(() => Stamp, (stamp) => stamp.file)
  stamps: Stamp[]
}
