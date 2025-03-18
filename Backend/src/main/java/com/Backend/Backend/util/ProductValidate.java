package com.Backend.Backend.util;

import java.math.BigDecimal;

public class ProductValidate {
    private ProductValidate() {}

    public static String validate(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    public static BigDecimal validate(BigDecimal value) {
        return (value == null || value.compareTo(BigDecimal.ZERO) < 0) ? null : value;
    }
}
