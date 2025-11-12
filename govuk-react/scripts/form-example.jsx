/**
 * Complete Form Example with GOV.UK React
 *
 * This example demonstrates best practices for building accessible forms:
 * - Comprehensive validation
 * - Error handling with ErrorSummary and field errors
 * - Proper use of Fieldset for grouping
 * - Hint text for user guidance
 * - Form submission handling
 */

import React, { useState } from 'react'
import {
  GlobalStyle,
  BackLink,
  Heading,
  Input,
  TextArea,
  Radio,
  Checkbox,
  DateField,
  Select,
  Button,
  ErrorSummary,
  FormGroup,
  Fieldset,
  HintText,
  Panel
} from 'govuk-react'

function ApplicationForm() {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    qualification: '',
    employmentStatus: '',
    interests: [],
    additionalInfo: ''
  })

  // Validation state
  const [errors, setErrors] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState('')

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error for this field when user starts typing
    setErrors(prev => prev.filter(e => e.targetName !== field))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (value, checked) => {
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter(i => i !== value)
    }))
  }

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Phone validation
  const isValidPhone = (phone) => {
    const phoneRegex = /^[\d\s()+\-]+$/
    return phone.length >= 10 && phoneRegex.test(phone)
  }

  // Date validation
  const isValidDate = (date) => {
    // Basic date format check (day/month/year)
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/
    return dateRegex.test(date)
  }

  // Form validation
  const validateForm = () => {
    const newErrors = []

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.push({
        targetName: 'fullName',
        text: 'Enter your full name'
      })
    } else if (formData.fullName.trim().length < 2) {
      newErrors.push({
        targetName: 'fullName',
        text: 'Full name must be at least 2 characters'
      })
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.push({
        targetName: 'email',
        text: 'Enter your email address'
      })
    } else if (!isValidEmail(formData.email)) {
      newErrors.push({
        targetName: 'email',
        text: 'Enter an email address in the correct format, like name@example.com'
      })
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.push({
        targetName: 'phone',
        text: 'Enter your phone number'
      })
    } else if (!isValidPhone(formData.phone)) {
      newErrors.push({
        targetName: 'phone',
        text: 'Enter a valid UK phone number'
      })
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.push({
        targetName: 'dateOfBirth',
        text: 'Enter your date of birth'
      })
    } else if (!isValidDate(formData.dateOfBirth)) {
      newErrors.push({
        targetName: 'dateOfBirth',
        text: 'Enter a date in the format DD/MM/YYYY'
      })
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.push({
        targetName: 'address',
        text: 'Enter your address'
      })
    }

    // Qualification validation
    if (!formData.qualification) {
      newErrors.push({
        targetName: 'qualification',
        text: 'Select your highest qualification'
      })
    }

    // Employment status validation
    if (!formData.employmentStatus) {
      newErrors.push({
        targetName: 'employmentStatus',
        text: 'Select your employment status'
      })
    }

    // Interests validation (at least one required)
    if (formData.interests.length === 0) {
      newErrors.push({
        targetName: 'interests',
        text: 'Select at least one area of interest'
      })
    }

    return newErrors
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    const validationErrors = validateForm()

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      // Scroll to top to show error summary
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Form is valid - simulate submission
    console.log('Form submitted:', formData)

    // Generate reference number
    const ref = 'APP-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    setReferenceNumber(ref)
    setIsSubmitted(true)

    // In a real application, you would send data to your backend here
  }

  // Get error for specific field
  const getFieldError = (fieldName) => {
    const error = errors.find(e => e.targetName === fieldName)
    return error ? error.text : null
  }

  // If form submitted successfully, show confirmation
  if (isSubmitted) {
    return (
      <>
        <GlobalStyle />

        <Panel title="Application complete">
          Your reference number
          <br />
          <strong>{referenceNumber}</strong>
        </Panel>

        <Heading size="MEDIUM">What happens next</Heading>

        <p className="govuk-body">
          We've sent you a confirmation email.
        </p>

        <p className="govuk-body">
          We'll review your application and contact you within 5 working days.
        </p>

        <p className="govuk-body">
          You can use your reference number to track your application.
        </p>
      </>
    )
  }

  // Render form
  return (
    <>
      <GlobalStyle />

      <BackLink href="/">Back to start</BackLink>

      {/* Error Summary - displayed when validation fails */}
      {errors.length > 0 && (
        <ErrorSummary
          heading="There is a problem"
          description="Check the following:"
          errors={errors}
        />
      )}

      <Heading size="XLARGE">Submit your application</Heading>

      <p className="govuk-body">
        Complete all sections of this form to submit your application.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Personal Details Section */}
        <Fieldset>
          <Fieldset.Legend size="LARGE">
            Personal details
          </Fieldset.Legend>

          <FormGroup>
            <Input
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
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
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
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

          <FormGroup>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              meta={{
                error: getFieldError('phone'),
                touched: true
              }}
              hint="Include your area code"
              autoComplete="tel"
            >
              Phone number
            </Input>
          </FormGroup>

          <FormGroup>
            <DateField
              input={{
                value: formData.dateOfBirth,
                onChange: (e) => handleInputChange('dateOfBirth', e.target.value)
              }}
              meta={{
                error: getFieldError('dateOfBirth'),
                touched: true
              }}
              hint="For example, 31/03/1980"
            >
              Date of birth
            </DateField>
          </FormGroup>
        </Fieldset>

        {/* Address Section */}
        <FormGroup>
          <TextArea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            rows={5}
            meta={{
              error: getFieldError('address'),
              touched: true
              }}
            hint="Include your postcode"
          >
            What is your address?
          </TextArea>
        </FormGroup>

        {/* Qualification Section */}
        <FormGroup>
          <Select
            value={formData.qualification}
            onChange={(e) => handleInputChange('qualification', e.target.value)}
            label="What is your highest qualification?"
            hint="Select the highest level you have achieved"
            meta={{
              error: getFieldError('qualification'),
              touched: true
            }}
          >
            <option value="">Please select</option>
            <option value="gcse">GCSE or equivalent</option>
            <option value="alevel">A Level or equivalent</option>
            <option value="undergraduate">Undergraduate degree</option>
            <option value="postgraduate">Postgraduate degree</option>
            <option value="doctorate">Doctorate</option>
            <option value="other">Other qualification</option>
          </Select>
        </FormGroup>

        {/* Employment Status Section */}
        <Fieldset>
          <Fieldset.Legend>
            What is your employment status?
          </Fieldset.Legend>

          {getFieldError('employmentStatus') && (
            <span className="govuk-error-message">
              {getFieldError('employmentStatus')}
            </span>
          )}

          <Radio
            name="employmentStatus"
            checked={formData.employmentStatus === 'employed'}
            onChange={() => handleInputChange('employmentStatus', 'employed')}
          >
            Employed
          </Radio>

          <Radio
            name="employmentStatus"
            checked={formData.employmentStatus === 'self-employed'}
            onChange={() => handleInputChange('employmentStatus', 'self-employed')}
          >
            Self-employed
          </Radio>

          <Radio
            name="employmentStatus"
            checked={formData.employmentStatus === 'unemployed'}
            onChange={() => handleInputChange('employmentStatus', 'unemployed')}
          >
            Unemployed
          </Radio>

          <Radio
            name="employmentStatus"
            checked={formData.employmentStatus === 'student'}
            onChange={() => handleInputChange('employmentStatus', 'student')}
          >
            Student
          </Radio>

          <Radio
            name="employmentStatus"
            checked={formData.employmentStatus === 'retired'}
            onChange={() => handleInputChange('employmentStatus', 'retired')}
          >
            Retired
          </Radio>
        </Fieldset>

        {/* Interests Section */}
        <Fieldset>
          <Fieldset.Legend>
            Select your areas of interest
          </Fieldset.Legend>

          <HintText>Select all that apply</HintText>

          {getFieldError('interests') && (
            <span className="govuk-error-message">
              {getFieldError('interests')}
            </span>
          )}

          <Checkbox
            checked={formData.interests.includes('technology')}
            onChange={(e) => handleCheckboxChange('technology', e.target.checked)}
          >
            Technology and computing
          </Checkbox>

          <Checkbox
            checked={formData.interests.includes('healthcare')}
            onChange={(e) => handleCheckboxChange('healthcare', e.target.checked)}
          >
            Healthcare and medicine
          </Checkbox>

          <Checkbox
            checked={formData.interests.includes('education')}
            onChange={(e) => handleCheckboxChange('education', e.target.checked)}
          >
            Education and training
          </Checkbox>

          <Checkbox
            checked={formData.interests.includes('business')}
            onChange={(e) => handleCheckboxChange('business', e.target.checked)}
          >
            Business and finance
          </Checkbox>

          <Checkbox
            checked={formData.interests.includes('arts')}
            onChange={(e) => handleCheckboxChange('arts', e.target.checked)}
          >
            Arts and culture
          </Checkbox>

          <Checkbox
            checked={formData.interests.includes('environment')}
            onChange={(e) => handleCheckboxChange('environment', e.target.checked)}
          >
            Environment and sustainability
          </Checkbox>
        </Fieldset>

        {/* Additional Information Section */}
        <FormGroup>
          <TextArea
            value={formData.additionalInfo}
            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
            rows={5}
            hint="Optional - provide any additional information that may support your application"
          >
            Additional information
          </TextArea>
        </FormGroup>

        {/* Submit Button */}
        <Button type="submit">Submit application</Button>
      </form>
    </>
  )
}

export default ApplicationForm
