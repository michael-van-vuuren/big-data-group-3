package com.Backend.Backend;

import com.Backend.Backend.entity.Flavor;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FlavorTest {

    @Test
    void constructorSetsNameAndEmptyProducts() {
        Flavor f = new Flavor("Chocolate");
        assertEquals("Chocolate", f.getName());
        assertTrue(f.getProducts().isEmpty());
    }
}
