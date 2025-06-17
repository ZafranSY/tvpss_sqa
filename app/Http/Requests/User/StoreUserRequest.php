<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class StoreUserRequest extends FormRequest
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
            'email' => 'required|email|unique:users,email', // Ensure the email is unique and valid
            'name' => 'required|string|max:255', // Ensure the name is a string and required
            'password' => 'required|string|min:8|confirmed', // Password must be at least 8 characters long and confirmed
            'state' => 'required|string|max:255', // Ensure the state is a string and required
            'district' => 'required|string|max:255', // Ensure the state is a string and required
            'role' => 'required|integer|in:' . User::SUPER_ADMIN . ',' . User::STATE_ADMIN . ',' . User::PPD_ADMIN . ',' . User::SCHOOL_ADMIN,
        ];
    }
}
