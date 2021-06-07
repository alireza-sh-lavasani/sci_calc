import {
  Card,
  Title,
  TabBar,
  Tab,
  Container,
  Paragraph,
  ResultList,
  ResultRow,
  Key,
  Value,
} from './colorimetric_styles'
import { useEffect, useState } from 'react'
import DataForm from '../waves/DataForm'
// import HigherWaves from '../waves/HigherWaves'
import localForage from 'localforage'
import {
  Grid,
  HR,
  LoadingWrapper,
  Spacer,
  Subtitle,
} from '../waves/waves_styles'
import { Button, CircularProgress, Fab } from '@material-ui/core'
import { BlurLinearOutlined, BlurOn, FilterNone } from '@material-ui/icons'
import { calcDiffer, calcReduction } from '../waves/Calculations'
import { CSVLink } from 'react-csv'
import ChooseMethod from '../chooseMethod/ChooseMethod'

/**
 * Colorimetrics
 */
const Colorimetric = () => {
  /**************************************
   ******** States
   *************************************/
  const [TabName, setTabName] = useState('lower')
  const [Loading, setLoading] = useState(true)
  const [Results, setResults] = useState([])
  const [Headers, setHeaders] = useState([])
  const [IsFirstTime, setIsFirstTime] = useState()

  /**************************************
   ******** Mount
   *************************************/
  useEffect(() => {
    setLocalData()
  }, [])

  /*********************************************
   ********Setting state values in indexedDB
   *********************************************/
  const setLocalData = async () => {
    const lower = await localForage.getItem('lower')
    const higher = await localForage.getItem('higher')
    const base = await localForage.getItem('base')

    if (!base) {
      await localForage.setItem('base', {
        ...base,
        isFirstTime: true,
      })
    } else if (base) setIsFirstTime(base.isFirstTime)

    if (!lower) {
      await localForage.setItem('lower', {
        posCtrls: [],
        negCtrls: [],
        params: [{ name: '', values: [] }],
      })
    }

    if (!higher) {
      await localForage.setItem('higher', {
        posCtrls: [],
        negCtrls: [],
        params: [{ name: '', values: [] }],
      })
    }

    setLoading(false)
  }

  /**************************************
   ******** Render Results
   *************************************/
  const RenderResults = () =>
    Results.map(({ name, value }) => (
      <ResultRow>
        <Key>{name}:</Key>
        <Value>{value}</Value>
      </ResultRow>
    ))

  /**************************************
   ******** Loading
   *************************************/
  if (Loading)
    return (
      <LoadingWrapper>
        <CircularProgress />
      </LoadingWrapper>
    )

  /**************************************
   ******** First Time
   *************************************/
  if (IsFirstTime) return <ChooseMethod setIsFirstTime={setIsFirstTime} />

  /**************************************
   ******** Render
   *************************************/
  return (
    <>
      <Container>
        <Card>
          <Title>Alamar Blue Colorimetric Calculator</Title>
          <Paragraph>
            Use the two tabs below to input your data separated by lower
            wavelengths and higher wavelengths into the forms.
          </Paragraph>
          {/* <Divider /> */}

          <TabBar>
            <Tab
              onClick={() => setTabName('lower')}
              selected={TabName === 'lower'}
            >
              Lower Wavelength
            </Tab>

            <Tab
              onClick={() => setTabName('higher')}
              selected={TabName === 'higher'}
            >
              Higher Wavelength
            </Tab>
          </TabBar>

          {/* <RenderTabs /> */}
          <DataForm tabName={TabName} />

          <HR />
          <Subtitle>Calculations</Subtitle>

          <Spacer />

          <Grid cols={2} gap='2em'>
            <Fab
              variant='extended'
              size='small'
              color='primary'
              aria-label='add'
              onClick={async () => {
                const { headers, results } = await calcDiffer()
                setHeaders(headers)
                setResults(results)
              }}
            >
              <BlurOn />
              Difference
            </Fab>

            <Button
              variant='outlined'
              size='small'
              color='primary'
              startIcon={<BlurLinearOutlined />}
              onClick={async () => {
                const { headers, results } = await calcReduction()
                setHeaders(headers)
                setResults(results)
              }}
            >
              Reduction
            </Button>
          </Grid>

          <Spacer />

          <HR />
          <Grid cols={2} align='center'>
            <Subtitle>Results</Subtitle>

            <div style={{ textAlign: 'right' }}>
              <CSVLink
                data={Results}
                headers={Headers}
                style={{ textDecoration: 'none', color: 'darkgray' }}
                filename='Alamar_Blue_Results.csv'
              >
                <Button variant='contained'>
                  <b>Download</b>
                </Button>
              </CSVLink>
            </div>
          </Grid>

          <Spacer />

          <ResultList>
            <ResultRow>
              <Key>
                <b>Parameter</b>
              </Key>

              <Value>
                <b>Value</b>
              </Value>
            </ResultRow>

            <RenderResults />
          </ResultList>

          <Spacer />
        </Card>
      </Container>
    </>
  )
}

export default Colorimetric
