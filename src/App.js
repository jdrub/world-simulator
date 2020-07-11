import React from 'react';

import { RecoilRoot } from 'recoil';
import WorldMap from './components/WorldMap';

function App() {
  return (
    <RecoilRoot>
        <WorldMap />
    </RecoilRoot>
  );
}

export default App;
