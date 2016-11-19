package com.madSckillsExeption.repositories;

import com.madSckillsExeption.entities.Quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "quizes", path = "quizes")
public interface QuizRestRepository extends JpaRepository<Quiz, Long>{

    List<Quiz> findBySubjectId(Long subjectId);
}
