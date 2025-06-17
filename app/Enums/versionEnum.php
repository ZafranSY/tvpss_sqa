<?php

namespace App\Enums;

enum versionEnum: int
{
    case NOT_SATISFIED = 0;
    case V1 = 1;
    case V2 = 2;
    case V3 = 3;
    case V4 = 4;

    public static function toArray(): array
    {
        return [
            self::NOT_SATISFIED->value => 'Not Satisfied',
            self::V1->value => 'Version 1',
            self::V2->value => 'Version 2',
            self::V3->value => 'Version 3',
            self::V4->value => 'Version 4',
        ];
    }
}
