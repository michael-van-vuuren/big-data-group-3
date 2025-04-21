package com.Backend.Backend.exception;

// Global exception created for clarity
public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
