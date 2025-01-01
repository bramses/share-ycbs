'use client';

import React from 'react';

type CopyButtonProps = {
  id: string;
};

const CopyButton: React.FC<CopyButtonProps> = ({ id }) => {
  return (
    <button
      type="button"
      className='button type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'
      onClick={() => {
        navigator.clipboard.writeText(id);
      }}
    >
      Copy ID to clipboard
    </button>
  );
};

export default CopyButton;