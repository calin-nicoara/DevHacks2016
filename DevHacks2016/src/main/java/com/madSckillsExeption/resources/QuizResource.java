package com.madSckillsExeption.resources;

import com.madSckillsExeption.entities.Quiz;
import com.madSckillsExeption.repositories.QuizRestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/custom/quizzes")
public class QuizResource {

    private QuizRestRepository quizRestRepository;

    @Autowired
    public QuizResource(QuizRestRepository quizRestRepository) {
        this.quizRestRepository = quizRestRepository;
    }

    @GetMapping
    public ResponseEntity<List<Quiz>> getQuizBySubject(@RequestParam("subjectId") Long subjectId) {
        return ResponseEntity.ok(quizRestRepository.findBySubjectId(subjectId));
    }
}
