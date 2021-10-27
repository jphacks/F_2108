import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { File } from "./File"
import { Comment } from "./Comment"
import { User } from "./User"

@Entity()
export class Stamp {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  position_page: number

  @Column({ type: "double" })
  position_x: number

  @Column({ type: "double" })
  position_y: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => User, (user) => user.stamps, {
    nullable: false,
    eager: true,
  })
  author: User

  @ManyToOne(() => File, (file) => file.stamps, { nullable: false })
  file: File

  @OneToMany(() => Comment, (comment) => comment.stamp, { lazy: true })
  comments: Promise<Comment[]>
}
