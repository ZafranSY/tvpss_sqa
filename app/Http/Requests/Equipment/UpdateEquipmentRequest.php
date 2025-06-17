<?php

namespace App\Http\Requests\Equipment;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\StatusEnum;

class UpdateEquipmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'equipName' => 'required|string|max:255',
            'equipType' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'acquired_date' => 'required|date_format:Y-m-d',
            'status' => ['required', 'string', 'in:' . implode(',', StatusEnum::getValues())],

            /*'followUpUpdateSchool' => 'nullable|string|max:500',
            'uploadBrEq' => 'nullable|array|max:2',
            'uploadBrEq.*' => 'nullable|file|image|max:2048',*/
        ];
    }

    public function messages()
    {
        return [
            'equipName.required' => 'Nama Peralatan diperlukan!',
            'equipType.required' => 'Jenis diperlukan!',
            'location.required' => 'Lokasi diperlukan!',
            'acquired_date.required' => 'Tarikh Diperolehi diperlukan!',
            'status.required' => 'Status diperlukan!',
            'status.in' => 'Status yang dipilih tidak sah!',

            /*'followUpUpdateSchool.string' => 'Maklumat Kerosakan mesti berbentuk teks!',
            'followUpUpdateSchool.max' => 'Maklumat Kerosakan tidak boleh melebihi 500 aksara!',
            'uploadBrEq.array' => 'Gambar mesti dimuat naik sebagai senarai!',
            'uploadBrEq.max' => 'Hanya maksimum 2 gambar dibenarkan!',
            'uploadBrEq.*.file' => 'Setiap fail mesti fail yang sah!',
            'uploadBrEq.*.image' => 'Setiap fail mesti gambar yang sah!',
            'uploadBrEq.*.max' => 'Setiap gambar tidak boleh melebihi saiz 2MB!',*/
        ];
    }

}
