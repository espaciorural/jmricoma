<?php

namespace App\Infrastructure\DependencyInjection;

use App\Application\Auth\LoginUserUseCase;
use App\Application\Images\CheckImageUseCase;
use App\Application\Images\DeleteImageUseCase;
use App\Application\Images\GetImagesUseCase;
use App\Application\Images\UploadImageUseCase;
use App\Application\Portfolio\CreatePortfolioUseCase;
use App\Application\Portfolio\DeletePortfolioUseCase;
use App\Application\Portfolio\GetPortfolioUseCase;
use App\Application\Portfolio\ListPortfolioUseCase;
use App\Application\Portfolio\UpdatePortfolioUseCase;
use App\Application\Services\CreateServiceUseCase;
use App\Application\Services\DeleteServiceUseCase;
use App\Application\Services\GetServiceUseCase;
use App\Application\Services\ListServicesUseCase;
use App\Application\Services\UpdateServiceUseCase;
use App\Domain\Images\ImageRepositoryInterface;
use App\Domain\Images\ImageStorageInterface;
use App\Domain\Images\PublicUrlGeneratorInterface;
use App\Domain\Portfolio\PortfolioRepositoryInterface;
use App\Domain\Services\ServiceRepositoryInterface;
use App\Infrastructure\Auth\CodeIgniterAccessRepository;
use App\Infrastructure\Auth\JwtTokenGenerator;
use App\Infrastructure\Auth\NativePasswordVerifier;
use App\Infrastructure\Images\CodeIgniterImageRepository;
use App\Infrastructure\Images\CodeIgniterPublicUrlGenerator;
use App\Infrastructure\Images\LocalPublicImageStorage;
use App\Infrastructure\Portfolio\CodeIgniterPortfolioRepository;
use App\Infrastructure\Services\CodeIgniterServiceRepository;
use App\Models\AccessModel;
use App\Models\ImageModel;
use App\Models\PortfolioModel;
use App\Models\ServiceModel;

final class ApplicationServices
{
    public static function loginUserUseCase(): LoginUserUseCase
    {
        return new LoginUserUseCase(
            new CodeIgniterAccessRepository(new AccessModel()),
            new NativePasswordVerifier(),
            new JwtTokenGenerator(env('JWT_SECRET_KEY'))
        );
    }

    public static function listServicesUseCase(): ListServicesUseCase
    {
        return new ListServicesUseCase(self::serviceRepository());
    }

    public static function getServiceUseCase(): GetServiceUseCase
    {
        return new GetServiceUseCase(self::serviceRepository());
    }

    public static function createServiceUseCase(): CreateServiceUseCase
    {
        return new CreateServiceUseCase(self::serviceRepository());
    }

    public static function updateServiceUseCase(): UpdateServiceUseCase
    {
        return new UpdateServiceUseCase(self::serviceRepository());
    }

    public static function deleteServiceUseCase(): DeleteServiceUseCase
    {
        return new DeleteServiceUseCase(self::serviceRepository());
    }

    public static function listPortfolioUseCase(): ListPortfolioUseCase
    {
        return new ListPortfolioUseCase(self::portfolioRepository());
    }

    public static function getPortfolioUseCase(): GetPortfolioUseCase
    {
        return new GetPortfolioUseCase(self::portfolioRepository());
    }

    public static function createPortfolioUseCase(): CreatePortfolioUseCase
    {
        return new CreatePortfolioUseCase(self::portfolioRepository());
    }

    public static function updatePortfolioUseCase(): UpdatePortfolioUseCase
    {
        return new UpdatePortfolioUseCase(self::portfolioRepository());
    }

    public static function deletePortfolioUseCase(): DeletePortfolioUseCase
    {
        return new DeletePortfolioUseCase(
            self::portfolioRepository(),
            self::imageRepository(),
            self::imageStorage()
        );
    }

    public static function getImagesUseCase(): GetImagesUseCase
    {
        return new GetImagesUseCase(
            self::imageRepository(),
            self::publicUrlGenerator()
        );
    }

    public static function uploadImageUseCase(): UploadImageUseCase
    {
        return new UploadImageUseCase(
            self::imageStorage(),
            self::imageRepository()
        );
    }

    public static function deleteImageUseCase(): DeleteImageUseCase
    {
        return new DeleteImageUseCase(
            self::imageRepository(),
            self::imageStorage()
        );
    }

    public static function checkImageUseCase(): CheckImageUseCase
    {
        return new CheckImageUseCase(
            self::imageStorage(),
            self::publicUrlGenerator()
        );
    }

    private static function serviceRepository(): ServiceRepositoryInterface
    {
        return new CodeIgniterServiceRepository(new ServiceModel());
    }

    private static function portfolioRepository(): PortfolioRepositoryInterface
    {
        return new CodeIgniterPortfolioRepository(new PortfolioModel());
    }

    private static function imageRepository(): ImageRepositoryInterface
    {
        return new CodeIgniterImageRepository(new ImageModel());
    }

    private static function imageStorage(): ImageStorageInterface
    {
        return new LocalPublicImageStorage(FCPATH . 'uploads/');
    }

    private static function publicUrlGenerator(): PublicUrlGeneratorInterface
    {
        return new CodeIgniterPublicUrlGenerator();
    }
}
