<script setup lang="ts">
import { useClientsListController } from '../features/clients/controller/useClientsListController'
import ClientsListView from '../features/clients/view/ClientsListView.vue'

const { model, reload } = useClientsListController()
</script>

<template>
  <ClientsListView
    :clients="model.clients"
    :total-clients="model.totalClients"
    :is-loading="model.isLoading"
    :error="model.error"
    @reload="reload"
  />
</template>
