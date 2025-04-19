import { IsString, IsUUID, IsOptional, IsDate } from 'class-validator';

/**
 * Data Transfer Object for Church
 */
export class ChurchDto {
    /**
     * Unique identifier for the church
     */
    @IsUUID()
    id: string;

    /**
     * Name of the church
     */
    @IsString()
    name: string;

    /**
     * Date when the church record was created
     */
    @IsDate()
    created_at: Date;

    /**
     * Optional timezone for the church
     */
    @IsString()
    @IsOptional()
    timezone?: string;
}