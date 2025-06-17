<?php

namespace App\Enums;

enum statusCrewAppEnum:String
{
    case Permohonan_Diterima = "Permohonan Diterima";
    case Permohonan_Ditolak = "Permohonan Ditolak";
    case Permohonan_Belum_Diproses = "Permohonan Belum Diproses";

    public static function getValues(): array
    {
        return array_map(fn($enum) => $enum->value, self::cases());
    }
}
