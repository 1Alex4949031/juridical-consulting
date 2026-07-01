<script setup lang="ts">
import HeroBento from './components/HeroBento.vue'
import ServiceBentoGrid from './components/ServiceBentoGrid.vue'
import ConsultationPanel from './components/ConsultationPanel.vue'
import SiteFooter from './components/SiteFooter.vue'
import { legalServices, practiceStats } from './data/legalServices'
</script>

<template>
  <main class="app-shell">
    <HeroBento :stats="practiceStats" />
    <ServiceBentoGrid :services="legalServices" />
    <ConsultationPanel :services="legalServices" />
    <SiteFooter />
  </main>
</template>
