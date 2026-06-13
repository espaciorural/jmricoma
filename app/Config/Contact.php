<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Contact extends BaseConfig
{
    public string $recipientEmail;
    public string $fromEmail;
    public string $fromName;
    public bool $recaptchaEnabled;
    public string $recaptchaSecretKey;
    public string $recaptchaExpectedAction;
    public float $recaptchaMinimumScore;

    public function __construct()
    {
        $this->recipientEmail = (string) env('contact.recipientEmail', 'hola@jmricoma.com');
        $this->fromEmail = (string) env('contact.fromEmail', 'hola@jmricoma.com');
        $this->fromName = (string) env('contact.fromName', 'jmricoma.com');
        $this->recaptchaEnabled = filter_var(
            env('recaptcha.enabled', ENVIRONMENT === 'production' ? 'true' : 'false'),
            FILTER_VALIDATE_BOOLEAN
        );
        $this->recaptchaSecretKey = (string) env('recaptcha.secretKey', '');
        $this->recaptchaExpectedAction = (string) env('recaptcha.expectedAction', 'contact_submit');
        $this->recaptchaMinimumScore = (float) env('recaptcha.minimumScore', 0.5);
    }
}
