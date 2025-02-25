package com.Backend.Backend.controller;

import com.Backend.Backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // update a student's mark
    @PutMapping("/{id}/mark/{mark}")
    public ResponseEntity<String> updateMark(@PathVariable int id, @PathVariable int mark) {
        boolean updated = studentService.updateStudentMark(id, mark);
        return updated ? ResponseEntity.ok("Student updated!") : ResponseEntity.notFound().build();
    }
}
