import {
  Container,
  Grid,
  InputsRow,
  Col,
  InputWrapper,
  Small,
  Spacer,
  Subtitle,
  LoadingWrapper,
  RemoveField,
  DeleteIcon,
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
import {
  Add,
  BlurLinear,
  BlurLinearOutlined,
  BlurOn,
  BlurOnOutlined,
  DeleteForeverOutlined,
} from '@material-ui/icons'
import { addInput, RenderInputs, RenderParams } from './HandleInputs'
import { Paragraph } from '../colorimetric/colorimetric_styles'

/**
 * Data form
 */
const DataForm = ({ tabName }) => {
  /**
   * States
   */
  const [Loading, setLoading] = useState(true)
  const [Oxid, setOxid] = useState()
  const [Reduced, setReduced] = useState()
  const [PosCtrls, setPosCtrls] = useState([0, 0, 0])
  const [NegCtrls, setNegCtrls] = useState([0, 0, 0])
  const [Params, setParams] = useState([{ name: '', values: [0, 0, 0] }])
  const [anchorEl, setAnchorEl] = useState(null)

  console.log({ Oxid, Reduced })

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  /**
   * Get initial values from local database
   */
  useEffect(() => {
    getLocalValues()
  }, [])

  useEffect(() => {
    getLocalValues()
  }, [tabName])

  /**
   * Get local values
   */
  const getLocalValues = async () => {
    const localDB = await localForage.getItem(tabName)

    if (localDB) {
      const { oxid, reduced, posCtrls, negCtrls, params } = localDB

      oxid ? setOxid(oxid) : setOxid(0)
      reduced ? setReduced(reduced) : setReduced(0)
      posCtrls && setPosCtrls(posCtrls)
      negCtrls && setNegCtrls(negCtrls)
      params && setParams(params)
    }

    setLoading(false)
  }

  /**
   * Render
   */
  if (Loading)
    return (
      <LoadingWrapper>
        <CircularProgress />
      </LoadingWrapper>
    )

  return (
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
                await localForage.setItem(tabName, null)
                window.location.reload()
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

        <Grid cols={2}>
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
        </Grid>

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
                color='primary'
                aria-label='add'
                onClick={() =>
                  addInput({
                    list: NegCtrls,
                    setList: setNegCtrls,
                    listKeyName: 'negCtrls',
                    localDbKey: { tabName },
                  })
                }
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
                color='primary'
                aria-label='add'
                onClick={() =>
                  addInput({
                    list: PosCtrls,
                    setList: setPosCtrls,
                    listKeyName: 'posCtrls',
                    localDbKey: { tabName },
                  })
                }
              >
                <Add />
              </Fab>
            </Col>
          </Col>
        </Grid>

        <HR />
        <Subtitle>Experimental Parametrs</Subtitle>
        <Paragraph>
          Use <b style={{ color: '#38afff' }}>+ Param</b> button to add more
          parameters
        </Paragraph>

        <RenderParams
          list={Params}
          setList={setParams}
          listKeyName='params'
          localDbKey={tabName}
        />
      </form>
    </Container>
  )
}

export default DataForm
