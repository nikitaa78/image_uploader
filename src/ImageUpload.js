import React, { useEffect } from 'react';
import ImageUploading from 'react-images-uploading';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Banner from './Banner';
import Button from '@mui/material/Button';
import { Gallery } from "react-grid-gallery";
import DeleteIcon from '@mui/icons-material/Delete';

const useStyles = makeStyles({
  app: {
    backgroundColor: '#DFFFFC',
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
});

export function ImageUpload() {
  const classes = useStyles();
  const [images, setImages] = React.useState([]);
  const [galleryImages, setGalleryImages] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState(0);

  const maxNumber = 10;

  const handleGallerySelect = (index, item, event) => {
    const nextImages = galleryImages.map((image, i) =>
      i === index ? { ...image, isSelected: !image.isSelected } : image
    );
    setGalleryImages(nextImages);
  };

  const mapImagesForGallery = imageList => {
    const galleryList = imageList.map((image) => {return {src: image.data_url, width: 100, height: 100, customOverlay: (
      <div><DeleteIcon /></div>
    )}})
    setGalleryImages(galleryList);
  }

  const onUserImageUpload = (imageList, addUpdateIndex) => {
    // data for submit
    if (imageList.length === 0) {
      setImages(imageList);
      mapImagesForGallery(imageList);
      setOpen(false);
    }
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
                      {isDragging ? "Drop here please" : "Upload space"}
                      <br></br>
                      {console.log(imageList)}
                      {/* {imageList.map((image, index) => (
                          <img key={index} src={image.data_url} />
                      ))} */}
                      <Gallery images={galleryImages} enableImageSelection={false} />
                  </Paper>
                </Box>
                <div>
                  <Button sx={{ margin: '15px'}} variant="contained"
                      // style={isDragging ? { color: 'red' } : undefined}
                      onClick={onImageUpload}
                  >
                      Upload Image
                  </Button>
                  <Button sx={{ margin: '15px'}} variant='outlined' onClick={onImageRemoveAll}>Remove all images</Button>
                </div>

            </div>
        )}
      </ImageUploading>
    </div>
  );
}