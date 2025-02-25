package com.Backend.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.Backend.Backend.entity.Student;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {

    // update a student's mark
    @Modifying
    @Transactional
    @Query("UPDATE Student s SET s.mark = :mark WHERE s.id = :id")
    void updateStudentMark(int id, int mark);
}
