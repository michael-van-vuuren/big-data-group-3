package com.Backend.Backend;

import com.Backend.Backend.exception.EmailAlreadyExistsException;
import com.Backend.Backend.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class GlobalExceptionHandlerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        // Standalone setup: a controller that always throws EmailAlreadyExistsException
        mockMvc = MockMvcBuilders
                .standaloneSetup(new TestController())
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void handleEmailAlreadyExistsException_shouldReturnBadRequest_withExpectedBody() throws Exception {
        mockMvc.perform(get("/test"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Email already in use!"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    // Dummy controller to simulate the exception being thrown
    @RestController
    static class TestController {
        @GetMapping("/test")
        public String triggerException() {
            throw new EmailAlreadyExistsException("Email already in use!");
        }
    }
}
