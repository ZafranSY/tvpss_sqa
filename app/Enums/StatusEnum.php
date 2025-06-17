<?php

namespace App\Enums;

enum StatusEnum:String
{
    case Berfungsi = "Berfungsi";
    case Tidak_Berfungsi = "Tidak Berfungsi";
    case Penyelenggaraan = "Penyelenggaraan";

    public static function getValues(): array
    {
        return array_map(fn($enum) => $enum->value, self::cases());
    }
}
