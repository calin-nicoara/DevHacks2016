package com.madSckillsExeption.repositories;

import com.madSckillsExeption.entities.Question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "questions", path = "api/questions")
public interface QuestionRestRepository extends JpaRepository<Question, Long>{
}
