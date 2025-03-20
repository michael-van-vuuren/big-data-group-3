package com.Backend.Backend.util;

import com.Backend.Backend.entity.Product;

import java.math.BigDecimal;

public class ProductValidate {
    private ProductValidate() {}

    public static String validate(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    public static BigDecimal validate(BigDecimal value) {
        return (value == null || value.compareTo(BigDecimal.ZERO) < 0) ? null : value;
    }

    public static Product.Availability validateAvailability(String availability) {
        if (availability == null || availability.isBlank()) {
            return null;
        }
        try {
            return Product.Availability.valueOf(availability.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

}
