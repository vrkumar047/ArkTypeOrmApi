import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tbl_UserDetail')
export class UserDetail {
  @PrimaryColumn({ name: 'user_id', type: 'varchar', length: 30 })
  userId: string;

  @Column({ name: 'id', type: 'int', generated: 'increment' })
  id: number;

  @Column({ name: 'password', type: 'varchar', length: 50 })
  password: string;

  @Column({ name: 'hash_password', type: 'varchar', length: 500 })
  hashPassword: string;

  @Column({ name: 'branch_id', type: 'varchar', length: 50 })
  branchId: string;

  @Column({ name: 'department_id', type: 'int' })
  departmentId: number;

  @Column({ name: 'name', type: 'varchar', length: 150, nullable: true })
  name?: string;

  @Column({ name: 'role_id', type: 'int', nullable: true })
  roleId?: number;

  @Column({ name: 'email_id', type: 'varchar', length: 50, nullable: true })
  emailId?: string;

  @Column({ name: 'mobile', type: 'varchar', length: 15, nullable: true })
  mobile?: string;

  @Column({ name: 'address', type: 'varchar', length: 200, nullable: true })
  address?: string;

  @Column({ name: 'country_id', type: 'int', nullable: true })
  countryId?: number;

  @Column({ name: 'state_id', type: 'int', nullable: true })
  stateId?: number;

  @Column({ name: 'district_id', type: 'int', nullable: true })
  districtId?: number;

  @Column({ name: 'city_id', type: 'int', nullable: true })
  cityId?: number;

  @Column({ name: 'claim', type: 'varchar', nullable: true })
  claim?: string;

  @Column({ name: 'isActive', type: 'int', default: () => 1 })
  isActive: number;

  @Column({ name: 'created_by', type: 'varchar', length: 30 })
  createdBy: string;

  @CreateDateColumn({
    name: 'created_on',
    type: 'date',
    default: () => 'getdate()',
  })
  createdOn: Date;

  @Column({ name: 'modified_by', type: 'varchar', length: 30 })
  modifiedBy: string;

  @UpdateDateColumn({ name: 'modified_on', type: 'date' })
  modifiedOn: Date;

  @Column({ name: 'RegNo', type: 'varchar', length: 15, nullable: true })
  regNo?: string;

  @Column({ name: 'Exp_Date', type: 'datetime', nullable: true })
  expDate?: Date;

  @Column({ name: 'companyCode', type: 'varchar', length: 30, nullable: true })
  companyCode?: string;
}
