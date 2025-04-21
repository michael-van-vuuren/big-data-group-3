// File: FlavorControllerTest.java
package com.Backend.Backend.ControllerTests;

import com.Backend.Backend.controller.FlavorController;
import com.Backend.Backend.dto.FlavorDTO;
import com.Backend.Backend.entity.Flavor;
import com.Backend.Backend.repository.FlavorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class FlavorControllerTest {

    private MockMvc mockMvc;
    private FlavorRepository repo;

    @BeforeEach
    void setUp() {
        repo = mock(FlavorRepository.class);
        mockMvc = MockMvcBuilders.standaloneSetup(new FlavorController(repo)).build();
    }

    @Test
    void getAllFlavors_returnsDtos() throws Exception {
        when(repo.findAll()).thenReturn(List.of(new Flavor("Choco"), new Flavor("Vanilla")));

        mockMvc.perform(get("/api/flavors/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Choco"))
                .andExpect(jsonPath("$[1].name").value("Vanilla"));
    }
}
