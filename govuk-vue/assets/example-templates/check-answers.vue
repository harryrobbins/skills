<template>
  <div>
    <GvBackLink href="/form">Back</GvBackLink>

    <h1 class="govuk-heading-xl">Check your answers</h1>

    <GvSummaryList
      :rows="summaryRows"
    />

    <h2 class="govuk-heading-m">Now send your application</h2>

    <p class="govuk-body">
      By submitting this application you are confirming that, to the best of your knowledge,
      the details you are providing are correct.
    </p>

    <GvButton @click="handleSubmit">
      Accept and send
    </GvButton>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { GvBackLink, GvButton, GvSummaryList } from 'govuk-vue'

const router = useRouter()

// In a real application, this data would come from a store or props
const applicationData = {
  name: 'John Smith',
  email: 'john.smith@example.com',
  dateOfBirth: '15 March 1980',
  address: '123 High Street, London, SW1A 1AA',
  contactMethod: 'Email'
}

const summaryRows = computed(() => [
  {
    key: { text: 'Name' },
    value: { text: applicationData.name },
    actions: {
      items: [
        {
          href: '/form?field=name',
          text: 'Change',
          visuallyHiddenText: 'name'
        }
      ]
    }
  },
  {
    key: { text: 'Email address' },
    value: { text: applicationData.email },
    actions: {
      items: [
        {
          href: '/form?field=email',
          text: 'Change',
          visuallyHiddenText: 'email address'
        }
      ]
    }
  },
  {
    key: { text: 'Date of birth' },
    value: { text: applicationData.dateOfBirth },
    actions: {
      items: [
        {
          href: '/form?field=dob',
          text: 'Change',
          visuallyHiddenText: 'date of birth'
        }
      ]
    }
  },
  {
    key: { text: 'Address' },
    value: { text: applicationData.address },
    actions: {
      items: [
        {
          href: '/form?field=address',
          text: 'Change',
          visuallyHiddenText: 'address'
        }
      ]
    }
  },
  {
    key: { text: 'Contact method' },
    value: { text: applicationData.contactMethod },
    actions: {
      items: [
        {
          href: '/form?field=contact',
          text: 'Change',
          visuallyHiddenText: 'contact method'
        }
      ]
    }
  }
])

const handleSubmit = () => {
  // Submit the application
  console.log('Application submitted')
  router.push('/confirmation')
}
</script>
