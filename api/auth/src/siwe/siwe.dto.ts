import {ApiProperty} from '@nestjs/swagger'

export class VerifySignatureDto {
    @ApiProperty()
    public readonly signature: string

    @ApiProperty()
    public readonly message: string

    @ApiProperty()
    public readonly address: string
}
