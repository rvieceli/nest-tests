import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;
}

export { Cat };
