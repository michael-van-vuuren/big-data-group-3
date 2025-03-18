package com.Backend.Backend.util;

public class StringUtils {
    private StringUtils() {}

    public static String safeGet(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
