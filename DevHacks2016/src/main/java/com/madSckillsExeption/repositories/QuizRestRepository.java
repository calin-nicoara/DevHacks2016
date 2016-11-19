package com.madSckillsExeption.repositories;

import com.madSckillsExeption.entities.Quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "quizes", path = "api/quizes")
public interface QuizRestRepository extends JpaRepository<Quiz, Long>{
}
