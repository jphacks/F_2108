import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity()
export class File {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  authorId: string

  @Column()
  url: string

  @Column()
  thumbnail: string

  @CreateDateColumn()
  postedAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column()
  updatedBy: string // userId
}
