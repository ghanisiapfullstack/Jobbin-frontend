import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FormField from './FormField'

describe('FormField', () => {
  it('associates its label and error with the field', () => {
    render(
      <FormField id="email" label="Email" error="Enter a valid email.">
        <input id="email" aria-describedby="email-error" />
      </FormField>,
    )

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email.')
  })
})
