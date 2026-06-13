<?php

namespace App\Infrastructure\Http\Requests;

final class ServiceRequest
{
    public static function rules(): array
    {
        return [
            'title' => 'required|max_length[255]',
            'id_lang' => 'required|is_natural_no_zero',
            'status' => 'required|in_list[0,1]',
            'item' => 'permit_empty|integer',
            'main_service_id' => 'permit_empty|is_natural_no_zero',
        ];
    }
}
