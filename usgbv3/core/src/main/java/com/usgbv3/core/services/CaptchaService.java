package com.usgbv3.core.services;

public interface CaptchaService {
    Boolean validateCaptcha(String recaptchaResponse);
}
