/**
 * Multi-Step Form Journey Example with GOV.UK React
 *
 * This example demonstrates:
 * - Multi-page form journey following "one thing per page" pattern
 * - Navigation between steps with BackLink
 * - Data persistence across steps using state management
 * - Check your answers pattern
 * - Confirmation page after submission
 * - Progress indication
 */

import React, { useState } from 'react'
import {
  GlobalStyle,
  BackLink,
  Heading,
  Caption,
  Input,
  Radio,
  Checkbox,
  TextArea,
  Button,
  ErrorSummary,
  FormGroup,
  Fieldset,
  Panel,
  Table,
  Link,
  HintText,
  WarningText,
  Tag
} from 'govuk-react'

// Main component managing the multi-step form
function MultiStepFormJourney() {
  // Current step state (1-6)
  const [currentStep, setCurrentStep] = useState(1)

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Service type
    serviceType: '',

    // Step 2: Personal details
    fullName: '',
    dateOfBirth: '',
    email: '',

    // Step 3: Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',

    // Step 4: Preferences
    contactMethod: '',
    newsletter: false,
    updates: false,

    // Step 5: Additional information
    additionalInfo: '',

    // Reference number (generated on submission)
    referenceNumber: ''
  })

  // Validation errors
  const [errors, setErrors] = useState([])

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Validation functions for each step
  const validateStep1 = () => {
    const newErrors = []
    if (!formData.serviceType) {
      newErrors.push({
        targetName: 'serviceType',
        text: 'Select which service you need'
      })
    }
    return newErrors
  }

  const validateStep2 = () => {
    const newErrors = []
    if (!formData.fullName.trim()) {
      newErrors.push({
        targetName: 'fullName',
        text: 'Enter your full name'
      })
    }
    if (!formData.dateOfBirth) {
      newErrors.push({
        targetName: 'dateOfBirth',
        text: 'Enter your date of birth'
      })
    }
    if (!formData.email.trim()) {
      newErrors.push({
        targetName: 'email',
        text: 'Enter your email address'
      })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push({
        targetName: 'email',
        text: 'Enter an email address in the correct format, like name@example.com'
      })
    }
    return newErrors
  }

  const validateStep3 = () => {
    const newErrors = []
    if (!formData.addressLine1.trim()) {
      newErrors.push({
        targetName: 'addressLine1',
        text: 'Enter your address line 1'
      })
    }
    if (!formData.city.trim()) {
      newErrors.push({
        targetName: 'city',
        text: 'Enter your town or city'
      })
    }
    if (!formData.postcode.trim()) {
      newErrors.push({
        targetName: 'postcode',
        text: 'Enter your postcode'
      })
    }
    return newErrors
  }

  const validateStep4 = () => {
    const newErrors = []
    if (!formData.contactMethod) {
      newErrors.push({
        targetName: 'contactMethod',
        text: 'Select how you would like to be contacted'
      })
    }
    return newErrors
  }

  // Navigate to next step
  const handleContinue = (e) => {
    e.preventDefault()

    // Validate current step
    let validationErrors = []
    if (currentStep === 1) validationErrors = validateStep1()
    if (currentStep === 2) validationErrors = validateStep2()
    if (currentStep === 3) validationErrors = validateStep3()
    if (currentStep === 4) validationErrors = validateStep4()

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Clear errors and move to next step
    setErrors([])
    setCurrentStep(currentStep + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Navigate to previous step
  const handleBack = () => {
    setErrors([])
    setCurrentStep(currentStep - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Change answer from check your answers page
  const handleChangeAnswer = (step) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Submit form
  const handleSubmit = () => {
    // Generate reference number
    const ref = 'SVC-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    updateFormData('referenceNumber', ref)

    // Move to confirmation page
    setCurrentStep(6)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // In a real application, send data to backend here
    console.log('Form submitted:', formData)
  }

  // Get error for specific field
  const getFieldError = (fieldName) => {
    const error = errors.find(e => e.targetName === fieldName)
    return error ? error.text : null
  }

  // Get service type label
  const getServiceTypeLabel = () => {
    const labels = {
      'new-application': 'New application',
      'renewal': 'Renewal',
      'replacement': 'Replacement',
      'change-details': 'Change of details'
    }
    return labels[formData.serviceType] || ''
  }

  // Get contact method label
  const getContactMethodLabel = () => {
    const labels = {
      'email': 'Email',
      'phone': 'Phone',
      'post': 'Post'
    }
    return labels[formData.contactMethod] || ''
  }

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      case 5:
        return renderCheckAnswers()
      case 6:
        return renderConfirmation()
      default:
        return null
    }
  }

  // Step 1: Service type selection
  const renderStep1 = () => (
    <>
      <Caption size="XLARGE">Step 1 of 4</Caption>
      <Heading size="XLARGE">What do you need to do?</Heading>

      {errors.length > 0 && (
        <ErrorSummary heading="There is a problem" errors={errors} />
      )}

      <form onSubmit={handleContinue}>
        <Fieldset>
          <Fieldset.Legend>Select the service you need</Fieldset.Legend>

          {getFieldError('serviceType') && (
            <span className="govuk-error-message">
              {getFieldError('serviceType')}
            </span>
          )}

          <Radio
            name="serviceType"
            checked={formData.serviceType === 'new-application'}
            onChange={() => updateFormData('serviceType', 'new-application')}
          >
            Submit a new application
          </Radio>

          <Radio
            name="serviceType"
            checked={formData.serviceType === 'renewal'}
            onChange={() => updateFormData('serviceType', 'renewal')}
            hint="If your existing service is about to expire"
          >
            Renew an existing service
          </Radio>

          <Radio
            name="serviceType"
            checked={formData.serviceType === 'replacement'}
            onChange={() => updateFormData('serviceType', 'replacement')}
            hint="If your service document has been lost, stolen, or damaged"
          >
            Request a replacement
          </Radio>

          <Radio
            name="serviceType"
            checked={formData.serviceType === 'change-details'}
            onChange={() => updateFormData('serviceType', 'change-details')}
          >
            Change your details
          </Radio>
        </Fieldset>

        <Button type="submit">Continue</Button>
      </form>
    </>
  )

  // Step 2: Personal details
  const renderStep2 = () => (
    <>
      <BackLink onClick={handleBack}>Back</BackLink>

      <Caption size="XLARGE">Step 2 of 4</Caption>
      <Heading size="XLARGE">Your personal details</Heading>

      {errors.length > 0 && (
        <ErrorSummary heading="There is a problem" errors={errors} />
      )}

      <form onSubmit={handleContinue}>
        <FormGroup>
          <Input
            value={formData.fullName}
            onChange={(e) => updateFormData('fullName', e.target.value)}
            meta={{
              error: getFieldError('fullName'),
              touched: true
            }}
            hint="Enter your full name as it appears on official documents"
          >
            Full name
          </Input>
        </FormGroup>

        <FormGroup>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
            meta={{
              error: getFieldError('dateOfBirth'),
              touched: true
            }}
            hint="For example, 31/03/1980"
          >
            Date of birth
          </Input>
        </FormGroup>

        <FormGroup>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            meta={{
              error: getFieldError('email'),
              touched: true
            }}
            hint="We'll send confirmation to this email address"
            autoComplete="email"
          >
            Email address
          </Input>
        </FormGroup>

        <Button type="submit">Continue</Button>
      </form>
    </>
  )

  // Step 3: Address
  const renderStep3 = () => (
    <>
      <BackLink onClick={handleBack}>Back</BackLink>

      <Caption size="XLARGE">Step 3 of 4</Caption>
      <Heading size="XLARGE">What is your address?</Heading>

      {errors.length > 0 && (
        <ErrorSummary heading="There is a problem" errors={errors} />
      )}

      <form onSubmit={handleContinue}>
        <FormGroup>
          <Input
            value={formData.addressLine1}
            onChange={(e) => updateFormData('addressLine1', e.target.value)}
            meta={{
              error: getFieldError('addressLine1'),
              touched: true
            }}
          >
            Address line 1
          </Input>
        </FormGroup>

        <FormGroup>
          <Input
            value={formData.addressLine2}
            onChange={(e) => updateFormData('addressLine2', e.target.value)}
            hint="Optional"
          >
            Address line 2
          </Input>
        </FormGroup>

        <FormGroup>
          <Input
            value={formData.city}
            onChange={(e) => updateFormData('city', e.target.value)}
            meta={{
              error: getFieldError('city'),
              touched: true
            }}
          >
            Town or city
          </Input>
        </FormGroup>

        <FormGroup>
          <Input
            value={formData.postcode}
            onChange={(e) => updateFormData('postcode', e.target.value)}
            inputWidth={10}
            meta={{
              error: getFieldError('postcode'),
              touched: true
            }}
          >
            Postcode
          </Input>
        </FormGroup>

        <Button type="submit">Continue</Button>
      </form>
    </>
  )

  // Step 4: Preferences
  const renderStep4 = () => (
    <>
      <BackLink onClick={handleBack}>Back</BackLink>

      <Caption size="XLARGE">Step 4 of 4</Caption>
      <Heading size="XLARGE">Your preferences</Heading>

      {errors.length > 0 && (
        <ErrorSummary heading="There is a problem" errors={errors} />
      )}

      <form onSubmit={handleContinue}>
        <Fieldset>
          <Fieldset.Legend>
            How would you like us to contact you?
          </Fieldset.Legend>

          {getFieldError('contactMethod') && (
            <span className="govuk-error-message">
              {getFieldError('contactMethod')}
            </span>
          )}

          <Radio
            name="contactMethod"
            checked={formData.contactMethod === 'email'}
            onChange={() => updateFormData('contactMethod', 'email')}
          >
            Email
          </Radio>

          <Radio
            name="contactMethod"
            checked={formData.contactMethod === 'phone'}
            onChange={() => updateFormData('contactMethod', 'phone')}
          >
            Phone
          </Radio>

          <Radio
            name="contactMethod"
            checked={formData.contactMethod === 'post'}
            onChange={() => updateFormData('contactMethod', 'post')}
          >
            Post
          </Radio>
        </Fieldset>

        <Fieldset>
          <Fieldset.Legend>Email preferences</Fieldset.Legend>

          <HintText>Select all that apply</HintText>

          <Checkbox
            checked={formData.newsletter}
            onChange={(e) => updateFormData('newsletter', e.target.checked)}
          >
            Send me the monthly newsletter
          </Checkbox>

          <Checkbox
            checked={formData.updates}
            onChange={(e) => updateFormData('updates', e.target.checked)}
          >
            Send me service updates and announcements
          </Checkbox>
        </Fieldset>

        <FormGroup>
          <TextArea
            value={formData.additionalInfo}
            onChange={(e) => updateFormData('additionalInfo', e.target.value)}
            rows={5}
            hint="Optional - provide any additional information"
          >
            Additional information
          </TextArea>
        </FormGroup>

        <Button type="submit">Continue</Button>
      </form>
    </>
  )

  // Step 5: Check your answers
  const renderCheckAnswers = () => (
    <>
      <BackLink onClick={handleBack}>Back</BackLink>

      <Heading size="XLARGE">Check your answers before submitting</Heading>

      <Heading size="MEDIUM">Service details</Heading>
      <Table>
        <Table.Row>
          <Table.CellHeader>Service type</Table.CellHeader>
          <Table.Cell>{getServiceTypeLabel()}</Table.Cell>
          <Table.Cell numeric>
            <Link href="#" onClick={() => handleChangeAnswer(1)}>
              Change
            </Link>
          </Table.Cell>
        </Table.Row>
      </Table>

      <Heading size="MEDIUM">Personal details</Heading>
      <Table>
        <Table.Row>
          <Table.CellHeader>Full name</Table.CellHeader>
          <Table.Cell>{formData.fullName}</Table.Cell>
          <Table.Cell numeric>
            <Link href="#" onClick={() => handleChangeAnswer(2)}>
              Change
            </Link>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Date of birth</Table.CellHeader>
          <Table.Cell>{formData.dateOfBirth}</Table.Cell>
          <Table.Cell numeric>
            <Link href="#" onClick={() => handleChangeAnswer(2)}>
              Change
            </Link>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Email address</Table.CellHeader>
          <Table.Cell>{formData.email}</Table.Cell>
          <Table.Cell numeric>
            <Link href="#" onClick={() => handleChangeAnswer(2)}>
              Change
            </Link>
          </Table.Cell>
        </Table.Row>
      </Table>

      <Heading size="MEDIUM">Address</Heading>
      <Table>
        <Table.Row>
          <Table.CellHeader>Address</Table.CellHeader>
          <Table.Cell>
            {formData.addressLine1}
            <br />
            {formData.addressLine2 && (
              <>
                {formData.addressLine2}
                <br />
              </>
            )}
            {formData.city}
            <br />
            {formData.postcode}
          </Table.Cell>
          <Table.Cell numeric>
            <Link href="#" onClick={() => handleChangeAnswer(3)}>
              Change
            </Link>
          </Table.Cell>
        </Table.Row>
      </Table>

      <Heading size="MEDIUM">Contact preferences</Heading>
      <Table>
        <Table.Row>
          <Table.CellHeader>Contact method</Table.CellHeader>
          <Table.Cell>{getContactMethodLabel()}</Table.Cell>
          <Table.Cell numeric>
            <Link href="#" onClick={() => handleChangeAnswer(4)}>
              Change
            </Link>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Newsletter</Table.CellHeader>
          <Table.Cell>{formData.newsletter ? 'Yes' : 'No'}</Table.Cell>
          <Table.Cell numeric>
            <Link href="#" onClick={() => handleChangeAnswer(4)}>
              Change
            </Link>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Service updates</Table.CellHeader>
          <Table.Cell>{formData.updates ? 'Yes' : 'No'}</Table.Cell>
          <Table.Cell numeric>
            <Link href="#" onClick={() => handleChangeAnswer(4)}>
              Change
            </Link>
          </Table.Cell>
        </Table.Row>
      </Table>

      <Heading size="MEDIUM">Now submit your application</Heading>

      <WarningText>
        By submitting this application you are confirming that, to the best of
        your knowledge, the details you are providing are correct.
      </WarningText>

      <Button onClick={handleSubmit}>Accept and submit</Button>
    </>
  )

  // Step 6: Confirmation
  const renderConfirmation = () => (
    <>
      <Panel title="Application complete">
        Your reference number
        <br />
        <strong>{formData.referenceNumber}</strong>
      </Panel>

      <Heading size="MEDIUM">What happens next</Heading>

      <p className="govuk-body">
        We've sent you a confirmation email to {formData.email}.
      </p>

      <p className="govuk-body">
        We'll review your application and contact you within 5 working days.
      </p>

      <Heading size="MEDIUM">Application details</Heading>

      <Table>
        <Table.Row>
          <Table.CellHeader>Service type</Table.CellHeader>
          <Table.Cell>
            <Tag tint="BLUE">{getServiceTypeLabel()}</Tag>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Reference number</Table.CellHeader>
          <Table.Cell>
            <strong>{formData.referenceNumber}</strong>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Submitted</Table.CellHeader>
          <Table.Cell>{new Date().toLocaleDateString('en-GB')}</Table.Cell>
        </Table.Row>
      </Table>

      <Heading size="MEDIUM">What you can do next</Heading>

      <p className="govuk-body">
        <Link href="/dashboard">Go to your dashboard</Link> to:
      </p>

      <ul className="govuk-list govuk-list--bullet">
        <li>track your application</li>
        <li>view your reference number</li>
        <li>print a copy of your application</li>
      </ul>

      <p className="govuk-body">
        <Link href="/help">Get help with your application</Link>
      </p>
    </>
  )

  return (
    <>
      <GlobalStyle />
      {renderStep()}
    </>
  )
}

export default MultiStepFormJourney
