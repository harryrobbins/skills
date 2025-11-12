<template>
  <div>
    <GvBackLink href="/">Back</GvBackLink>

    <GvErrorSummary
      v-if="errors.length > 0"
      title="There is a problem"
      :error-list="errors"
    />

    <form @submit.prevent="handleSubmit">
      <fieldset class="govuk-fieldset">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
          <h1 class="govuk-fieldset__heading">
            What is your nationality?
          </h1>
        </legend>

        <GvDetails summary-text="Help with nationality">
          <p class="govuk-body">
            We need to know your nationality so we can work out which elections you're entitled to vote in.
            If you have more than one nationality, select all that apply.
          </p>
        </GvDetails>

        <GvCheckboxes
          v-model="selectedNationalities"
          :items="[
            {
              value: 'british',
              text: 'British',
              hint: { text: 'including English, Scottish, Welsh and Northern Irish' }
            },
            {
              value: 'irish',
              text: 'Irish'
            },
            {
              value: 'other',
              text: 'Citizen of another country'
            }
          ]"
          :error-message="getError('nationalities')"
        />
      </fieldset>

      <GvButton type="submit">
        Continue
      </GvButton>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  GvBackLink,
  GvButton,
  GvCheckboxes,
  GvDetails,
  GvErrorSummary
} from 'govuk-vue'

const router = useRouter()
const selectedNationalities = ref([])
const errors = ref([])

const getError = (field) => {
  const error = errors.value.find(e => e.href === `#${field}`)
  return error ? error.text : ''
}

const handleSubmit = () => {
  errors.value = []

  if (selectedNationalities.value.length === 0) {
    errors.value.push({
      text: 'Select your nationality or nationalities',
      href: '#nationalities'
    })
    window.scrollTo(0, 0)
    return
  }

  // Proceed to next page
  console.log('Selected nationalities:', selectedNationalities.value)
  router.push('/next-question')
}
</script>
