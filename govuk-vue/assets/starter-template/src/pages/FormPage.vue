<template>
  <div>
    <GvBackLink href="/">Back</GvBackLink>

    <GvErrorSummary
      v-if="errors.length > 0"
      title="There is a problem"
      :error-list="errors"
    />

    <h1 class="govuk-heading-xl">Example Form</h1>

    <form @submit.prevent="handleSubmit">
      <GvTextInput
        v-model="formData.name"
        label="Full name"
        hint="Enter your full name as it appears on your passport"
        :error-message="getError('name')"
      />

      <GvTextInput
        v-model="formData.email"
        label="Email address"
        type="email"
        :error-message="getError('email')"
      />

      <GvRadios
        v-model="formData.contact"
        legend="How would you prefer to be contacted?"
        :items="[
          { value: 'email', text: 'Email' },
          { value: 'phone', text: 'Phone' },
          { value: 'text', text: 'Text message' }
        ]"
        :error-message="getError('contact')"
      />

      <GvButton type="submit">
        Continue
      </GvButton>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  GvBackLink,
  GvButton,
  GvTextInput,
  GvRadios,
  GvErrorSummary
} from 'govuk-vue'

const router = useRouter()

const formData = reactive({
  name: '',
  email: '',
  contact: ''
})

const errors = ref([])

const getError = (field) => {
  const error = errors.value.find(e => e.href === `#${field}`)
  return error ? error.text : ''
}

const handleSubmit = () => {
  errors.value = []

  // Validation
  if (!formData.name) {
    errors.value.push({
      text: 'Enter your full name',
      href: '#name'
    })
  }

  if (!formData.email) {
    errors.value.push({
      text: 'Enter your email address',
      href: '#email'
    })
  }

  if (!formData.contact) {
    errors.value.push({
      text: 'Select how you would like to be contacted',
      href: '#contact'
    })
  }

  if (errors.value.length === 0) {
    // Form is valid - proceed to next page
    console.log('Form submitted:', formData)
    // router.push('/next-page')
  } else {
    // Scroll to error summary
    window.scrollTo(0, 0)
  }
}
</script>
