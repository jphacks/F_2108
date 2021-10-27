import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { File } from "./File"
import { Stamp } from "./Stamp"
import { Comment } from "./Comment"

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  icon_url: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => File, (file) => file.updated_by)
  updated_files: File[]

  @OneToMany(() => File, (file) => file.author)
  files: File[]

  @OneToMany(() => Stamp, (stamp) => stamp.author)
  stamps: Stamp[]

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[]
}
