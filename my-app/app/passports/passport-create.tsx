import { useNavigate } from 'react-router'
import { PassportForm } from '~/components/passports/passport-form'
import useFetch from '~/lib/hooks/use-fetch.hook'
import { getApiUrl } from '~/lib/utils'
import type { Passport, PassportFormData } from '~/models/passports.models'

export function PassportCreate() {
  const navigate = useNavigate()
  const { fetch, isLoadingRef, error } = useFetch<Passport>()

  const handleSubmit = async (data: PassportFormData) => {
    if (isLoadingRef.current) {
      return
    }

    try {
      const apiUrl = getApiUrl('/passports')

      await fetch(apiUrl, 'POST', data)

      navigate('/passports', { replace: true })
    } catch (err) {
      console.error('Create passport error:', err)
    }
  }

  const handleCancel = () => {
    navigate('/passports')
  }

  return (
    <PassportForm
      isLoading={isLoadingRef.current}
      error={error?.message}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}
