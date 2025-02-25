package com.Backend.Backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Backend.Backend.repository.StudentRepository;
import com.Backend.Backend.entity.Student;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // update a student's mark
    public boolean updateStudentMark(int id, int newMark) {
        Optional<Student> student = studentRepository.findById(id);
        if (student.isPresent()) {
            studentRepository.updateStudentMark(id, newMark);
            return true;
        }
        return false;
    }
}
