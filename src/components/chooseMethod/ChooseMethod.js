import { Button } from '@material-ui/core'
import React from 'react'
import { Container, Row, Title } from './chooseMethod_styles'
import readExel from 'read-excel-file'
import { generate as makeId } from 'shortid'
import localForage from 'localforage'

const ChooseMethod = ({ setIsFirstTime }) => {
  return (
    <>
      <Container>
        <Title>How do you want to input your data?</Title>

        <Row>
          <Button
            variant='contained'
            style={{ width: '13em' }}
            onClick={async () => {
              const base = await localForage.getItem('base')
              await localForage.setItem('base', {
                ...base,
                isFirstTime: false,
              })

              setIsFirstTime(false)
            }}
          >
            Manually
          </Button>

          <Button
            variant='contained'
            component='label'
            color='primary'
            style={{ width: '13em' }}
          >
            <input
              type='file'
              hidden
              onChange={async ({ target: { files } }) => {
                const fileData = await readExel(files[0])
                const parsedData = fileData.map(row =>
                  row.map(cell => ({ id: makeId(), data: cell }))
                )

                const base = await localForage.getItem('base')
                await localForage.setItem('base', {
                  ...base,
                  excelData: parsedData,
                  isFirstTime: false,
                })

                setIsFirstTime(false)
              }}
            />
            From Excel File
          </Button>
        </Row>
      </Container>
    </>
  )
}

export default ChooseMethod
