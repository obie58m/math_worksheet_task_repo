<script setup>
const props = defineProps({
  q: { type: Object, required: true },
  index: { type: Number, required: true },
  picked: { type: Number, default: null },
  submitted: { type: Boolean, default: false },
  correctIndex: { type: Number, required: true }
});

const emit = defineEmits(['update:picked']);

function optionClass(oi) {
  if (!props.submitted) return '';
  if (oi === props.correctIndex) return 'correct';
  if (props.picked === oi && oi !== props.correctIndex) return 'wrong';
  return '';
}

function markFor(oi) {
  if (!props.submitted) return '';
  if (props.picked === oi && oi === props.correctIndex) return '\u2713';   
  if (props.picked === oi && oi !== props.correctIndex) return '\u2717';  
  return '';
}

function markClass(oi) {
  if (!props.submitted) return '';
  if (props.picked === oi && oi === props.correctIndex) return 'mark-correct';
  if (props.picked === oi && oi !== props.correctIndex) return 'mark-wrong';
  return '';
}

function hintLabel(oi) {
  if (!props.submitted) return '';
  if (props.picked === oi && oi === props.correctIndex) return 'Correct';       
  if (props.picked === oi && oi !== props.correctIndex) return 'Your Answer';    
  if (oi === props.correctIndex) return 'Correct answer';                      
  return '';
}

function hintClass(oi) {
  if (!props.submitted) return '';
  if (props.picked === oi && oi === props.correctIndex) return 'hint-correct';
  if (props.picked === oi && oi !== props.correctIndex) return 'hint-wrong';
  if (oi === props.correctIndex) return 'hint-answer';
  return '';
}
</script>

<template>
  <fieldset class="card">
    <legend class="q">{{ q.id }}. {{ q.text }}</legend>
    <div class="opts">
      <label
        v-for="(opt, oi) in q.options"
        :key="oi"
        class="opt"
        :class="optionClass(oi)"
      >
        <input
          type="radio"
          :name="'q' + index"
          :value="oi"
          :checked="picked === oi"
          :disabled="submitted"
          :aria-label="`Option ${String.fromCharCode(97 + oi)}: ${opt}`"
          @change="$emit('update:picked', oi)"
        />
        <span>{{ String.fromCharCode(97 + oi) }}.</span>
        <span>{{ opt }}</span>

        <span v-if="markFor(oi)" class="mark" :class="markClass(oi)">
          {{ markFor(oi) }}
        </span>

        <span v-if="hintLabel(oi)" class="hint" :class="hintClass(oi)">
          {{ hintLabel(oi) }}
        </span>
      </label>
    </div>
  </fieldset>
</template>