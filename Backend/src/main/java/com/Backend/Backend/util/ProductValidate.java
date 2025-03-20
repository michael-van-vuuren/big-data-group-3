package com.Backend.Backend.util;

import com.Backend.Backend.entity.Product;

import java.math.BigDecimal;

public class ProductValidate {
    private ProductValidate() {}

    public static String validate(String value) {
        if (value == null) return null;
        value = value.trim();
        return value.isEmpty() ? null : value;
    }

    public static BigDecimal validate(BigDecimal value) {
        return (value == null || value.signum() < 0) ? null : value;
    }

    public static Product.Availability validateAvailability(String availability) {
        if (availability == null) return null;
        availability = availability.trim();
        if (availability.isEmpty()) return null;

        try {
            return Product.Availability.valueOf(availability.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
