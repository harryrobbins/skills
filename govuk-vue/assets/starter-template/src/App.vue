<template>
  <GvHeader
    service-name="My Service"
    service-url="/"
  />

  <GvWidthContainer>
    <GvPhaseBanner tag="Beta">
      This is a new service – your feedback will help us to improve it.
    </GvPhaseBanner>

    <GvMainWrapper>
      <router-view />
    </GvMainWrapper>
  </GvWidthContainer>

  <GvFooter />
</template>

<script setup>
import {
  GvHeader,
  GvFooter,
  GvWidthContainer,
  GvMainWrapper,
  GvPhaseBanner
} from 'govuk-vue'
</script>
