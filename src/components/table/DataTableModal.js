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
const DataTableModal = ({ open, handleClose, data, currentFieldData }) => {
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />
  })

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
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

          {/* <Button autoFocus color='secondary' onClick={handleClose}>
            save
          </Button> */}
        </Toolbar>
      </AppBar>

      <Table data={data} currentFieldData={currentFieldData} closeModal={handleClose} />
    </Dialog>
  )
}

export default DataTableModal
