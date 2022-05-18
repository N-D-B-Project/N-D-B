/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface IUser {
  username: string;
  discriminator: string;
  userID: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
}

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
  @Prop({ unique: true })
  id: number;

  @Prop({ unique: true })
  userID: string;

  @Prop({ unique: false })
  username: string;
  
  @Prop({ unique: false })
  discriminator: string;

  @Prop({ unique: false })
  avatar: string;

  @Prop({ unique: true })
  accessToken: string;

  @Prop({ unique: true })
  refreshToken: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

//import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

// @Entity(/**{ name: 'user' } */) 
// export default class User implements IUser {
//   @ObjectIdColumn()
//   id: ObjectID;

//   @Column(/** { name: 'userId'} */)
//   userID: string;

//   @Column(/**{ name: 'username'} */)
//   username: string;

//   @Column(/**{ name: 'discriminator'} */)
//   discriminator: string;

//   @Column(/** { name: 'avatar', nullable: true } */)
//   avatar: string;

//   @Column(/**{ name: 'accessToken' }*/)
//   accessToken: string;

//   @Column(/**{ name: 'refreshToken' }*/)
//   refreshToken: string;
// }
