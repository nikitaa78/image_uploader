import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ImageUpload } from './ImageUpload';
import App from './App';

export default () => (
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App/>} />
      <Route path="/uploader" exact element={<ImageUpload/>} />
    </Routes>
  </BrowserRouter>
);