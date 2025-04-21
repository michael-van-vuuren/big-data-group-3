package com.Backend.Backend.EntityTests;

import com.Backend.Backend.entity.Flavor;
import com.Backend.Backend.entity.Producer;
import com.Backend.Backend.entity.Product;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class ProductTest {

    @Test
    void defaultConstructorSetsAvailabilityNo() {
        Product p = new Product();
        assertEquals(Product.Availability.NO, p.getAvailability());
    }

    @Test
    void addFlavorAndProducer_updateBothSides() {
        Product p = new Product();
        Flavor f = new Flavor("Nutty");
        Producer prod = new Producer("FarmX", "1000m", "dry");

        p.addFlavor(f);
        assertTrue(p.getFlavors().contains(f));
        assertTrue(f.getProducts().contains(p));

        p.addProducer(prod);
        assertTrue(p.getProducers().contains(prod));
        assertTrue(prod.getProducts().contains(p));
    }

    @Test
    void priceAndBeanIdSetters() {
        Product p = new Product();
        p.setBeanId(123L);
        p.setPrice(new BigDecimal("9.99"));
        p.setGram(new BigDecimal("250"));
        p.setPricePerCup(new BigDecimal("1.25"));
        p.setBulkPricePerCup(new BigDecimal("0.95"));

        assertEquals(123L, p.getBeanId());
        assertEquals(new BigDecimal("9.99"), p.getPrice());
        assertEquals(new BigDecimal("250"), p.getGram());
        assertEquals(new BigDecimal("1.25"), p.getPricePerCup());
        assertEquals(new BigDecimal("0.95"), p.getBulkPricePerCup());
    }
}
