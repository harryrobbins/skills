<template>
  <div>
    <h1 class="govuk-heading-xl">Apply for a licence</h1>

    <h2 class="govuk-heading-s govuk-!-margin-bottom-2">
      Application incomplete
    </h2>
    <p class="govuk-body govuk-!-margin-bottom-7">
      You have completed {{ completedTasks }} of {{ totalTasks }} sections.
    </p>

    <ol class="govuk-task-list">
      <li>
        <h2 class="govuk-task-list__section">
          <span class="govuk-task-list__section-number">1. </span>
          Check before you start
        </h2>
        <ul class="govuk-task-list__items">
          <li class="govuk-task-list__item">
            <span class="govuk-task-list__name-and-hint">
              <a class="govuk-link govuk-task-list__link" href="/eligibility">
                Check eligibility
              </a>
            </span>
            <GvTag class="govuk-task-list__status" colour="blue">
              Completed
            </GvTag>
          </li>
        </ul>
      </li>

      <li>
        <h2 class="govuk-task-list__section">
          <span class="govuk-task-list__section-number">2. </span>
          Prepare application
        </h2>
        <ul class="govuk-task-list__items">
          <li class="govuk-task-list__item">
            <span class="govuk-task-list__name-and-hint">
              <a class="govuk-link govuk-task-list__link" href="/personal-details">
                Provide personal details
              </a>
            </span>
            <GvTag class="govuk-task-list__status" colour="blue">
              Completed
            </GvTag>
          </li>
          <li class="govuk-task-list__item">
            <span class="govuk-task-list__name-and-hint">
              <a class="govuk-link govuk-task-list__link" href="/qualifications">
                Add qualifications
              </a>
            </span>
            <GvTag class="govuk-task-list__status">
              In progress
            </GvTag>
          </li>
          <li class="govuk-task-list__item">
            <span class="govuk-task-list__name-and-hint">
              <span>Upload documents</span>
            </span>
            <GvTag class="govuk-task-list__status" colour="grey">
              Cannot start yet
            </GvTag>
          </li>
        </ul>
      </li>

      <li>
        <h2 class="govuk-task-list__section">
          <span class="govuk-task-list__section-number">3. </span>
          Apply
        </h2>
        <ul class="govuk-task-list__items">
          <li class="govuk-task-list__item">
            <span class="govuk-task-list__name-and-hint">
              <span>Check your answers and submit</span>
            </span>
            <GvTag class="govuk-task-list__status" colour="grey">
              Cannot start yet
            </GvTag>
          </li>
        </ul>
      </li>
    </ol>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { GvTag } from 'govuk-vue'

const tasks = [
  { status: 'completed' },
  { status: 'completed' },
  { status: 'in-progress' },
  { status: 'not-started' },
  { status: 'not-started' }
]

const completedTasks = computed(() =>
  tasks.filter(t => t.status === 'completed').length
)

const totalTasks = computed(() => tasks.length)
</script>
