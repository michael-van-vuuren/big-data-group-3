package com.Backend.Backend.EntityTests;

import com.Backend.Backend.entity.Country;
import com.Backend.Backend.entity.Producer;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class CountryTest {

    @Test
    void constructorNameOnly() {
        Country c = new Country("Brazil");
        assertEquals("Brazil", c.getName());
        assertTrue(c.getProducers().isEmpty());
        assertTrue(c.getRoasters().isEmpty());
    }

    @Test
    void constructorWithProducers() {
        Producer p = new Producer("FarmCo", "1500m", "organic");
        Country c = new Country("Kenya", Set.of(p));
        assertEquals("Kenya", c.getName());
        assertTrue(c.getRoasters().isEmpty());
        assertTrue(c.getProducers().contains(p));
    }
}
