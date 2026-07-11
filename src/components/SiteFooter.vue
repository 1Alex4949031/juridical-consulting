<script setup lang="ts">
import logoUrl from '../assets/logo.svg'
</script>

<template>
  <footer class="site-footer">
    <strong class="footer-brand">
      <span class="footer-logo" aria-hidden="true">
        <img :src="logoUrl" alt="" width="34" height="34" />
      </span>
      <span>Линия Права</span>
    </strong>
    <address>
      Новосибирск<br />
      hello@line-law.ru<br />
      +7 383 000-19-90
    </address>
  </footer>
</template>

<style scoped>
.site-footer {
  display: flex;
  justify-content: space-between;
  gap: var(--space-5);
  width: 100%;
  margin: 0;
  padding: 28px 88px;
  border-top: 1px solid #333333;
  background: var(--surface-inverse);
  color: var(--foreground-inverse);
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.footer-logo {
  display: inline-grid;
  width: 40px;
  height: 40px;
  place-items: center;
  flex: 0 0 auto;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.56);
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.07);
}

.footer-logo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.site-footer address {
  margin: 0;
  color: #c8c8c8;
  font-style: normal;
  line-height: 1.55;
  text-align: right;
}

@media (max-width: 640px) {
  .site-footer {
    flex-direction: column;
    padding: 28px;
  }

  .site-footer address {
    text-align: left;
  }
}
</style>
