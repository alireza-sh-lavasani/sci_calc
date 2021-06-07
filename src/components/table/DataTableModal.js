import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import React from 'react'
import Table from './Table'

/**************************************
 ******** Data Table Modal
 *************************************/
const DataTableModal = ({ open, handleClose, data, currentFieldData }) => (
  <Dialog
    fullScreen
    open={open}
    onClose={handleClose}
    // TransitionComponent={Transition}
  >
    <AppBar style={{ position: 'relative' }}>
      <Toolbar>
        <IconButton
          edge='start'
          color='inherit'
          onClick={handleClose}
          aria-label='close'
        >
          <Close />
        </IconButton>

        <b>Excel Data Table</b>
      </Toolbar>
    </AppBar>

    <Table
      data={data}
      currentFieldData={currentFieldData}
      closeModal={handleClose}
    />
  </Dialog>
)

export default DataTableModal
