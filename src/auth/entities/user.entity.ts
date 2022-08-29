import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Product } from 'src/products/entities';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text')
  fullName: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user, {
    cascade: true,
  })
  products?: Product[];

  @BeforeInsert()
  transformFields() {
    this.password = bcrypt.hashSync(this.password, 10);
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  transformBeforeUpdate() {
    this.transformFields();
  }
}
