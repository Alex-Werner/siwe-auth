import {ApiProperty} from '@nestjs/swagger'

export class CreateUserDto {
    @ApiProperty({
        description: 'Nickname for the user',
        example: 'test_user99',
        required: true,
        type: 'string',
    })
    public readonly username: string

    @ApiProperty({
        description: 'User 0x address',
        example: '0xD3adB33f00000000000000000000000000000000',
        required: true,
        type: 'string',
    })
    public readonly address: string
}

export class SignInUserDto {
    @ApiProperty({
        description: 'Nickname for the user',
        example: 'test_user99',
        required: true,
        type: 'string',
    })
    public readonly username: string

    @ApiProperty({
        description: 'User 0x address',
        example: '0xD3adB33f00000000000000000000000000000000',
        required: true,
        type: 'string',
    })
    public readonly address: string
}


export class SignUpUserDto {
    @ApiProperty({
        description: 'Nickname for the user',
        example: 'test_user99',
        required: true,
        type: 'string',
    })
    public readonly username: string

    @ApiProperty({
        description: 'User 0x address',
        example: '0xD3adB33f00000000000000000000000000000000',
        required: true,
        type: 'string',
    })
    public readonly address: string
}
