import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

export default function Banner(props) {

  const getSeverity = severity => {
    if (severity == 200) {
        return 'success'
    } else if (severity == 400) {
        return 'error'
    } else {
        return ''
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={props.open}>
        <Alert
          severity={getSeverity(props.severity)}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                props.setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {props.severity == 200 ? 'Image uploaded!' : 'Error uploading image :('}
        </Alert>
      </Collapse>
      {/* <Button
        disabled={props.open}
        variant="outlined"
        onClick={() => {
          props.setOpen(true);
        }}
      >
        Re-open
      </Button> */}
    </Box>
  );
}
