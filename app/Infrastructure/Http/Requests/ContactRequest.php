<?php

namespace App\Infrastructure\Http\Requests;

final class ContactRequest
{
    public static function rules(): array
    {
        return [
            'name' => 'required|max_length[120]',
            'email' => 'required|valid_email|max_length[180]',
            'message' => 'required|max_length[4000]',
            'captchaToken' => 'permit_empty|max_length[4000]',
        ];
    }
}
