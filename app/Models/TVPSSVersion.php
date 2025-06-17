<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use MongoDB\Laravel\Eloquent\Model as Model;
use App\Enums\greenScreenEnum;
use App\Enums\recordEquipmentEnum;
use App\Enums\noPhoneEnum;
use App\Enums\isFillSchoolNameEnum;
use App\Enums\isUploadYouTubeEnum;
use App\Enums\tvpssStudioEnum;
use App\Enums\isCollabAgencyEnum;
use App\Enums\versionEnum;
use App\Enums\ApprovalStatusEnum;

class TVPSSVersion extends Model
{
    use HasFactory;

    protected $table = 'schoolversion';

    protected $guarded = [
        'id',
    ];

    protected $fillable = [
        'version',
        'approved_version',
        'status',
        'ppd_approval',
        'state_approval',
        'agency1_name',
        'agency2_name',
        'agencyManager1_name',
        'agencyManager2_name',
        'isNoPhone',
        'recordEquipment',
        'tvpssStudio',
        'recInSchool',
        'recInOutSchool',
        'greenScreen',
        'tvpssLogo',
        'isFillSchoolName',
        'isTvpssLogo',
        'isUploadYoutube',
        'isCollabAgency',
    ];

    protected $casts = [
        'recordEquipment' => recordEquipmentEnum::class,  
        'greenScreen' => greenScreenEnum::class,
        'isNoPhone' => noPhoneEnum::class,
        'isFillSchoolName'=> isFillSchoolNameEnum::class,
        'isTvpssLogo' => tvpssStudioEnum::class,
        'isUploadYoutube'=> isUploadYouTubeEnum::class,
        'isCollabAgency'=> isCollabAgencyEnum::class,
        'version'=> versionEnum::class,
        'status' => ApprovalStatusEnum::class,
        'ppd_approval' => 'boolean',
        'state_approval' => 'boolean',
    ];

    //point 3
    public function schoolInfo()
    {
        return $this->belongsTo(SchoolInfo::class, 'school_info_id');
    }

    public function logo()
    {
        return $this->schoolInfo->schoolLogo ?? null;
    }
}
