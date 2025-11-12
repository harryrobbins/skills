<template>
  <div>
    <h1 class="govuk-heading-xl">Welcome to GOV.UK Vue</h1>

    <p class="govuk-body-l">
      This is a starter template for building services with GOV.UK Vue.
    </p>

    <GvButton variant="primary" is-start-button @click="$router.push('/form')">
      Start now
    </GvButton>
  </div>
</template>

<script setup>
import { GvButton } from 'govuk-vue'
</script>
