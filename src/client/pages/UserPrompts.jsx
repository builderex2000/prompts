import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getUserPrompts from '@wasp/queries/getUserPrompts';

export function UserPrompts() {
  const { data: prompts, isLoading, error } = useQuery(getUserPrompts);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  return (
    <div>
      {prompts.map((prompt) => (
        <div key={prompt.id} className='mb-4 p-4 bg-gray-100 rounded-lg'>
          <h2 className='text-xl'>{prompt.title}</h2>
          <p className='text-gray-500'>{prompt.description}</p>
          <p className='text-red-500'>NFT: {prompt.nft ? prompt.nft.name : 'None'}</p>
          <Link to={`/prompt/${prompt.id}`} className='text-blue-500'>Go to Prompt</Link>
        </div>
      ))}
    </div>
  );
}