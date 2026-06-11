'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Control, Controller, FieldValues, Path, useWatch } from 'react-hook-form'
import { useI18n } from '@/shared/i18n'
import { Select, type SelectOption } from '@/shared/ui/Select'
import s from './SelectCountryCity.module.scss'
import { toast } from 'react-toastify'
import { Input } from '@/shared/ui/Input'

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

  const [countriesError, setCountriesError] = useState(false)
  const [citiesError, setCitiesError] = useState(false)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/capital')

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`)
        }

        const data = await response.json()

        if (!data.error) {
          setCountries(data.data)
          setCountriesError(false)
        }
      } catch (error) {
        console.error('Error fetching countries:', error)
        toast.error(t('profile.errorFetchingCountries'))
        setCountriesError(true)
      }
    }
    fetchCountries()
  }, [t])

  const selectedCountry = useWatch({ control, name: countryName })

  const selectedCity = useWatch({ control, name: cityName })

  const countryOptions: SelectOption[] = useMemo(() => {
    const options = countries.map(c => ({ value: c.name, label: c.name }))
    if (selectedCountry && !options.some(o => o.value === selectedCountry)) {
      options.unshift({ value: selectedCountry, label: selectedCountry })
    }
    return options
  }, [countries, selectedCountry])

  const isCountryInList = useMemo(() => {
    return countries.some(c => c.name === selectedCountry)
  }, [countries, selectedCountry])

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedCountry || countriesError || !isCountryInList) {
        setCities([])
        if (selectedCountry && !isCountryInList && !countriesError) {
          setCitiesError(true)
        }
        return
      }

      try {
        setLoadingCities(true)

        const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: selectedCountry }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`)
        }

        const data = await response.json()

        if (!data.error) {
          setCities(data.data)
          setCitiesError(false)
        } else {
          setCities([])
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
        toast.error(t('profile.errorFetchingCities'))
        setCitiesError(true)
        setCities([])
      } finally {
        setLoadingCities(false)
      }
    }

    fetchCities()
  }, [selectedCountry, countriesError, t, isCountryInList])

  const cityOptions: SelectOption[] = useMemo(() => {
    const options = cities.map(city => ({
      value: city,
      label: city,
    }))
    if (selectedCity && !options.some(o => o.value === selectedCity)) {
      options.unshift({ value: selectedCity, label: selectedCity })
    }
    return options
  }, [cities, selectedCity])

  return (
    <div className={s.selectForm}>
      <div className={s.selectLabel}>
        <Controller
          control={control}
          name={countryName}
          render={({ field }) =>
            countriesError ? (
              <Input
                label={t('profile.selectCountry')}
                placeholder="Country"
                value={field.value || ''}
                onChange={e => field.onChange(e.target.value)}
                width="full"
              />
            ) : (
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
            )
          }
        />
      </div>

      <div className={s.selectLabel}>
        <Controller
          control={control}
          name={cityName}
          render={({ field }) =>
            citiesError || countriesError ? (
              <Input
                label={t('profile.selectCity')}
                placeholder="City"
                value={field.value || ''}
                onChange={e => field.onChange(e.target.value)}
                disabled={!selectedCountry && !countriesError}
                width="full"
              />
            ) : (
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
            )
          }
        />
      </div>
    </div>
  )
}

export default SelectCountryCity
