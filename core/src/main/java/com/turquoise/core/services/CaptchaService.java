package com.turquoise.core.services;

public interface CaptchaService {
    Boolean validateCaptcha(String recaptchaResponse);
}
