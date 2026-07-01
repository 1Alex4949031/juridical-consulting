<template>
  <footer class="site-footer">
    <strong>Линия Права</strong>
    <address>
      Москва, Никольская 10<br />
      hello@line-law.ru<br />
      +7 495 000-19-90
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

.site-footer strong {
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.875rem;
  text-transform: uppercase;
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
