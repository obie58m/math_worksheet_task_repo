<script setup>
const props = defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: "" }
});
const emit = defineEmits(["close"]);
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content" role="dialog" :aria-labelledby="`modal-title`" aria-modal="true">
      <header class="modal-header">
        <h2 id="modal-title">{{ title }}</h2>
        <button class="modal-close" @click="emit('close')" aria-label="Close">×</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal-content {
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.25);
  animation: pop .3s ease;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.modal-close {
  border: none;
  background: transparent;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>