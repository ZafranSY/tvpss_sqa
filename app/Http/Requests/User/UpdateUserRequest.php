<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class UpdateUserRequest extends FormRequest
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
            'email' => 'required|email|unique:users,email,' . $this->route('user'), 
            'name' => 'required|string|max:255', 
            'password' => 'nullable|string|min:8|confirmed', 
            'state' => 'required|string|max:255', 
            'district' => 'required|string|max:255', 
            'role' => 'required|integer|in:' . User::SUPER_ADMIN . ',' . User::STATE_ADMIN . ',' . User::PPD_ADMIN . ',' . User::SCHOOL_ADMIN,
        ];
    }
}
