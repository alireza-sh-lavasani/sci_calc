/* eslint-disable default-case */
import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { batchAddInput, batchAddParamInput } from '../waves/HandleInputs'
import { Cell } from './tableAssets/tableAssets'
import { Container, HollowCell, Row, TitleCell } from './table_styles'

const Table = ({ data, currentFieldData, closeModal }) => {
  console.log('***', currentFieldData)

  /**************************************
   ******** State
   *************************************/
  const [SelectedCells, setSelectedCells] = useState([])

  /**************************************
   ******** Watch selected
   *************************************/
  useEffect(() => {
    if (currentFieldData.data.selected)
      setSelectedCells(currentFieldData.data.selected)
  }, [currentFieldData.data.selected])

  /******************************************
   ******** add selected cells to main form
   ******************************************/
  const addCellsToForm = () => {
    const { type, data } = currentFieldData

    switch (type) {
      case 'input':
        batchAddInput({
          ...data,
          newList: SelectedCells,
        })
        break

      case 'param':
        batchAddParamInput({
          ...data,
          newValues: SelectedCells,
        })
        break
    }

    closeModal()
  }

  /**************************************
   ******** render
   *************************************/
  return (
    <>
      <Container>
        <Button
          variant='contained'
          onClick={addCellsToForm}
          style={{
            marginBottom: '2em',
            backgroundColor: '#38afff',
            color: 'white',
            opacity: SelectedCells.length == 0 ? 0 : 1,
          }}
        >
          Add Cells
        </Button>

        {data.map((row, rowIndex) => (
          <Row key={rowIndex}>
            {row.map(({ id, data }, cellIndex) => {
              // empty cells
              if (!data) return <HollowCell key={id} />
              // title cells
              else if (rowIndex == 0 || cellIndex == 0)
                return <TitleCell key={id}>{data}</TitleCell>
              // wavelength cells
              else if (cellIndex == row.length - 1)
                return <HollowCell key={id}>{data}</HollowCell>

              // data cells
              return (
                <Cell
                  key={id}
                  id={id}
                  selectedCells={SelectedCells}
                  setSelectedCells={setSelectedCells}
                  data={data}
                  isSelected={SelectedCells.map(({ id }) => id).includes(id)}
                />
              )
            })}
          </Row>
        ))}

        <Button
          variant='contained'
          onClick={addCellsToForm}
          style={{
            marginTop: '2em',
            backgroundColor: '#38afff',
            color: 'white',
            opacity: SelectedCells.length == 0 ? 0 : 1,
          }}
        >
          Add Cells
        </Button>
      </Container>
    </>
  )
}

export default Table
