import React from 'react';
import BookTable from './components/Booktable';

import { Container } from '@mui/material';

function App() {
  return (
    <Container>
      <h1>OpenLibrary Dashboard</h1>
      <BookTable />
    </Container>
  );
}

export default App;
