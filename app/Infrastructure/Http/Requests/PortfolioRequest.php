<?php

namespace App\Infrastructure\Http\Requests;

final class PortfolioRequest
{
    public static function rules(): array
    {
        return [
            'title' => 'required|max_length[255]',
            'description' => 'permit_empty',
            'project_url' => 'permit_empty|max_length[255]',
            'skills' => 'permit_empty|max_length[500]',
            'id_lang' => 'required|is_natural_no_zero',
            'status' => 'required|in_list[0,1]',
            'item' => 'permit_empty|integer',
            'main_portfolio_id' => 'permit_empty|is_natural_no_zero',
        ];
    }
}
