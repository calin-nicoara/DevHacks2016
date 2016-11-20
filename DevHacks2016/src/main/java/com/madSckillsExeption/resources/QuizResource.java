package com.madSckillsExeption.resources;

import com.madSckillsExeption.repositories.QuizRestRepository;
import com.madSckillsExeption.resources.models.QuizModel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/custom/quizzes")
public class QuizResource {

    private QuizRestRepository quizRestRepository;

    @Autowired
    public QuizResource(QuizRestRepository quizRestRepository) {
        this.quizRestRepository = quizRestRepository;
    }

    @GetMapping
    public ResponseEntity<List<QuizModel>> getQuizBySubject(@RequestParam("subjectId") Long subjectId) {
        return ResponseEntity.ok(quizRestRepository.findBySubjectId(subjectId).stream()
                .map(quiz -> QuizModel.builder()
                        .id(quiz.getId())
                        .name(quiz.getName())
                        .level(quiz.getLevel())
                        .subjectName(quiz.getSubject().getName())
                        .authorId(quiz.getUser().getId())
                        .authorName(quiz.getUser().getFullName())
                        .subjectName(quiz.getSubject().getName())
                        .imageLink(quiz.getSubject().getLinkImage())
                        .rewardPoints(quiz.getRewardPoints())
                        .build())
                .collect(Collectors.toList()));
    }
}
