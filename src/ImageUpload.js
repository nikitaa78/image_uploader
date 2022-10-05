import React from 'react';
import ImageUploading from 'react-images-uploading';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Banner from './Banner';


export function ImageUpload() {
  const [images, setImages] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState(0);

  const maxNumber = 10;

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    if (imageList.length == 0) {
      setImages(imageList);
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
        if (data.status == 200) {
          imageList[addUpdateIndex[0]].data_url = data.file_url
          setImages(imageList);
        }
        setSeverity(data.status);
        setOpen(true);
      })
      );
    }
  };

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
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
            <div className='drop-zone' {...dragProps}>
                <Banner open={open} setOpen={setOpen} severity={severity}/>
                <Box
                  sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      '& > :not(style)': {
                      m: 1,
                      width: '50vw',
                      height: '50vh',
                      },
                  }}
                >
                  <Paper elevation={3}>
                      {isDragging ? "Drop here please" : "Upload space"}
                      <br></br>
                      {imageList.map((image, index) => (
                          <img key={index} src={image.data_url} />
                      ))}
                  </Paper>
                </Box>
                <button
                    // style={isDragging ? { color: 'red' } : undefined}
                    onClick={onImageUpload}
                >
                    Upload Image
                </button>
                <button onClick={onImageRemoveAll}>Remove all images</button>
            </div>
        )}
      </ImageUploading>
    </div>
  );
}