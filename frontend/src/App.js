import React from 'react';
import { Toolbar } from './toolbar';
import { PipelineCanvas } from './ui';
import { useSubmitPipeline } from './submit';
import { HelpPanel } from './HelpPanel';

function App() {
  const { handleSubmit } = useSubmitPipeline();

  return (
    <>
      <Toolbar onSubmit={handleSubmit} />
      <PipelineCanvas />
      <HelpPanel />
    </>
  );
}

export default App;