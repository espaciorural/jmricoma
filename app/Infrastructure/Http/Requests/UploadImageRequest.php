<?php

namespace App\Infrastructure\Http\Requests;

final class UploadImageRequest
{
    public static function rules(): array
    {
        return [
            'file' => 'uploaded[file]|max_size[file,8192]|is_image[file]|mime_in[file,image/jpg,image/jpeg,image/png,image/webp]',
            'id_section' => 'permit_empty|is_natural_no_zero',
            'type' => 'permit_empty|max_length[100]',
            'newFilename' => 'permit_empty|max_length[255]',
        ];
    }
}
