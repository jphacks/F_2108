import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Stamp } from "./Stamp"
import { User } from "./User"

export enum CommentDataType {
  AUDIO = "audio",
  TEXT = "text",
}

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number

  @Column({ type: "enum", enum: CommentDataType })
  dataType: CommentDataType

  @Column()
  content: string

  @CreateDateColumn()
  postedAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.comments)
  author: User

  @ManyToOne(() => Stamp, (stamp) => stamp.comments)
  stamp: Stamp
}
