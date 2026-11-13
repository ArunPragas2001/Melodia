import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Page from "../components/Page";
import { Button, Heading, Stat } from "../components/UI";
import questions from "../data/questions.json";
import { useLibrary } from "../storage/LibraryContext";
import colors from "../theme/colors";
import styles from "../theme/styles";

export default function QuizScreen() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);
  const { addScore, saving, error } = useLibrary();
  const question = questions[index];
  const answered = selected !== null;

  async function next() {
    const nextScore = score + (selected === question.answer ? 1 : 0);
    setScore(nextScore);

    if (index === questions.length - 1) {
      setResult(nextScore);
      await addScore(nextScore, questions.length);
      return;
    }

    setIndex((current) => current + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setResult(null);
  }

  if (result !== null) {
    const percent = Math.round((result / questions.length) * 100);
    return (
      <Page>
        <Heading eyebrow="QUIZ COMPLETE" title="Well played!" />
        <View style={[styles.card, quizStyles.result]}>
          <Ionicons name="trophy-outline" size={40} color={colors.orange} />
          <Text style={quizStyles.score}>
            {result}/{questions.length}
          </Text>
          <Text style={styles.heading}>
            {percent === 100
              ? "A pitch-perfect result."
              : percent >= 50
                ? "A strong performance."
                : "Every answer teaches something new."}
          </Text>
          <Text style={[styles.muted, { textAlign: "center" }]}> 
            {saving ? "Saving your score…" : "Your score is saved to your profile."}
          </Text>
        </View>
        <View style={quizStyles.stats}>
          <Stat value={`${percent}%`} label="ACCURACY" icon="checkmark-circle-outline" />
          <Stat value={questions.length} label="QUESTIONS" icon="musical-notes-outline" />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label="Try again" icon="refresh-outline" onPress={restart} />
      </Page>
    );
  }

  return (
    <Page>
      <Heading
        eyebrow="MUSIC QUIZ"
        title="Test your knowledge."
        description="Choose an answer and learn from each explanation."
      />

      <View style={{ gap: 10 }}>
        <View style={styles.between}>
          <Text style={styles.muted}>
            Question {index + 1} of {questions.length}
          </Text>
          <Text style={quizStyles.progressText}>{score} correct</Text>
        </View>
        <View style={quizStyles.progress} accessibilityRole="progressbar">
          {questions.map((item, itemIndex) => (
            <View
              key={item.id}
              style={[
                quizStyles.progressStep,
                itemIndex <= index && { backgroundColor: colors.purple },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={[styles.card, { padding: 24 }]}>
        <Ionicons name="musical-notes-outline" size={28} color={colors.orange} />
        <Text style={quizStyles.question}>{question.question}</Text>
      </View>

      <View style={{ gap: 11 }}>
        {question.options.map((option, optionIndex) => {
          const correct = answered && optionIndex === question.answer;
          const wrong = answered && selected === optionIndex && !correct;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityLabel={option}
              accessibilityState={{ selected: selected === optionIndex, disabled: answered }}
              disabled={answered}
              onPress={() => setSelected(optionIndex)}
              style={({ pressed }) => [
                styles.card,
                quizStyles.option,
                correct && quizStyles.correct,
                wrong && quizStyles.wrong,
                pressed && styles.pressed,
              ]}
            >
              <Text style={quizStyles.letter}>
                {String.fromCharCode(65 + optionIndex)}
              </Text>
              <Text style={[styles.text, { flex: 1 }]}>{option}</Text>
              {correct || wrong ? (
                <Ionicons
                  name={correct ? "checkmark-circle" : "close-circle"}
                  size={22}
                  color={correct ? colors.green : colors.red}
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {answered ? (
        <>
          <View style={[styles.card, quizStyles.explanation]}>
            <Text style={styles.heading}>
              {selected === question.answer ? "Correct!" : "Keep learning"}
            </Text>
            <Text style={styles.text}>
              Answer: {question.options[question.answer]}
            </Text>
            <Text style={styles.muted}>{question.explanation}</Text>
          </View>
          <Button
            label={index === questions.length - 1 ? "View result" : "Next question"}
            onPress={next}
          />
        </>
      ) : (
        <Text style={[styles.muted, { textAlign: "center" }]}>Choose one answer.</Text>
      )}
    </Page>
  );
}

const quizStyles = StyleSheet.create({
  progressText: { color: colors.purple, fontSize: 12 },
  progress: { flexDirection: "row", gap: 6 },
  progressStep: { height: 4, flex: 1, borderRadius: 4, backgroundColor: colors.border },
  question: { color: colors.text, fontSize: 24, lineHeight: 32, fontWeight: "700" },
  option: { flexDirection: "row", alignItems: "center", gap: 13, padding: 15 },
  letter: { color: colors.purple, fontWeight: "800", width: 22 },
  correct: { borderColor: colors.green, backgroundColor: colors.greenSoft },
  wrong: { borderColor: colors.red, backgroundColor: colors.redSoft },
  explanation: { backgroundColor: colors.purpleSoft },
  result: { alignItems: "center", paddingVertical: 34, backgroundColor: colors.purpleSoft },
  score: { color: colors.text, fontSize: 58, fontWeight: "800", letterSpacing: -3 },
  stats: { flexDirection: "row", gap: 11 },
});
