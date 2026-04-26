/**
 * KilitReactNative - Web version
 */

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F0F2F5'}}>
      <AppNavigator />
    </div>
  );
}

export default App;
