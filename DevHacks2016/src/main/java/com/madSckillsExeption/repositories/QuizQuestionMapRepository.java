package com.madSckillsExeption.repositories;

import com.madSckillsExeption.entities.QuizQuestionMap;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "quizQuestionMaps", path = "quizQuestionMaps")
public interface QuizQuestionMapRepository extends JpaRepository<QuizQuestionMap, Long>{

    List<QuizQuestionMap> findByQuizId(Long quizId, Pageable pageRequest);
}
