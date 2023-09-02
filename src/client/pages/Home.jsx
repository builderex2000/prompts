import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getPublicPrompts from '@wasp/queries/getPublicPrompts';

export function Home() {
  const { data: prompts, isLoading, error } = useQuery(getPublicPrompts);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  return (
    <div>
      {prompts.map((prompt) => (
        <div key={prompt.id} className='bg-gray-100 p-4 mb-4 rounded-lg'>
          <h2>{prompt.title}</h2>
          <p>{prompt.description}</p>
          <Link to={`/prompt/${prompt.id}`} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2'>
            View Prompt
          </Link>
        </div>
      ))}
    </div>
  );
}