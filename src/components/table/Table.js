import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { batchAddInput } from '../waves/HandleInputs'
import { Cell } from './tableAssets/tableAssets'
import { Container, HollowCell, Row, TitleCell } from './table_styles'

const Table = ({ data, currentFieldData, closeModal }) => {
  /**************************************
   ******** State
   *************************************/
  const [SelectedCells, setSelectedCells] = useState([])

  /******************************************
   ******** add selected cells to main form
   ******************************************/
  const addCellsToForm = () => {
    const { type, data } = currentFieldData
    if (type == 'input')
      batchAddInput({ ...data, newList: SelectedCells.map(({ data }) => data) })

    closeModal()
  }

  /**************************************
   ******** render
   *************************************/
  return (
    <>
      <Container>
        {SelectedCells.length > 0 && (
          <Button
            variant='contained'
            color='primary'
            onClick={addCellsToForm}
            style={{ marginBottom: '2em' }}
          >
            Add Cells
          </Button>
        )}

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
                />
              )
            })}
          </Row>
        ))}
      </Container>
    </>
  )
}

export default Table
