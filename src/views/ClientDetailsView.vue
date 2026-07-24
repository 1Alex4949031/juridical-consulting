<script setup lang="ts">
import { useClientDetailsController } from '../features/clients/controller/useClientDetailsController'
import ClientProfileView from '../features/clients/view/ClientProfileView.vue'

interface Props {
  clientId: number
}

const { clientId } = defineProps<Props>()
const { model, reload } = useClientDetailsController(clientId)
</script>

<template>
  <ClientProfileView
    :client="model.client"
    :total-requests="model.totalRequests"
    :is-loading="model.isLoading"
    :error="model.error"
    @reload="reload"
  />
</template>
