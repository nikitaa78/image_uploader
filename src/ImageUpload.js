import React, { useEffect } from 'react';
import ImageUploading from 'react-images-uploading';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Banner from './Banner';
import Button from '@mui/material/Button';
import { Gallery } from "react-grid-gallery";
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles({
  app: {
    backgroundColor: '#F7A0A0',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  dropZone: {
    textAlign: 'center'
  },
  box: {
    marginTop: '3vh',
  },
  imageButtons: {
    margin: '50px',
  },
  uploadTitle: {
    padding: '10px',
  },
});

export function ImageUpload() {
  const classes = useStyles();
  const [images, setImages] = React.useState([]);
  const [galleryImages, setGalleryImages] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState(0);

  const maxNumber = 10;

  const mapImagesForGallery = imageList => {
    const galleryList = imageList.map((image) => 
      {return {src: image.data_url, width: 100, height: 100, customOverlay: (
        <div style={{position: 'absolute', top: '0px', right: '0px', backgroundColor: '#FFFFFF', opacity: '75%'}}> 
          <DeleteIcon style={{color: '#000000'}} />
        </div>
      )}}
    )
    setGalleryImages(galleryList);
  }

  const onUserImageUpload = (imageList, addUpdateIndex) => {
    // console.log("am i here????");
    // console.log("image list: ", imageList);
    // console.log("addUpdateIndex: ", addUpdateIndex);
    // this means an image is being deleted
    if (!addUpdateIndex) {
      setImages(imageList);
      mapImagesForGallery(imageList);
    }
    // all images are deleted
    if (imageList.length === 0) {
      setImages(imageList);
      mapImagesForGallery(imageList);
      setOpen(false);
    }
    // an image is being uploaded 
    let url = imageList[addUpdateIndex];
    console.log(url);
    let backendData = null;
    if(url) {
      backendData = {
        url: url.data_url
      }
      fetch("/send-image", {      
        method: 'POST',
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(backendData)
      }).then((res) =>
        res.json().then((data) => {
          // Setting a data from api
        if (data.status === 200) {
          imageList[addUpdateIndex[0]].data_url = data.file_url
          setImages(imageList);
          mapImagesForGallery(imageList);
        }
        setSeverity(data.status);
        setOpen(true);
      })
      );
    }
  };

  // useEffect(() => {
  //   setGalleryImages(images)
  // }, [images])

  return (
    <div className={classes.app}>
      <ImageUploading
        multiple
        value={images}
        onChange={onUserImageUpload}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
            <div className={classes.dropZone} {...dragProps}>
                <Banner open={open} setOpen={setOpen} severity={severity}/>
                <Box
                  sx={{
                      display: 'inline-block',
                      flexWrap: 'wrap',
                      '& > :not(style)': {
                      m: 1,
                      width: '75vw',
                      height: '75vh',
                      },
                      alignContent: 'center',
                      alignItems: 'center',
                  }}
                  className={classes.box}
                >
                  <Paper elevation={3}>
                      <div className={classes.uploadTitle}>
                        <Typography variant="h6">
                          {isDragging ? "Drop here please" : "Upload space"}
                        </Typography>
                      </div>
                      <br></br>
                      <Gallery images={galleryImages} margin={10} onClick={(index) => onImageRemove(index)} enableImageSelection={false} />
                  </Paper>
                </Box>
                <div>
                  <Button sx={{ margin: '15px', backgroundColor: '#EA4D4D'}} variant="contained"
                      onClick={onImageUpload}
                  >
                      Upload Image
                  </Button>
                  <Button sx={{ margin: '15px', color: '#EA4D4D', borderColor: '#EA4D4D'}} variant='outlined' onClick={onImageRemoveAll}>Remove all images</Button>
                </div>

            </div>
        )}
      </ImageUploading>
    </div>
  );
}