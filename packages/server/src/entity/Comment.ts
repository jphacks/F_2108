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
  id: number

  @Column({ type: "enum", enum: CommentDataType })
  data_type: CommentDataType

  @Column()
  content: string

  @Column({ nullable: true })
  title: string

  @CreateDateColumn()
  posted_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => User, (user) => user.comments, {
    nullable: false,
    eager: true,
  })
  author: User

  @ManyToOne(() => Stamp, (stamp) => stamp.comments, { nullable: false })
  stamp: Stamp
}
