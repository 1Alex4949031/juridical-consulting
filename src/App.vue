<script setup lang="ts">
import HeroBento from './components/HeroBento.vue'
import ServiceBentoGrid from './components/ServiceBentoGrid.vue'
import ConsultationPanel from './components/ConsultationPanel.vue'
import SiteFooter from './components/SiteFooter.vue'
import ApplicationsPage from './components/ApplicationsPage.vue'
import { useAppNavigation } from './composables/useAppNavigation'
import { legalServices, practiceStats } from './data/legalServices'

const { page } = useAppNavigation()
</script>

<template>
  <ApplicationsPage v-if="page === 'applications'" />
  <main v-else class="app-shell">
    <HeroBento :stats="practiceStats" />
    <ServiceBentoGrid :services="legalServices" />
    <ConsultationPanel :services="legalServices" />
    <SiteFooter />
  </main>
</template>
