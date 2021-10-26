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

type FileType = "own" | "shared"

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

  @ManyToOne(() => User, (user) => user.updated_files, {
    nullable: false,
    eager: true,
  })
  updated_by: User

  @ManyToOne(() => User, (user) => user.files, { nullable: false, eager: true })
  author: User

  @OneToMany(() => Stamp, (stamp) => stamp.file, { lazy: true })
  stamps: Promise<Stamp[]>

  fileType(currentUser: User): FileType {
    return this.author.user_id === currentUser.user_id ? "own" : "shared"
  }
}
