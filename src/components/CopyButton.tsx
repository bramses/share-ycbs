'use client';

import React from 'react';

type CopyButtonProps = {
  id: string;
};

const CopyButton: React.FC<CopyButtonProps> = ({ id }) => {
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(id);
      }}
    >
      Copy ID to clipboard
    </button>
  );
};

export default CopyButton;