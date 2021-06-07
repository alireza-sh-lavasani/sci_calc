import localForage from 'localforage'
import { mean } from 'mathjs'

/**
 * Calculate Reduction
 */
export const calcReduction = async () => {
  const lower = await localForage.getItem('lower')
  const higher = await localForage.getItem('higher')

  if (lower && higher) {
    // oxid and reduced of lower wavelengths
    const { oxid: oxid_low, reduced: reduced_low } = lower

    // average of lower wavelength controls
    const negCtrl_low = mean(lower.negCtrls.map(({ data }) => data))

    // average of different concentrations of lower wavelengths
    const concents_low = lower.params.map(({ name, values }) => ({
      name,
      value: mean(values.map(({ data }) => data)),
    }))

    // oxid and reduced of higher wavelengths
    const { oxid: oxid_high, reduced: reduced_high } = higher

    // average of higher wavelength controls
    const negCtrl_high = mean(higher.negCtrls.map(({ data }) => data))

    // average of different concentrations of higher wavelengths
    const concents_high = higher.params.map(({ name, values }) => ({
      name,
      value: mean(values.map(({ data }) => data)),
    }))

    let headers = [
      { label: 'Parameter', key: 'name' },
      { label: 'Value', key: 'value' },
    ]

    const results = concents_low.map(({ name, value: concent_low }, index) => ({
      name,
      value:
        ((oxid_high * concent_low - oxid_low * concents_high[index].value) /
          (reduced_low * negCtrl_high - reduced_high * negCtrl_low)) *
        100,
    }))

    return { headers, results }
  }

  return []
}

/**
 * Calculate difference
 */
export const calcDiffer = async () => {
  const lower = await localForage.getItem('lower')
  const higher = await localForage.getItem('higher')

  if (lower && higher) {
    // oxid and reduced of lower wavelengths
    const { oxid: oxid_low } = lower

    // average of lower wavelength controls
    const posCtrl_low = mean(lower.posCtrls.map(({ data }) => data))

    // average of different concentrations of lower wavelengths
    const concents_low = lower.params.map(({ name, values }) => ({
      name,
      value: mean(values.map(({ data }) => data)),
    }))

    // oxid and reduced of higher wavelengths
    const { oxid: oxid_high } = higher

    // average of higher wavelength controls
    const posCtrl_high = mean(higher.posCtrls.map(({ data }) => data))

    // average of different concentrations of higher wavelengths
    const concents_high = higher.params.map(({ name, values }) => ({
      name,
      value: mean(values.map(({ data }) => data)),
    }))

    let headers = [
      { label: 'Parameter', key: 'name' },
      { label: 'Value', key: 'value' },
    ]

    const results = concents_low.map(({ name, value: concent_low }, index) => ({
      name,
      value:
        ((oxid_high * concent_low - oxid_low * concents_high[index].value) /
          (oxid_high * posCtrl_low - oxid_low * posCtrl_high)) *
        100,
    }))

    return { headers, results }
  }
}
