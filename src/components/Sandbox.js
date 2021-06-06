import React, { useState } from 'react'
import readExel from 'read-excel-file'
import Table from './table/Table'
import { generate as makeId } from 'shortid'

const Sandbox = () => {
  const [ExelData, setExelData] = useState([])

  return (
    <>
      <h1>Sandbox</h1>
      <input
        type='file'
        onChange={async ({ target: { files } }) => {
          const fileData = await readExel(files[0])
          const parsedData = fileData.map(row =>
            row.map(cell => ({ id: makeId(), data: cell }))
          )

          setExelData(parsedData)
        }}
      />

      <Table data={ExelData} />
    </>
  )
}

export default Sandbox
