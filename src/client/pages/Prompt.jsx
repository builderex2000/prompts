import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import { useAction } from '@wasp/actions';
import getPrompt from '@wasp/queries/getPrompt';
import updatePrompt from '@wasp/actions/updatePrompt';

export function Prompt() {
  const { promptId } = useParams();
  const { data: prompt, isLoading, error } = useQuery(getPrompt, { promptId });
  const updatePromptFn = useAction(updatePrompt);

  const [isPublic, setIsPublic] = useState(prompt?.isPublic);

  if (isLoading || !prompt) return 'Loading...';
  if (error) return 'Error: ' + error;

  const handleSwitchPublic = async () => {
    const updatedPrompt = { ...prompt, isPublic: !isPublic };
    await updatePromptFn(updatedPrompt);
    setIsPublic(!isPublic);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Prompt Details</h1>

      <div className="mt-4">
        <h2 className="text-xl font-bold">Title:</h2>
        <p>{prompt.title}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold">Description:</h2>
        <p>{prompt.description}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold">Is Public:</h2>
        <p>{isPublic ? 'Yes' : 'No'}</p>
        <button
          onClick={handleSwitchPublic}
          className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
        >
          {isPublic ? 'Make Private' : 'Make Public'}
        </button>
      </div>

      {isPublic && prompt.nft && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Associated NFT:</h2>
          <p>Name: {prompt.nft.name}</p>
          <p>Price: {prompt.nft.price}</p>
          <p>URL: {prompt.nft.url}</p>
        </div>
      )}
    </div>
  );
}