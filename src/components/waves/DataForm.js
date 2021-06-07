import {
  Container,
  Grid,
  Col,
  Small,
  Spacer,
  Subtitle,
  LoadingWrapper,
  HR,
} from './waves_styles'
import {
  Button,
  CircularProgress,
  TextField,
  Fab,
  Popover,
  MenuItem,
} from '@material-ui/core'
import { useEffect, useState } from 'react'
import localForage from 'localforage'
import { Add, DeleteForeverOutlined } from '@material-ui/icons'
import { addInput, RenderInputs, RenderParams } from './HandleInputs'
import { Paragraph } from '../colorimetric/colorimetric_styles'
import DataTableModal from '../table/DataTableModal'

/**
 * Data form
 */
const DataForm = ({ tabName, setIsFirstTime }) => {
  /**************************************
   ******** State
   *************************************/
  const [Loading, setLoading] = useState(true)
  // const [Oxid, setOxid] = useState()
  // const [Reduced, setReduced] = useState()
  const [OxRdPair, setOxRdPair] = useState()
  const [PosCtrls, setPosCtrls] = useState([])
  const [NegCtrls, setNegCtrls] = useState([])
  const [Params, setParams] = useState([{ name: '', values: [] }])
  const [anchorEl, setAnchorEl] = useState(null)
  const [IsDataTableOpen, setIsDataTableOpen] = useState(false)
  const [ExcelData, setExcelData] = useState([])
  const [ReadFromExcel, setReadFromExcel] = useState(false)
  const [CurrentFieldData, setCurrentFieldData] = useState()

  /**************************************
   ******** Handle Click
   *************************************/
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  /**************************************
   ******** Handle Close
   *************************************/
  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  /*************************************************
   ******** Get initial values from local database
   *************************************************/
  useEffect(() => {
    getLocalValues()
  }, [])

  /*************************************************
   ******** Get initial values when tab changes
   *************************************************/
  useEffect(() => {
    getLocalValues()
  }, [tabName])

  /**************************************
   ******** Get local values
   *************************************/
  const getLocalValues = async () => {
    // check if mode is read from excel
    const localBaseDB = await localForage.getItem('base')
    const { excelData } = localBaseDB
    if (excelData) {
      setExcelData(excelData)
      setReadFromExcel(true)
    }

    // load local values in state
    const localDB = await localForage.getItem(tabName)
    if (localDB) {
      const { key, oxid, reduced, posCtrls, negCtrls, params } = localDB

      // oxid ? setOxid(oxid) : setOxid(0)
      // reduced ? setReduced(reduced) : setReduced(0)
      oxid ? setOxRdPair({ key, value: [oxid, reduced] }) : setOxRdPair()
      posCtrls && setPosCtrls(posCtrls)
      negCtrls && setNegCtrls(negCtrls)
      params && setParams(params)
    }

    setLoading(false)
  }

  /**************************************
   ******** Data table funcs
   *************************************/
  const openDataTable = () => setIsDataTableOpen(true)
  const closeDataTable = () => setIsDataTableOpen(false)

  /**************************************
   ******** Render
   *************************************/
  if (Loading)
    return (
      <LoadingWrapper>
        <CircularProgress />
      </LoadingWrapper>
    )

  return (
    <>
      <Container>
        <Subtitle>
          <b style={{ textTransform: 'capitalize' }}>{tabName}</b> Wavelengths
          Data Form:
        </Subtitle>

        <Spacer />
        <Grid cols={2} gap='1em' align='center'>
          <small style={{ color: '#ff1744' }}>Clear previous data?</small>

          <Button
            variant='outlined'
            size='small'
            color='secondary'
            startIcon={<DeleteForeverOutlined />}
            onClick={handleClick}
          >
            Reset Form
          </Button>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
          >
            <Grid cols={2} align='center' style={{ padding: '1em' }}>
              <b style={{ color: '#ff1744' }}>Are you sure?</b>

              <Button
                variant='contained'
                color='secondary'
                size='small'
                onClick={async () => {
                  // await localForage.setItem(tabName, null)
                  await localForage.clear()
                  setIsFirstTime(false)
                  window.location.href = '/'
                }}
              >
                CLEAR
              </Button>
            </Grid>
          </Popover>
        </Grid>
        <Spacer />

        <form>
          <HR />
          <Subtitle>Extinction Coefficients</Subtitle>

          {OxRdPair && (
            <div style={{ marginBottom: '1em' }}>
              <b>{OxRdPair.key}</b>
              <br />
              <span>Oxid: {OxRdPair.value[0]}</span>
              <br />
              <span>Reduced: {OxRdPair.value[1]}</span>
            </div>
          )}

          <TextField
            select
            value={OxRdPair}
            onChange={async ({ target: { value } }) => {
              setOxRdPair(value)

              const { key, value: oxRdPair } = value
              const [oxid, reduced] = oxRdPair

              const localDB = await localForage.getItem(tabName)
              await localForage.setItem(tabName, {
                ...localDB,
                key,
                oxid,
                reduced,
              })
            }}
            label='Oxidised (O) _ Reduced (R)'
            fullWidth
          >
            <MenuItem
              key={tabName == 'lower' ? 1 : 3}
              value={
                tabName == 'lower'
                  ? { key: 540, value: [47619, 104395] }
                  : { key: 600, value: [117216, 14652] }
              }
            >
              {tabName == 'lower' ? '540' : '600'}
            </MenuItem>

            <MenuItem
              key={tabName == 'lower' ? 2 : 4}
              value={
                tabName == 'lower'
                  ? { key: 570, value: [80586, 155677] }
                  : { key: 630, value: [34798, 5494] }
              }
            >
              {tabName == 'lower' ? '570' : '630'}
            </MenuItem>
          </TextField>

          {/* <Grid cols={2}>
          <TextField
            select
            value={Oxid}
            onChange={async ({ target: { value } }) => {
              setOxid(value)

              const localDB = await localForage.getItem(tabName)
              await localForage.setItem(tabName, {
                ...localDB,
                oxid: value,
              })
            }}
            label='Oxidised (O)'
            // defaultValue={Oxid || 0}
            placeholder={tabName == 'lower' ? '' : ''}
            fullWidth
          >
            <MenuItem key='540' value={47619}>
              540
            </MenuItem>

            <MenuItem key='570' value={80586}>
              570
            </MenuItem>
          </TextField>

          <TextField
            value={Reduced}
            onChange={async ({ target: { value } }) => {
              setReduced(value)

              const localDB = await localForage.getItem(tabName)
              await localForage.setItem(tabName, {
                ...localDB,
                reduced: value,
              })
            }}
            label='Reduced (R)'
            // defaultValue={Reduced || 0}
            placeholder={tabName == 'lower' ? '' : ''}
            fullWidth
            select
          >
            <MenuItem key='540' value={104395}>
              540
            </MenuItem>

            <MenuItem key='570' value={155677}>
              570
            </MenuItem>
          </TextField>
        </Grid> */}

          <Spacer height='1.5em' />

          <HR />
          <Subtitle>Controls</Subtitle>
          <Paragraph>
            Use <b style={{ color: '#38afff' }}>+</b> button to add more values
          </Paragraph>

          <Grid cols={2} gap='1.5em'>
            <Col>
              <Subtitle>
                Negative Control
                <br />
                <Small>( alamarBlue + only media )</Small>
              </Subtitle>

              <Col>
                <RenderInputs
                  list={NegCtrls}
                  setList={setNegCtrls}
                  listKeyName='negCtrls'
                  localDbKey={tabName}
                />
                <Spacer />

                <Fab
                  size='small'
                  aria-label='add'
                  style={{ background: '#38afff', color: 'white' }}
                  onClick={() => {
                    if (ReadFromExcel) {
                      setCurrentFieldData({
                        type: 'input',
                        data: {
                          selected: NegCtrls,
                          setList: setNegCtrls,
                          listKeyName: 'negCtrls',
                          localDbKey: tabName,
                        },
                      })

                      openDataTable()
                    } else
                      addInput({
                        list: NegCtrls,
                        setList: setNegCtrls,
                        listKeyName: 'negCtrls',
                        localDbKey: tabName,
                      })
                  }}
                >
                  <Add />
                </Fab>
              </Col>
            </Col>

            <Col>
              <Subtitle>
                Positive Control
                <br />
                <Small>( alamarBlue + media + cells )</Small>
              </Subtitle>

              <Col>
                <RenderInputs
                  list={PosCtrls}
                  setList={setPosCtrls}
                  listKeyName='posCtrls'
                  localDbKey={tabName}
                />

                <Spacer />

                <Fab
                  size='small'
                  style={{ background: '#38afff', color: 'white' }}
                  aria-label='add'
                  onClick={() => {
                    if (ReadFromExcel) {
                      setCurrentFieldData({
                        type: 'input',
                        data: {
                          selected: PosCtrls,
                          setList: setPosCtrls,
                          listKeyName: 'posCtrls',
                          localDbKey: tabName,
                        },
                      })

                      openDataTable()
                    } else
                      addInput({
                        list: PosCtrls,
                        setList: setPosCtrls,
                        listKeyName: 'posCtrls',
                        localDbKey: tabName,
                      })
                  }}
                >
                  <Add />
                </Fab>
              </Col>
            </Col>
          </Grid>

          <HR />
          <Subtitle>Experimental Parametrs</Subtitle>
          <Paragraph>
            Use <b style={{ color: '#38afff', color: 'white' }}>+ Param</b>{' '}
            button to add more parameters
          </Paragraph>

          <RenderParams
            list={Params}
            setList={setParams}
            listKeyName='params'
            localDbKey={tabName}
            readFromExcel={ReadFromExcel}
            setCurrentFieldData={setCurrentFieldData}
            openDataTable={openDataTable}
          />
        </form>
      </Container>

      {ReadFromExcel && (
        <DataTableModal
          open={IsDataTableOpen}
          handleClose={closeDataTable}
          data={ExcelData}
          currentFieldData={CurrentFieldData}
        />
      )}
    </>
  )
}

export default DataForm
