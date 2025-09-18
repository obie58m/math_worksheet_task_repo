<script setup>
import { ref, computed, nextTick, onMounted } from 'vue';
import QuestionCard from './components/QuestionCard.vue';
import Modal from './components/Modal.vue';
import { questions } from './constants/questions';

const name = ref('');
const answers = ref(Array(questions.length).fill(null));
const submitted = ref(false);
const errorMsg = ref('');
const nameRef = ref(null);
const scoreRef = ref(null);
const highs = ref([]);
const showModal = ref(false);

const API_URL = import.meta.env.VITE_API_URL || '/api';

const score = computed(() =>
  answers.value.reduce(
    (acc, ans, i) => acc + (ans === questions[i].correct ? 1 : 0),
    0
  )
);

async function validate() {
  if (!name.value.trim()) {
    errorMsg.value = 'Name is required.';
    await nextTick();
    nameRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    nameRef.value?.focus();
    return false;
  }
  errorMsg.value = '';
  return true;
}

async function submit() {
  const ok = await validate();
  if (!ok) return;
  submitted.value = true;
  await saveHighScore();
  await fetchHighScores();
  nextTick(() => {
    scoreRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    scoreRef.value?.focus();
  });
  
  showModal.value = true;
}

function resetAll() {
  // Preserve the user's name but clear answers and submission state
  answers.value = Array(questions.length).fill(null);
  submitted.value = false;
  errorMsg.value = '';
}

async function saveHighScore() {
  try {
    const res = await fetch(`${API_URL}/scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.value.trim(), score: score.value })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.warn('Failed to save high score', res.status, body);
    }
  } catch (err) {
    console.error("Error saving score", err);
  }
}

async function fetchHighScores() {
  try {
    const res = await fetch(`${API_URL}/scores`);
    if (!res.ok) throw new Error("Failed to fetch scores");
    highs.value = await res.json();
  } catch (err) {
    console.error("Error fetching scores", err);
    highs.value = [];
  }
}

onMounted(fetchHighScores);
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>Rounding Off to Nearest 10</h1>
      <div class="meta">
        <div class="field">
          <label for="name">Name:</label>
          <input
            id="name"
            ref="nameRef"
            v-model="name"
            :class="{ 'input-error': errorMsg }"
            :aria-invalid="!!errorMsg"
            placeholder="Type your name"
          />
        </div>
        <div class="field">
          <label>Score:</label>
          <span
            ref="scoreRef"
            class="score"
            :class="{ 'score-pop': submitted }"
            tabindex="-1"
          >
            {{ submitted ? score : '—' }}/12
          </span>
        </div>
      </div>
    </header>

    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p class="instructions">Circle the correct answers.</p>

    <div class="grid">
      <QuestionCard
        v-for="(q, i) in questions"
        :key="q.id"
        :q="q"
        :index="i"
        v-model:picked="answers[i]"
        :submitted="submitted"
        :correct-index="q.correct"
      />
    </div>

    <div class="toolbar">
      <button class="btn-primary" @click="submit" :disabled="submitted">
        Submit
      </button>
      <button class="btn-secondary" @click="resetAll">Reset</button>
      <button class="btn-secondary" @click="showModal = true">
        View High Scores
      </button>
    </div>

    <Modal :show="showModal" title="High Scores" @close="showModal = false">
      <div class="highscores">

        <div class="your-score" v-if="submitted">
          <p><strong>Your Score:</strong> {{ score }}/12</p>
        </div>

        <ol v-if="highs.length">
          <li
            v-for="(h, i) in highs"
            :key="i"
            :class="{ me: h.name === name }"
          >
            <span class="rank">#{{ i + 1 }}</span>
            <span class="player">{{ h.name }}</span>
            <span class="points">{{ h.score }}/12</span>
            <span class="time">{{ new Date(h.created_at).toLocaleString() }}</span>
          </li>
        </ol>
        <p v-else>No scores yet.</p>
      </div>
    </Modal>

    <footer class="footer">
      copyright:
      <a href="https://www.mathinenglish.com" target="_blank">
        www.mathinenglish.com
      </a>
    </footer>
  </div>
</template>
