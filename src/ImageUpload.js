import React from 'react';
import ImageUploading from 'react-images-uploading';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Banner from './Banner';
import Button from '@mui/material/Button';
import { Gallery } from "react-grid-gallery";
import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/system';


const fadeIn = keyframes`
0% {
  opacity: 0;
  transform: translateX(80px);
}
100% {
  opacity: 1;
  transform: translateY(0);
}
`;

const useStyles = makeStyles({
  app: {
    backgroundColor: '#FADBD8',
    position: 'absolute',
    // top: 0,
    // left: 0,
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
    marginTop: '5px',
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
      {
        return {src: image.data_url, width: 100, height: 100 }
      }
    )
    setGalleryImages(galleryList);
  }

  const filterImage = index => {
    console.log('filter');
    setOpen(false);
    let url = images[index];
    console.log(url);
    if(url) {
      let temp = url.data_url
      images[index].data_url = url.filtered_file_url
      images[index].filtered_file_url = temp
      images[index].filtered = !url.filtered
      setImages(images);
      mapImagesForGallery(images);
    }
  }

  const onUserImageUpload = (imageList, addUpdateIndex) => {
    // an image is being deleted
    if (!addUpdateIndex) {
      setImages(imageList);
      mapImagesForGallery(imageList);
      setOpen(false);
    }
    // all images are being deleted
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
          imageList[addUpdateIndex[0]].filtered = false
          imageList[addUpdateIndex[0]].filtered_file_url = data.filtered_file_url
          setImages(imageList);
          mapImagesForGallery(imageList);
        }
        setSeverity(data.status);
        setOpen(true);
      })
      );
    }
  };

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
                      },
                      alignContent: 'center',
                      alignItems: 'center'
                  }}
                  className={classes.box}
                >
                  <div className={classes.uploadTitle}>
                    <Typography variant="h6" style={{color: '#EA4D4D'}}>
                      {isDragging ? "Drop here please" : "Drop image here!"}
                    </Typography>
                  </div>
                  <Paper style={{borderRadius: '10px',width: '75vw',
                      height: '75vh', paddingTop: '2vh', animation: `${fadeIn} 5s ease`}} elevation={3}>
                      <br></br>
                      <Gallery images={galleryImages} margin={10} onClick={(index) => filterImage(index)} enableImageSelection={false} />
                  </Paper>
                </Box>
                <div>
                  <Button sx={{ margin: '15px', backgroundColor: '#EA4D4D', '&:hover': {
                                        backgroundColor: '#DC4343',
                                      },
                              }} 
                      variant="contained"
                      onClick={onImageUpload}
                  >
                      Upload Image
                  </Button>
                  <Button sx={{ margin: '15px', color: '#EA4D4D', borderColor: '#EA4D4D', '&:hover': {borderColor: '#DC4343'},}} variant='outlined' onClick={onImageRemoveAll}>Remove all images</Button>
                </div>

            </div>
        )}
      </ImageUploading>
    </div>
  );
}