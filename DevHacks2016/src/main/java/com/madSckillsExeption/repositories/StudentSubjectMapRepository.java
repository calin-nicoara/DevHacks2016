package com.madSckillsExeption.repositories;

import com.madSckillsExeption.entities.StudentSubjectMap;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentSubjectMapRepository extends JpaRepository<StudentSubjectMap, Long>{
    List<StudentSubjectMap> findByUserId(Long userId);

    void deleteByUserIdAndSubjectId(Long userId, Long subjectId);

    List<StudentSubjectMap> findByUserIdAndSubjectId(Long userId, Long subjectId);

}
