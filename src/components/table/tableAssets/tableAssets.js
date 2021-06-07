import React, { useEffect, useState } from 'react'
import { DataCell } from '../table_styles'

export const Cell = ({
  id,
  data,
  selectedCells,
  setSelectedCells,
  isSelected,
}) => {
  /**************************************
   ******** State
   *************************************/
  const [IsSelected, setIsSelected] = useState(isSelected)

  /**************************************
   ******** Watch isSelected
   *************************************/
  useEffect(() => {
    setIsSelected(isSelected)
  }, [isSelected])

  /**************************************
   ******** Render
   *************************************/
  return (
    <>
      <DataCell
        onClick={() => {
          setIsSelected(!IsSelected)

          const duplicate = selectedCells.find(({ id: cellId }) => cellId == id)

          if (duplicate)
            setSelectedCells(
              selectedCells.filter(({ id: cellId }) => cellId != id)
            )
          else setSelectedCells([...selectedCells, { id, data }])
        }}
        isSelected={IsSelected}
      >
        <b>{data}</b>
      </DataCell>
    </>
  )
}
