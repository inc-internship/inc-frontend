'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Control, Controller, FieldValues, Path, useWatch } from 'react-hook-form'
import { useI18n } from '@/shared/i18n'
import { Select, type SelectOption } from '@/shared/ui/Select'
import s from './SelectCountryCity.module.scss'
import { toast } from 'react-toastify'

type Country = {
  capital: string
  iso2: string
  name: string
}

type SelectCountryCityProps<T extends FieldValues> = {
  cityLabel?: string
  cityName?: Path<T>
  control: Control<T>
  countryLabel?: string
  countryName?: Path<T>
}

export const SelectCountryCity = <T extends FieldValues>({
  cityName = 'city' as Path<T>,
  control,
  countryName = 'country' as Path<T>,
}: SelectCountryCityProps<T>) => {
  const [countries, setCountries] = useState<Country[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [loadingCities, setLoadingCities] = useState(false)

  const { t } = useI18n()

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/capital')
        const data = await response.json()

        if (!data.error) {
          setCountries(data.data)
        }
      } catch (error) {
        console.error('Error fetching countries:', error)
        toast.error(t('profile.errorFetchingCountries'))
      }
    }

    fetchCountries()
  }, [])

  const selectedCountry = useWatch({ control, name: countryName })

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry) {
        setCities([])
        return
      }

      try {
        setLoadingCities(true)

        const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: selectedCountry }),
        })

        const data = await response.json()

        if (!data.error) {
          setCities(data.data)
        } else {
          setCities([])
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
        toast.error(t('profile.errorFetchingCities'))
        setCities([])
      } finally {
        setLoadingCities(false)
      }
    }

    fetchCities()
  }, [selectedCountry])

  const countryOptions: SelectOption[] = useMemo(
    () =>
      countries.map(country => ({
        value: country.name,
        label: country.name,
      })),
    [countries],
  )

  const cityOptions: SelectOption[] = useMemo(
    () =>
      cities.map(city => ({
        value: city,
        label: city,
      })),
    [cities],
  )

  return (
    <div className={s.selectForm}>
      <div className={s.selectLabel}>
        <Controller
          control={control}
          name={countryName}
          render={({ field }) => (
            <Select
              label={t('profile.selectCountry')}
              placeholder="Country"
              options={countryOptions}
              value={field.value || null}
              onChange={val => {
                field.onChange(val || '')
              }}
              maxHeight={200}
              className={s.select}
            />
          )}
        />
      </div>

      <div className={s.selectLabel}>
        <Controller
          control={control}
          name={cityName}
          render={({ field }) => (
            <Select
              label={t('profile.selectCity')}
              placeholder="City"
              options={cityOptions}
              value={field.value || null}
              onChange={val => field.onChange(val || '')}
              disabled={!selectedCountry || loadingCities}
              maxHeight={200}
              className={s.select}
            />
          )}
        />
      </div>
    </div>
  )
}

export default SelectCountryCity
