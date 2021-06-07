import { Button, Fab, TextField } from '@material-ui/core'
import { Add, DeleteForeverOutlined } from '@material-ui/icons'
import localForage from 'localforage'
import {
  DeleteIcon,
  InputsRow,
  InputWrapper,
  RemoveField,
  Col,
  Spacer,
} from './waves_styles'

/**************************************
 ******** Add Input
 *************************************/
export const addInput = async ({ list, setList, listKeyName, localDbKey }) => {
  setList([...list, 0])

  const localDB = await localForage.getItem(localDbKey)
  await localForage.setItem(localDbKey, {
    ...localDB,
    [listKeyName]: [...list, 0],
  })
}

/**************************************
 ******** Batch Add Input
 *************************************/
export const batchAddInput = async ({
  newList,
  setList,
  listKeyName,
  localDbKey,
}) => {
  setList(newList)

  const localDB = await localForage.getItem(localDbKey)
  await localForage.setItem(localDbKey, {
    ...localDB,
    [listKeyName]: newList,
  })
}

/**************************************
 ******** Render Inputs
 *************************************/
export const RenderInputs = ({ list, setList, listKeyName, localDbKey }) =>
  list.map((value, index) => (
    <InputWrapper key={index}>
      <TextField
        name={`posCtrl_${index + 1}`}
        value={list[index]}
        onChange={async ({ target: { value } }) => {
          let updatedList = [...list]
          updatedList[index] = value
          setList(updatedList)

          const localDB = await localForage.getItem(localDbKey)
          await localForage.setItem(localDbKey, {
            ...localDB,
            [listKeyName]: updatedList,
          })
        }}
        label={`Absorbance ${index + 1}`}
        defaultValue={0}
        variant='outlined'
        fullWidth
      />

      <RemoveField
        onClick={async () => {
          let updatedList = [...list]
          updatedList.splice(index, 1)

          setList(updatedList)

          const localDB = await localForage.getItem(localDbKey)
          await localForage.setItem(localDbKey, {
            ...localDB,
            [listKeyName]: updatedList,
          })
        }}
      >
        <DeleteIcon />
      </RemoveField>
    </InputWrapper>
  ))

/**************************************
 ******** Render Params
 *************************************/
export const RenderParams = ({
  list,
  setList,
  listKeyName,
  localDbKey,
  readFromExcel,
  setCurrentFieldData,
  openDataTable,
}) => (
  <InputsRow style={{ marginRight: '-1.5em' }}>
    {list.map(({ name, values }, index) => (
      <Col margin='0 0.85em' key={index}>
        <Spacer />

        <Button
          variant='outlined'
          size='small'
          color='secondary'
          startIcon={<DeleteForeverOutlined />}
          onClick={async () => {
            let updatedList = [...list]
            updatedList.splice(index, 1)
            setList(updatedList)

            const localDB = await localForage.getItem(localDbKey)
            await localForage.setItem(localDbKey, {
              ...localDB,
              [listKeyName]: updatedList,
            })
          }}
        >
          Del Param {index + 1}
        </Button>

        <Spacer />

        <InputWrapper>
          <TextField
            value={name}
            onChange={async ({ target: { value } }) => {
              let updatedList = [...list]
              updatedList[index].name = value
              setList(updatedList)

              const localDB = await localForage.getItem(localDbKey)
              await localForage.setItem(localDbKey, {
                ...localDB,
                [listKeyName]: updatedList,
              })
            }}
            label={`Param ${index + 1}`}
            name={`Param ${index + 1}`}
            fullWidth
          />
        </InputWrapper>

        <Spacer />

        <RenderParamInputs
          listIndex={index}
          values={values}
          list={list}
          setList={setList}
          listKeyName={listKeyName}
          localDbKey={localDbKey}
        />

        <Spacer />

        <Fab
          size='small'
          color='primary'
          aria-label='add'
          onClick={() => {
            if (readFromExcel) {
              setCurrentFieldData({
                type: 'param',
                data: {
                  listIndex: index,
                  list,
                  setList,
                  listKeyName,
                  localDbKey,
                },
              })

              openDataTable()
            } else
              addParamInput({
                listIndex: index,
                values,
                list,
                setList,
                listKeyName,
                localDbKey,
              })
          }}
        >
          <Add />
        </Fab>

        <Spacer />
      </Col>
    ))}

    <Col margin='0 0.85em'>
      <Spacer />

      <Fab
        variant='extended'
        size='small'
        color='primary'
        aria-label='add'
        onClick={async () => {
          setList([
            ...list,
            {
              name: '',
              values: [],
            },
          ])

          const localDB = await localForage.getItem(localDbKey)
          await localForage.setItem(localDbKey, {
            ...localDB,
            [listKeyName]: [
              ...list,
              {
                name: '',
                values: [],
              },
            ],
          })
        }}
        style={{
          marginRight: '2em',
        }}
      >
        <Add />
        Param
      </Fab>
    </Col>
  </InputsRow>
)

/**************************************
 ******** Render Param Inputs
 *************************************/
const RenderParamInputs = ({
  listIndex,
  values,
  list,
  setList,
  listKeyName,
  localDbKey,
}) =>
  values.map((value, index) => (
    <InputWrapper key={index}>
      <TextField
        value={value}
        onChange={async ({ target: { value } }) => {
          let updatedValues = [...values]
          updatedValues[index] = value

          let updatedList = [...list]
          updatedList[listIndex].values = updatedValues

          setList(updatedList)

          const LocalDB = await localForage.getItem(localDbKey)
          await localForage.setItem(localDbKey, {
            ...LocalDB,
            [listKeyName]: updatedList,
          })
        }}
        variant='outlined'
        label={`Absorbance ${index + 1}`}
        name={`Absorbance ${index + 1}`}
        placeholder='New Parameter'
        fullWidth
      />

      <RemoveField
        onClick={async () => {
          let updatedValues = [...values]
          updatedValues.splice(index, 1)

          let updatedList = [...list]
          updatedList[listIndex].values = updatedValues

          setList(updatedList)

          const localDB = await localForage.getItem(localDbKey)
          await localForage.setItem(localDbKey, {
            ...localDB,
            [listKeyName]: updatedList,
          })
        }}
      >
        <DeleteIcon />
      </RemoveField>
    </InputWrapper>
  ))

/**************************************
 ******** Add Param Input
 *************************************/
export const addParamInput = async ({
  listIndex,
  values,
  list,
  setList,
  listKeyName,
  localDbKey,
}) => {
  let updatedValues = [...values, 0]
  let updatedList = [...list]
  updatedList[listIndex].values = updatedValues

  setList(updatedList)

  const localDB = await localForage.getItem(localDbKey)
  await localForage.setItem(localDbKey, {
    ...localDB,
    [listKeyName]: updatedList,
  })
}

/**************************************
 ******** Batch Add Param Input
 *************************************/
export const batchAddParamInput = async ({
  listIndex,
  newValues,
  list,
  setList,
  listKeyName,
  localDbKey,
}) => {
  let updatedList = [...list]
  updatedList[listIndex].values = newValues

  setList(updatedList)

  const localDB = await localForage.getItem(localDbKey)
  await localForage.setItem(localDbKey, {
    ...localDB,
    [listKeyName]: updatedList,
  })
}
