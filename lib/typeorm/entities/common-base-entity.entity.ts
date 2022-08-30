import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm'

/**
 * Has id (auto generated uuidv4), createdAt/updatedAt/deletedAt.
 */
export class CommonBaseEntity {
    /** Auto generated uuid v4 */
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
    updatedAt: Date

    @DeleteDateColumn({ type: 'timestamp with time zone', name: 'deleted_at' })
    deletedAt?: Date

    @VersionColumn({ default: 1 })
    version: number

    /**
     * If you want to delete entity - use softDelete/softRemove
     * https://typeorm.io/#/repository-api
     */
    get isDeleted(): boolean {
        return this.deletedAt != null
    }
}
